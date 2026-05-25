import { webhook, messagingApi } from "@line/bot-sdk";
import { lineClient } from "@/lib/line/client";
import {
  textDemo,
  textV2Demo,
  stickerDemo,
  imageDemo,
  videoDemo,
  audioDemo,
  locationDemo,
  imagemapDemo,
  templateDemo,
  flexDemo,
  imageCarouselDemo,
  senderDemo,
} from "@/lib/line/message-demos";
import { quickReplyDemo } from "@/lib/line/action-demos";
import { sendMethodsExplanation, pushDemo, multicastDemo } from "./send-methods";

const KEYWORD_MAP: Record<string, (userId?: string) => messagingApi.Message[]> = {
  "テキスト": () => textDemo(),
  "テキストv2": (userId) => textV2Demo(userId),
  "スタンプ": () => stickerDemo(),
  "画像": () => imageDemo(),
  "動画": () => videoDemo(),
  "音声": () => audioDemo(),
  "位置情報": () => locationDemo(),
  "イメージマップ": () => imagemapDemo(),
  "テンプレート": () => templateDemo(),
  "画像カルーセル": () => imageCarouselDemo(),
  "flex": () => flexDemo(),
  "Flex": () => flexDemo(),
  "sender": () => senderDemo(),
  "Sender": () => senderDemo(),
  "クイックリプライ": () => quickReplyDemo(),
  "quickreply": () => quickReplyDemo(),
  "送信方法": () => sendMethodsExplanation(),
};

export async function handleTextMessage(
  replyToken: string,
  text: string,
  source: webhook.Source
): Promise<void> {
  const trimmed = text.trim();
  const userId = (source as webhook.UserSource).userId;

  if (trimmed === "プロフィール") {
    await handleProfile(replyToken, userId);
    return;
  }

  if (trimmed === "グループ情報" && source.type === "group") {
    await handleGroupInfo(replyToken, (source as webhook.GroupSource).groupId);
    return;
  }

  if (trimmed === "メンバー一覧" && source.type === "group") {
    await handleMemberList(replyToken, (source as webhook.GroupSource).groupId);
    return;
  }

  if (trimmed === "フォロワー数") {
    await handleFollowerCount(replyToken);
    return;
  }

  if (trimmed === "Push送信" && userId) {
    await lineClient.replyMessage({
      replyToken,
      messages: [{ type: "text", text: "Push メッセージを送信します..." }],
    });
    await pushDemo(userId);
    return;
  }

  if (trimmed === "マルチキャスト" && userId) {
    await lineClient.replyMessage({
      replyToken,
      messages: [{ type: "text", text: "Multicast メッセージを送信します..." }],
    });
    await multicastDemo(userId);
    return;
  }

  if (trimmed === "アカウント連携") {
    await handleAccountLinkExplanation(replyToken);
    return;
  }

  if (trimmed === "ビーコン") {
    await handleBeaconExplanation(replyToken);
    return;
  }

  if (trimmed === "ヘルプ" || trimmed === "help") {
    await handleHelp(replyToken);
    return;
  }

  const demoFn = KEYWORD_MAP[trimmed];
  if (demoFn) {
    const messages = demoFn(userId ?? undefined);
    await lineClient.replyMessage({ replyToken, messages });
    return;
  }

  await lineClient.replyMessage({
    replyToken,
    messages: [
      {
        type: "text",
        text: `「${trimmed}」を受信しました。\n\n「ヘルプ」と送ると使えるコマンド一覧を表示します。`,
      },
    ],
  });
}

async function handleProfile(replyToken: string, userId?: string): Promise<void> {
  if (!userId) {
    await lineClient.replyMessage({
      replyToken,
      messages: [{ type: "text", text: "ユーザー情報を取得できませんでした" }],
    });
    return;
  }

  const profile = await lineClient.getProfile(userId);
  await lineClient.replyMessage({
    replyToken,
    messages: [
      {
        type: "flex",
        altText: "プロフィール情報",
        contents: {
          type: "bubble",
          header: {
            type: "box",
            layout: "vertical",
            contents: [
              { type: "text", text: "👤 プロフィール", weight: "bold", size: "lg", color: "#FFFFFF" },
            ],
            backgroundColor: "#06C755",
            paddingAll: "lg",
          },
          hero: profile.pictureUrl
            ? { type: "image", url: profile.pictureUrl, size: "full", aspectRatio: "1:1", aspectMode: "cover" }
            : undefined,
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "box", layout: "horizontal",
                contents: [
                  { type: "text", text: "名前", size: "sm", color: "#888888", flex: 1 },
                  { type: "text", text: profile.displayName, size: "sm", flex: 3, weight: "bold" },
                ],
              },
              {
                type: "box", layout: "horizontal", margin: "sm",
                contents: [
                  { type: "text", text: "userId", size: "sm", color: "#888888", flex: 1 },
                  { type: "text", text: userId.slice(0, 16) + "...", size: "xs", flex: 3 },
                ],
              },
              ...(profile.statusMessage
                ? [{
                    type: "box" as const, layout: "horizontal" as const, margin: "sm" as const,
                    contents: [
                      { type: "text" as const, text: "ステータス", size: "sm" as const, color: "#888888", flex: 1 },
                      { type: "text" as const, text: profile.statusMessage, size: "sm" as const, flex: 3, wrap: true },
                    ],
                  }]
                : []),
            ],
            paddingAll: "lg",
            spacing: "sm",
          },
        },
      } as messagingApi.FlexMessage,
    ],
  });
}

