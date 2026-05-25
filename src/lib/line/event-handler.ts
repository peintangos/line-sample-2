import { webhook } from "@line/bot-sdk";
import { lineClient } from "./client";
import { hasUserTokens } from "@/lib/store/users";
import {
  createSession,
  createNonce,
  getSession,
  getActiveSessionForGroup,
  updateSessionStatus,
  setProposedSlots,
} from "@/lib/store/sessions";
import { getAuthUrl } from "@/lib/google/auth";
import { getFreeBusy, findCommonFreeSlots } from "@/lib/google/calendar";
import { suggestSlots } from "@/lib/ai/suggest";
import { buildProposalFlex, buildConfirmFlex } from "./flex-messages";
import { createEvent } from "@/lib/google/calendar";
import { ScheduleSession } from "@/types";

const TRIGGER_PATTERNS = [
  /予定.?合わせ/,
  /日程.?調整/,
  /ミーティング.?(したい|しよう|どう)/,
  /打ち合わせ.?(したい|しよう|どう)/,
  /いつ.?(空い|あい)/,
  /スケジュール.?(合わせ|調整)/,
];

function isTrigger(text: string): boolean {
  return TRIGGER_PATTERNS.some((p) => p.test(text));
}

export async function handleEvent(event: webhook.Event): Promise<void> {
  if (event.type === "message") {
    const messageEvent = event as webhook.MessageEvent;
    if (messageEvent.message.type === "text") {
      const text = (messageEvent.message as webhook.TextMessageContent).text;
      const source = messageEvent.source;

      if (source?.type === "group") {
        const groupSource = source as webhook.GroupSource;
        if (isTrigger(text)) {
          await handleScheduleTrigger(
            groupSource.groupId,
            groupSource.userId!,
            text
          );
          return;
        }

        const session = getActiveSessionForGroup(groupSource.groupId);
        if (session?.status === "waiting_confirm") {
          await handleConfirmation(session, text, groupSource.userId!);
        }
      }
    }
  }

  if (event.type === "postback") {
    const postbackEvent = event as webhook.PostbackEvent;
    const data = new URLSearchParams(postbackEvent.postback.data!);
    const action = data.get("action");

    if (action === "select_slot") {
      const sessionId = data.get("sessionId")!;
      const slotIndex = parseInt(data.get("slotIndex")!, 10);
      const session = getSession(sessionId);
      if (session?.status === "waiting_confirm" && session.proposedSlots) {
        const slot = session.proposedSlots[slotIndex];
        if (slot) {
          await confirmAndCreate(session, slot);
        }
      }
    }
  }
}

async function handleScheduleTrigger(
  groupId: string,
  triggerUserId: string,
  triggerText: string
): Promise<void> {
  const existing = getActiveSessionForGroup(groupId);
  if (existing) {
    await lineClient.pushMessage({
      to: groupId,
      messages: [
        {
          type: "text",
          text: "現在進行中の日程調整があります。完了してから再度お試しください。",
        },
      ],
    });
    return;
  }

  let memberIds: string[];
  try {
    const res = await lineClient.getGroupMembersIds(groupId);
    memberIds = res.memberIds;
  } catch {
    memberIds = [triggerUserId];
  }

  const session = createSession(groupId, triggerUserId, triggerText, memberIds);

  const unauthorizedMembers: string[] = [];
  for (const memberId of memberIds) {
    if (hasUserTokens(memberId)) {
      session.authorizedMembers.add(memberId);
    } else {
      unauthorizedMembers.push(memberId);
    }
  }

  if (unauthorizedMembers.length === 0) {
    await onAllMembersAuthorized(session);
    return;
  }

  for (const memberId of unauthorizedMembers) {
    const nonce = createNonce(session.sessionId, memberId);
    const authUrl = getAuthUrl(nonce);
    try {
      await lineClient.pushMessage({
        to: memberId,
        messages: [
          {
            type: "text",
            text: `📅 グループで日程調整が始まりました！\n\nGoogleカレンダーと連携して、空き時間を自動で確認します。\n以下のリンクから連携してください👇\n${authUrl}`,
          },
        ],
      });
    } catch (e) {
      console.error(`Failed to DM user ${memberId}:`, e);
    }
  }

  const authorizedCount = session.authorizedMembers.size;
  const totalCount = memberIds.length;
  await lineClient.pushMessage({
    to: groupId,
    messages: [
      {
        type: "text",
        text: `📅 日程調整を開始します！\n\n各メンバーにGoogleカレンダー連携をお願いしました。\n連携状況: ${authorizedCount}/${totalCount}人完了\n\n全員の連携が完了したら、候補日程を提案します🙏`,
      },
    ],
  });
}

export async function onAllMembersAuthorized(
  session: ScheduleSession
): Promise<void> {
  updateSessionStatus(session.sessionId, "proposing");

  await lineClient.pushMessage({
    to: session.groupId,
    messages: [
      {
        type: "text",
        text: "全員のカレンダー連携が完了しました！ 📊\n空き時間を確認しています...",
      },
    ],
  });

  const now = new Date();
  const nextWeekStart = new Date(now);
  nextWeekStart.setDate(now.getDate() + ((8 - now.getDay()) % 7 || 7));
  nextWeekStart.setHours(0, 0, 0, 0);
  const nextWeekEnd = new Date(nextWeekStart);
  nextWeekEnd.setDate(nextWeekStart.getDate() + 5);

  const timeMin = nextWeekStart.toISOString();
  const timeMax = nextWeekEnd.toISOString();

  const busyByUser = new Map<string, { start: string; end: string }[]>();
  for (const memberId of session.members) {
    try {
      const busy = await getFreeBusy(memberId, timeMin, timeMax);
      busyByUser.set(memberId, busy);
    } catch (e) {
      console.error(`Failed to get freebusy for ${memberId}:`, e);
      busyByUser.set(memberId, []);
    }
  }

  const freeSlots = findCommonFreeSlots(busyByUser, timeMin, timeMax);

  if (freeSlots.length === 0) {
    await lineClient.pushMessage({
      to: session.groupId,
      messages: [
        {
          type: "text",
          text: "来週の営業時間内に全員の共通空き時間が見つかりませんでした😢\n別の期間で試してみてください。",
        },
      ],
    });
    updateSessionStatus(session.sessionId, "done");
    return;
  }

  const suggestions = await suggestSlots(freeSlots, session.triggerText);
  setProposedSlots(session.sessionId, suggestions);
  updateSessionStatus(session.sessionId, "waiting_confirm");

  const flexMessage = buildProposalFlex(session.sessionId, suggestions);
  await lineClient.pushMessage({
    to: session.groupId,
    messages: [flexMessage],
  });
}

async function handleConfirmation(
  session: ScheduleSession,
  text: string,
  _userId: string
): Promise<void> {
  if (!session.proposedSlots) return;

  const match = text.match(/^([1-3])$/);
  if (!match) return;

  const slotIndex = parseInt(match[1], 10) - 1;
  const slot = session.proposedSlots[slotIndex];
  if (!slot) return;

  await confirmAndCreate(session, slot);
}

async function confirmAndCreate(
  session: ScheduleSession,
  slot: { start: string; end: string; label: string }
): Promise<void> {
  updateSessionStatus(session.sessionId, "done");

  for (const memberId of session.members) {
    try {
      await createEvent(memberId, "ミーティング", slot.start, slot.end);
    } catch (e) {
      console.error(`Failed to create event for ${memberId}:`, e);
    }
  }

  const confirmFlex = buildConfirmFlex(slot);
  await lineClient.pushMessage({
    to: session.groupId,
    messages: [confirmFlex],
  });
}
