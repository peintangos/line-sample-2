import { messagingApi } from "@line/bot-sdk";

export function quickReplyDemo(): messagingApi.Message[] {
  return [
    {
      type: "text",
      text: "Quick Replyで全9種類のアクションを試せます 👇",
      quickReply: {
        items: [
          {
            type: "action",
            action: {
              type: "postback",
              label: "ポストバック",
              data: "action=quick_postback&value=hello",
              displayText: "ポストバックを送信しました",
            },
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "メッセージ",
              text: "Quick Replyからのメッセージ！",
            },
          },
          {
            type: "action",
            action: {
              type: "uri",
              label: "URI（Web）",
              uri: "https://developers.line.biz/",
            },
          },
          {
            type: "action",
            action: {
              type: "datetimepicker",
              label: "日時選択",
              data: "action=datetime",
              mode: "datetime",
            },
          },
          {
            type: "action",
            action: {
              type: "camera",
              label: "カメラ起動",
            },
          },
          {
            type: "action",
            action: {
              type: "cameraRoll",
              label: "カメラロール",
            },
          },
          {
            type: "action",
            action: {
              type: "location",
              label: "位置情報送信",
            },
          },
          {
            type: "action",
            action: {
              type: "clipboard",
              label: "クリップボード",
              clipboardText: "LINE Messaging API ショーケース Bot",
            } as messagingApi.Action,
          },
        ],
      },
    },
  ];
}
