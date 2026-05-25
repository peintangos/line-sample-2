import { messagingApi } from "@line/bot-sdk";

const BASE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com";

export function textDemo(): messagingApi.Message[] {
  return [
    {
      type: "text",
      text: "これはテキストメッセージです 🎉\nLINE絵文字も使えます $",
      emojis: [
        { index: 23, productId: "5ac1bfd5040ab15980c9b435", emojiId: "001" },
      ],
    },
  ];
}

export function textV2Demo(userId?: string): messagingApi.Message[] {
  if (!userId) {
    return [{ type: "text", text: "テキストv2はユーザーコンテキストが必要です" }];
  }
  return [
    {
      type: "textV2",
      text: "こんにちは {user} さん！\nテキストv2ではメンションが使えます 🙌",
      substitution: {
        user: { type: "mention", mentionee: { type: "user", userId } },
      },
    } as messagingApi.Message,
  ];
}

export function stickerDemo(): messagingApi.Message[] {
  return [
    { type: "sticker", packageId: "446", stickerId: "1988" },
    { type: "sticker", packageId: "789", stickerId: "10855" },
  ];
}

export function imageDemo(): messagingApi.Message[] {
  return [
    {
      type: "image",
      originalContentUrl: `${BASE_URL}/assets/sample-image.png`,
      previewImageUrl: `${BASE_URL}/assets/sample-image.png`,
    },
  ];
}

export function videoDemo(): messagingApi.Message[] {
  return [
    {
      type: "video",
      originalContentUrl: `${BASE_URL}/assets/sample-video.mp4`,
      previewImageUrl: `${BASE_URL}/assets/sample-image.png`,
    },
  ];
}

export function audioDemo(): messagingApi.Message[] {
  return [
    {
      type: "audio",
      originalContentUrl: `${BASE_URL}/assets/sample-audio.m4a`,
      duration: 3000,
    },
  ];
}

export function locationDemo(): messagingApi.Message[] {
  return [
    {
      type: "location",
      title: "LINE株式会社",
      address: "東京都新宿区四谷一丁目6番1号",
      latitude: 35.6867,
      longitude: 139.7254,
    },
  ];
}

export function imagemapDemo(): messagingApi.Message[] {
  return [
    {
      type: "imagemap",
      baseUrl: `${BASE_URL}/assets/imagemap`,
      altText: "イメージマップデモ",
      baseSize: { width: 1040, height: 520 },
      actions: [
        {
          type: "uri",
          linkUri: "https://developers.line.biz/",
          area: { x: 0, y: 0, width: 520, height: 520 },
        },
        {
          type: "message",
          text: "右側をタップしました！",
          area: { x: 520, y: 0, width: 520, height: 520 },
        },
      ],
    },
  ];
}

export function templateDemo(): messagingApi.Message[] {
  return [
    {
      type: "template",
      altText: "ボタンテンプレート",
      template: {
        type: "buttons",
        title: "ボタンテンプレート",
        text: "各種アクションを試せます",
        actions: [
          { type: "postback", label: "ポストバック", data: "action=template_postback" },
          { type: "message", label: "メッセージ", text: "テンプレートからのメッセージ！" },
          { type: "uri", label: "LINE Developers", uri: "https://developers.line.biz/" },
        ],
      },
    },
    {
      type: "template",
      altText: "確認テンプレート",
      template: {
        type: "confirm",
        text: "LINE Messaging API、楽しいですか？",
        actions: [
          { type: "postback", label: "はい！", data: "action=confirm_yes" },
          { type: "postback", label: "もちろん！", data: "action=confirm_yes" },
        ],
      },
    },
    {
      type: "template",
      altText: "カルーセルテンプレート",
      template: {
        type: "carousel",
        columns: [
          {
            title: "Messaging API",
            text: "メッセージの送受信",
            actions: [
              { type: "uri", label: "ドキュメント", uri: "https://developers.line.biz/ja/docs/messaging-api/" },
            ],
          },
          {
            title: "LIFF",
            text: "LINE内Webアプリ",
            actions: [
              { type: "uri", label: "ドキュメント", uri: "https://developers.line.biz/ja/docs/liff/" },
            ],
          },
          {
            title: "LINE Login",
            text: "LINEアカウントでログイン",
            actions: [
              { type: "uri", label: "ドキュメント", uri: "https://developers.line.biz/ja/docs/line-login/" },
            ],
          },
        ],
      },
    },
  ];
}

export function flexDemo(): messagingApi.Message[] {
  return [
    {
      type: "flex",
      altText: "Flex Messageデモ",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "🎨 Flex Message",
              weight: "bold",
              size: "xl",
              color: "#FFFFFF",
            },
          ],
          backgroundColor: "#06C755",
          paddingAll: "lg",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "CSS Flexboxベースの自由なレイアウト",
              wrap: true,
              size: "sm",
            },
            {
              type: "separator",
              margin: "lg",
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    { type: "text", text: "メッセージ種類", size: "xs", color: "#888888" },
                    { type: "text", text: "10種類", size: "lg", weight: "bold" },
                  ],
                  flex: 1,
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    { type: "text", text: "アクション種類", size: "xs", color: "#888888" },
                    { type: "text", text: "9種類", size: "lg", weight: "bold" },
                  ],
                  flex: 1,
                },
              ],
              margin: "lg",
            },
          ],
          paddingAll: "lg",
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              action: {
                type: "uri",
                label: "Flex Message Simulator",
                uri: "https://developers.line.biz/flex-simulator/",
              },
              style: "primary",
              color: "#06C755",
            },
          ],
          paddingAll: "md",
        },
      },
    } as messagingApi.FlexMessage,
  ];
}
