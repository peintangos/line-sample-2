import { messagingApi } from "@line/bot-sdk";
import { lineClient } from "@/lib/line/client";

export function sendMethodsExplanation(): messagingApi.Message[] {
  return [
    {
      type: "flex",
      altText: "送信方法一覧",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            { type: "text", text: "📨 5つの送信方法", weight: "bold", size: "lg", color: "#FFFFFF" },
          ],
          backgroundColor: "#06C755",
          paddingAll: "lg",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            { type: "text", text: "① Reply（応答）", weight: "bold", size: "sm" },
            { type: "text", text: "replyTokenで即応答。この表示に使用中", size: "xs", color: "#888888", wrap: true },
            { type: "separator", margin: "md" },
            { type: "text", text: "② Push", weight: "bold", size: "sm", margin: "md" },
            { type: "text", text: "任意タイミングで1ユーザー/グループに送信", size: "xs", color: "#888888", wrap: true },
            { type: "separator", margin: "md" },
            { type: "text", text: "③ Multicast", weight: "bold", size: "sm", margin: "md" },
            { type: "text", text: "複数ユーザーIDに一斉送信", size: "xs", color: "#888888", wrap: true },
            { type: "separator", margin: "md" },
            { type: "text", text: "④ Narrowcast", weight: "bold", size: "sm", margin: "md" },
            { type: "text", text: "属性(年齢/性別/地域)やオーディエンスで絞込み配信", size: "xs", color: "#888888", wrap: true },
            { type: "separator", margin: "md" },
            { type: "text", text: "⑤ Broadcast", weight: "bold", size: "sm", margin: "md" },
            { type: "text", text: "全友だちに一括配信", size: "xs", color: "#888888", wrap: true },
          ],
          paddingAll: "lg",
        },
      },
    } as messagingApi.FlexMessage,
    {
      type: "text",
      text: "💡 通数は送信対象の「人数」でカウント。\n1リクエスト内のメッセージ数は関係なし。\n\n「Push送信」と送ると Push メッセージのデモができます。",
    },
  ];
}

export async function pushDemo(userId: string): Promise<void> {
  await lineClient.pushMessage({
    to: userId,
    messages: [
      {
        type: "text",
        text: "📤 これは Push メッセージです！\n\nreplyToken なしで、任意のタイミングに送信できます。",
      },
    ],
  });
}

export async function multicastDemo(userId: string): Promise<void> {
  await lineClient.multicast({
    to: [userId],
    messages: [
      {
        type: "text",
        text: "📤 これは Multicast メッセージです！\n\n複数のユーザーIDに同じメッセージを一斉送信できます。\n（デモでは自分だけに送信しています）",
      },
    ],
  });
}
