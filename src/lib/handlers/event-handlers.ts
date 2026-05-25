import { webhook, messagingApi } from "@line/bot-sdk";
import { lineClient } from "@/lib/line/client";

export async function handleFollow(event: webhook.FollowEvent): Promise<void> {
  const replyToken = event.replyToken;
  if (!replyToken) return;

  await lineClient.replyMessage({
    replyToken,
    messages: [
      {
        type: "flex",
        altText: "友だち追加ありがとうございます！",
        contents: {
          type: "bubble",
          header: {
            type: "box",
            layout: "vertical",
            contents: [
              { type: "text", text: "🎉 友だち追加ありがとう！", weight: "bold", size: "lg", color: "#FFFFFF" },
            ],
            backgroundColor: "#06C755",
            paddingAll: "lg",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              { type: "text", text: "LINE Messaging API ショーケース Bot です。", wrap: true, size: "sm" },
              { type: "text", text: "様々なメッセージタイプや機能をデモします。", wrap: true, size: "sm", margin: "md" },
              { type: "separator", margin: "lg" },
              { type: "text", text: "「ヘルプ」と送ると使い方が表示されます", size: "xs", color: "#888888", margin: "lg", wrap: true },
            ],
            paddingAll: "lg",
          },
        },
      } as messagingApi.FlexMessage,
    ],
  });
}

export async function handleJoin(event: webhook.JoinEvent): Promise<void> {
  const replyToken = event.replyToken;
  if (!replyToken) return;

  await lineClient.replyMessage({
    replyToken,
    messages: [
      {
        type: "text",
        text: "👋 グループに参加しました！\nLINE Messaging API ショーケース Bot です。\n\n「ヘルプ」と送ると使い方が表示されます。",
      },
    ],
  });
}

export async function handleMemberJoined(
  event: webhook.MemberJoinedEvent
): Promise<void> {
  const replyToken = event.replyToken;
  if (!replyToken) return;

  const members = event.joined?.members ?? [];
  const names: string[] = [];

  for (const member of members) {
    if (member.type === "user" && member.userId) {
      try {
        const source = event.source;
        if (source?.type === "group") {
          const profile = await lineClient.getGroupMemberProfile(
            (source as webhook.GroupSource).groupId,
            member.userId
          );
          names.push(profile.displayName);
        }
      } catch {
        names.push("新メンバー");
      }
    }
  }

  if (names.length > 0) {
    await lineClient.replyMessage({
      replyToken,
      messages: [
        { type: "text", text: `🎉 ${names.join("さん、")}さんが参加しました！` },
      ],
    });
  }
}

export async function handlePostback(
  event: webhook.PostbackEvent
): Promise<void> {
  const data = new URLSearchParams(event.postback.data ?? "");
  const action = data.get("action");
  const replyToken = event.replyToken;
  if (!replyToken) return;

  if (event.postback.params) {
    const params = event.postback.params as Record<string, string>;
    const dateInfo = params.datetime ?? params.date ?? params.time ?? "";
    await lineClient.replyMessage({
      replyToken,
      messages: [
        {
          type: "text",
          text: `📅 日時選択の結果:\n${dateInfo}\n\npostback.params で受け取れます`,
        },
      ],
    });
    return;
  }

  await lineClient.replyMessage({
    replyToken,
    messages: [
      {
        type: "text",
        text: `📩 ポストバック受信\naction: ${action ?? "なし"}\ndata: ${event.postback.data}`,
      },
    ],
  });
}

export async function handleUnsend(event: webhook.UnsendEvent): Promise<void> {
  const source = event.source;
  if (!source) return;

  const userId = (source as webhook.UserSource).userId;
  if (!userId) return;

  try {
    await lineClient.pushMessage({
      to: userId,
      messages: [
        {
          type: "text",
          text: "🗑️ メッセージの送信取消を検知しました\n\nunsend イベントで messageId を受け取れます",
        },
      ],
    });
  } catch {
    // DMが送れない場合は無視
  }
}

export async function handleVideoPlayComplete(
  event: webhook.VideoPlayCompleteEvent
): Promise<void> {
  const replyToken = event.replyToken;
  if (!replyToken) return;

  const trackingId = event.videoPlayComplete?.trackingId;
  await lineClient.replyMessage({
    replyToken,
    messages: [
      {
        type: "text",
        text: `🎬 動画を最後まで見てくれてありがとう！\n\nvideoPlayComplete イベントで検知できます\ntrackingId: ${trackingId ?? "なし"}`,
      },
    ],
  });
}

export async function handleBeacon(
  event: webhook.BeaconEvent
): Promise<void> {
  const replyToken = event.replyToken;
  if (!replyToken) return;

  const beacon = event.beacon;
  await lineClient.replyMessage({
    replyToken,
    messages: [
      {
        type: "text",
        text: `📡 ビーコンイベント検知！\n\nタイプ: ${beacon.type}\nhwid: ${beacon.hwid}\ndeviceMessage: ${beacon.dm ?? "なし"}`,
      },
    ],
  });
}

export async function handleAccountLink(
  event: webhook.AccountLinkEvent
): Promise<void> {
  const replyToken = event.replyToken;
  if (!replyToken) return;

  const link = event.link;
  await lineClient.replyMessage({
    replyToken,
    messages: [
      {
        type: "text",
        text: `🔗 アカウント連携イベント\n\n結果: ${link.result}\nnonce: ${link.nonce}`,
      },
    ],
  });
}