async function handleGroupInfo(replyToken: string, groupId: string): Promise<void> {
  try {
    const [summary, memberCount] = await Promise.all([
      lineClient.getGroupSummary(groupId),
      lineClient.getGroupMemberCount(groupId),
    ]);

    await lineClient.replyMessage({
      replyToken,
      messages: [
        {
          type: "flex",
          altText: "グループ情報",
          contents: {
            type: "bubble",
            header: {
              type: "box", layout: "vertical",
              contents: [{ type: "text", text: "👥 グループ情報", weight: "bold", size: "lg", color: "#FFFFFF" }],
              backgroundColor: "#06C755", paddingAll: "lg",
            },
            body: {
              type: "box", layout: "vertical",
              contents: [
                { type: "box", layout: "horizontal", contents: [
                  { type: "text", text: "名前", size: "sm", color: "#888888", flex: 1 },
                  { type: "text", text: summary.groupName, size: "sm", flex: 3, weight: "bold" },
                ]},
                { type: "box", layout: "horizontal", margin: "sm", contents: [
                  { type: "text", text: "メンバー数", size: "sm", color: "#888888", flex: 1 },
                  { type: "text", text: `${memberCount}人`, size: "sm", flex: 3 },
                ]},
                { type: "box", layout: "horizontal", margin: "sm", contents: [
                  { type: "text", text: "groupId", size: "sm", color: "#888888", flex: 1 },
                  { type: "text", text: groupId.slice(0, 16) + "...", size: "xs", flex: 3 },
                ]},
              ],
              paddingAll: "lg",
            },
          },
        } as messagingApi.FlexMessage,
      ],
    });
  } catch {
    await lineClient.replyMessage({
      replyToken,
      messages: [{ type: "text", text: "グループ情報の取得に失敗しました" }],
    });
  }
}

async function handleMemberList(replyToken: string, groupId: string): Promise<void> {
  try {
    const res = await lineClient.getGroupMembersIds(groupId);
    const memberIds = res.memberIds;
    const profiles = await Promise.all(
      memberIds.slice(0, 10).map(async (id) => {
        try {
          const p = await lineClient.getGroupMemberProfile(groupId, id);
          return p.displayName;
        } catch {
          return id.slice(0, 8) + "...";
        }
      })
    );
    const list = profiles.map((name, i) => `${i + 1}. ${name}`).join("\n");
    const more = memberIds.length > 10 ? `\n...他 ${memberIds.length - 10}人` : "";

    await lineClient.replyMessage({
      replyToken,
      messages: [{
        type: "text",
        text: `👥 グループメンバー一覧（getGroupMembersIds）\n\n${list}${more}\n\n合計: ${memberIds.length}人`,
      }],
    });
  } catch {
    await lineClient.replyMessage({
      replyToken,
      messages: [{ type: "text", text: "メンバー一覧の取得に失敗しました" }],
    });
  }
}

async function handleFollowerCount(replyToken: string): Promise<void> {
  try {
    const res = await lineClient.getFollowers();
    const count = res.userIds.length;
    const hasNext = !!res.next;
    await lineClient.replyMessage({
      replyToken,
      messages: [{
        type: "text",
        text: `📊 フォロワー情報（getFollowers）\n\n取得数: ${count}人${hasNext ? "（続きあり）" : ""}\n\n💡 getFollowers API でユーザーID一覧を取得できます`,
      }],
    });
  } catch {
    await lineClient.replyMessage({
      replyToken,
      messages: [{ type: "text", text: "フォロワー情報の取得に失敗しました" }],
    });
  }
}

