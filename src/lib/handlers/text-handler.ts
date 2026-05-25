import { webhook } from "@line/bot-sdk";
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
} from "@/lib/line/message-demos";
import { quickReplyDemo } from "@/lib/line/action-demos";

const KEYWORD_MAP: Record<string, (userId?: string) => import("@line/bot-sdk").messagingApi.Message[]> = {
  "テキスト": () => textDemo(),
  "テキストv2": (userId) => textV2Demo(userId),
  "スタンプ": () => stickerDemo(),
  "画像": () => imageDemo(),
  "動画": () => videoDemo(),
  "音声": () => audioDemo(),
  "位置情報": () => locationDemo(),
  "イメージマップ": () => imagemapDemo(),
  "テンプレート": () => templateDemo(),
  "flex": () => flexDemo(),
  "Flex": () => flexDemo(),
  "クイックリプライ": () => quickReplyDemo(),
  "quickreply": () => quickReplyDemo(),
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
            ? {
                type: "image",
                url: profile.pictureUrl,
                size: "full",
                aspectRatio: "1:1",
                aspectMode: "cover",
              }
            : undefined,
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "名前", size: "sm", color: "#888888", flex: 1 },
                  { type: "text", text: profile.displayName, size: "sm", flex: 3, weight: "bold" },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "userId", size: "sm", color: "#888888", flex: 1 },
                  { type: "text", text: userId.slice(0, 16) + "...", size: "xs", flex: 3 },
                ],
                margin: "sm",
              },
              ...(profile.statusMessage
                ? [
                    {
                      type: "box" as const,
                      layout: "horizontal" as const,
                      contents: [
                        { type: "text" as const, text: "ステータス", size: "sm" as const, color: "#888888", flex: 1 },
                        { type: "text" as const, text: profile.statusMessage, size: "sm" as const, flex: 3, wrap: true },
                      ],
                      margin: "sm" as const,
                    },
                  ]
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

import { messagingApi } from "@line/bot-sdk";

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
              type: "box",
              layout: "vertical",
              contents: [
                { type: "text", text: "👥 グループ情報", weight: "bold", size: "lg", color: "#FFFFFF" },
              ],
              backgroundColor: "#06C755",
              paddingAll: "lg",
            },
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    { type: "text", text: "名前", size: "sm", color: "#888888", flex: 1 },
                    { type: "text", text: summary.groupName, size: "sm", flex: 3, weight: "bold" },
                  ],
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    { type: "text", text: "メンバー数", size: "sm", color: "#888888", flex: 1 },
                    { type: "text", text: `${memberCount}人`, size: "sm", flex: 3 },
                  ],
                  margin: "sm",
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    { type: "text", text: "groupId", size: "sm", color: "#888888", flex: 1 },
                    { type: "text", text: groupId.slice(0, 16) + "...", size: "xs", flex: 3 },
                  ],
                  margin: "sm",
                },
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

async function handleHelp(replyToken: string): Promise<void> {
  await lineClient.replyMessage({
    replyToken,
    messages: [
      {
        type: "flex",
        altText: "使い方ガイド",
        contents: {
          type: "bubble",
          header: {
            type: "box",
            layout: "vertical",
            contents: [
              { type: "text", text: "📖 LINE API ショーケース", weight: "bold", size: "lg", color: "#FFFFFF" },
            ],
            backgroundColor: "#06C755",
            paddingAll: "lg",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              { type: "text", text: "【メッセージタイプ】", weight: "bold", size: "sm", color: "#06C755" },
              { type: "text", text: "テキスト / テキストv2 / スタンプ / 画像 / 動画 / 音声 / 位置情報 / イメージマップ / テンプレート / Flex", size: "xs", wrap: true, margin: "sm" },
              { type: "separator", margin: "lg" },
              { type: "text", text: "【インタラクション】", weight: "bold", size: "sm", color: "#06C755", margin: "lg" },
              { type: "text", text: "クイックリプライ / プロフィール / グループ情報", size: "xs", wrap: true, margin: "sm" },
              { type: "separator", margin: "lg" },
              { type: "text", text: "【受信テスト】", weight: "bold", size: "sm", color: "#06C755", margin: "lg" },
              { type: "text", text: "画像・動画・音声・ファイル・位置情報・スタンプを送ってみてください", size: "xs", wrap: true, margin: "sm" },
            ],
            paddingAll: "lg",
          },
        },
      } as messagingApi.FlexMessage,
    ],
  });
}