async function handleAccountLinkExplanation(replyToken: string): Promise<void> {
  await lineClient.replyMessage({
    replyToken,
    messages: [{
      type: "flex",
      altText: "アカウント連携",
      contents: {
        type: "bubble",
        header: {
          type: "box", layout: "vertical",
          contents: [{ type: "text", text: "🔗 アカウント連携", weight: "bold", size: "lg", color: "#FFFFFF" }],
          backgroundColor: "#06C755", paddingAll: "lg",
        },
        body: {
          type: "box", layout: "vertical",
          contents: [
            { type: "text", text: "LINEアカウントと自社サービスを紐づける機能", wrap: true, size: "sm" },
            { type: "separator", margin: "lg" },
            { type: "text", text: "フロー:", weight: "bold", size: "sm", margin: "lg" },
            { type: "text", text: "1. linkToken発行（10分有効）\n2. ユーザーに連携URL送信\n3. 自社サービスでログイン\n4. nonce付きでリダイレクト\n5. accountLink Webhookで完了検知", size: "xs", wrap: true, margin: "sm", color: "#888888" },
          ],
          paddingAll: "lg",
        },
      },
    } as messagingApi.FlexMessage],
  });
}

async function handleBeaconExplanation(replyToken: string): Promise<void> {
  await lineClient.replyMessage({
    replyToken,
    messages: [{
      type: "flex",
      altText: "LINE Beacon",
      contents: {
        type: "bubble",
        header: {
          type: "box", layout: "vertical",
          contents: [{ type: "text", text: "📡 LINE Beacon", weight: "bold", size: "lg", color: "#FFFFFF" }],
          backgroundColor: "#06C755", paddingAll: "lg",
        },
        body: {
          type: "box", layout: "vertical",
          contents: [
            { type: "text", text: "物理ビーコンデバイスと連携する機能", wrap: true, size: "sm" },
            { type: "separator", margin: "lg" },
            { type: "text", text: "イベントタイプ:", weight: "bold", size: "sm", margin: "lg" },
            { type: "text", text: "• enter: ビーコン圏内に進入\n• leave: ビーコン圏外に退出\n• banner: ビーコンバナーをタップ", size: "xs", wrap: true, margin: "sm", color: "#888888" },
            { type: "separator", margin: "lg" },
            { type: "text", text: "※ 実機ビーコンが必要。このBotではbeacon Webhookイベントのハンドラを実装済み", size: "xs", wrap: true, margin: "lg", color: "#AAAAAA" },
          ],
          paddingAll: "lg",
        },
      },
    } as messagingApi.FlexMessage],
  });
}

async function handleHelp(replyToken: string): Promise<void> {
  await lineClient.replyMessage({
    replyToken,
    messages: [
      {
        type: "flex",
        altText: "使い方ガイド",
        contents: {
          type: "carousel",
          contents: [
            {
              type: "bubble",
              header: {
                type: "box", layout: "vertical",
                contents: [{ type: "text", text: "📖 メッセージタイプ", weight: "bold", size: "md", color: "#FFFFFF" }],
                backgroundColor: "#06C755", paddingAll: "lg",
              },
              body: {
                type: "box", layout: "vertical",
                contents: [
                  { type: "text", text: "テキスト / テキストv2\nスタンプ / 画像 / 動画\n音声 / 位置情報\nイメージマップ\nテンプレート / 画像カルーセル\nFlex / sender", size: "xs", wrap: true },
                ],
                paddingAll: "lg",
              },
            },
            {
              type: "bubble",
              header: {
                type: "box", layout: "vertical",
                contents: [{ type: "text", text: "⚡ インタラクション", weight: "bold", size: "md", color: "#FFFFFF" }],
                backgroundColor: "#00B900", paddingAll: "lg",
              },
              body: {
                type: "box", layout: "vertical",
                contents: [
                  { type: "text", text: "クイックリプライ\nプロフィール\nグループ情報\nメンバー一覧\nフォロワー数", size: "xs", wrap: true },
                ],
                paddingAll: "lg",
              },
            },
            {
              type: "bubble",
              header: {
                type: "box", layout: "vertical",
                contents: [{ type: "text", text: "📨 送信・その他", weight: "bold", size: "md", color: "#FFFFFF" }],
                backgroundColor: "#009900", paddingAll: "lg",
              },
              body: {
                type: "box", layout: "vertical",
                contents: [
                  { type: "text", text: "送信方法（5種解説）\nPush送信 / マルチキャスト\nアカウント連携\nビーコン\n\n画像/動画/スタンプ等を\n送ってみてください", size: "xs", wrap: true },
                ],
                paddingAll: "lg",
              },
            },
          ],
        },
      } as messagingApi.FlexMessage,
    ],
  });
}
