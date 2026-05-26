import { messagingApi } from "@line/bot-sdk";
import { lineClient } from "@/lib/line/client";

// ─── デモ1: Loading + 非同期 Push + Flex ───

export async function demo1LoadingFlex(
  replyToken: string,
  userId: string
): Promise<void> {
  await lineClient.replyMessage({
    replyToken,
    messages: [
      {
        type: "text",
        text: "🔍 渋谷のおすすめランチを検索中...",
      },
    ],
  });

  await lineClient.showLoadingAnimation({
    chatId: userId,
    loadingSeconds: 15,
  });

  await sleep(3000);

  await lineClient.pushMessage({
    to: userId,
    messages: [
      {
        type: "flex",
        altText: "渋谷ランチ おすすめ3選",
        contents: {
          type: "carousel",
          contents: [
            restaurantBubble(
              "🍜",
              "らーめん はやし",
              "道玄坂の行列店。食べログ百名店9年連続選出。",
              "味玉らーめん",
              "¥1,100",
              "⭐ 3.78（食べログ）",
              `https://www.google.com/maps/search/${encodeURIComponent("らーめん はやし 渋谷")}`
            ),
            restaurantBubble(
              "🍛",
              "エリックサウス マサラダイナー",
              "本場の南インド料理をカジュアルに。IT界隈にファン多数。",
              "ランチカレー3種プレート",
              "¥1,000",
              "⭐ 3.58（食べログ）",
              `https://www.google.com/maps/search/${encodeURIComponent("エリックサウス マサラダイナー 神宮前")}`
            ),
            restaurantBubble(
              "🍖",
              "山本のハンバーグ 渋谷食堂",
              "黒毛和牛100%、ライスおかわり無料。2008年創業の名物店。",
              "俺のハンバーグ",
              "¥1,600",
              "⭐ 3.55（食べログ）",
              `https://www.google.com/maps/search/${encodeURIComponent("山本のハンバーグ 渋谷食堂")}`
            ),
          ],
        },
      } as messagingApi.FlexMessage,
    ],
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function restaurantBubble(
  emoji: string,
  name: string,
  description: string,
  menu: string,
  price: string,
  rating: string,
  mapUrl: string
): messagingApi.FlexBubble {
  return {
    type: "bubble",
    size: "kilo",
    header: {
      type: "box",
      layout: "horizontal",
      contents: [
        { type: "text", text: emoji, flex: 0, size: "xxl" },
        {
          type: "box",
          layout: "vertical",
          contents: [
            { type: "text", text: name, weight: "bold", size: "md", wrap: true },
            { type: "text", text: rating, size: "xs", color: "#FFB300", margin: "xs" },
          ],
          flex: 1,
          paddingStart: "md",
        },
      ],
      backgroundColor: "#FFF8E1",
      paddingAll: "lg",
      alignItems: "center",
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        { type: "text", text: description, size: "xs", color: "#888888", wrap: true },
        { type: "separator", margin: "md" },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            { type: "text", text: "おすすめ", size: "xs", color: "#888888", flex: 2 },
            { type: "text", text: menu, size: "sm", weight: "bold", flex: 4, align: "end", wrap: true },
          ],
          margin: "md",
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            { type: "text", text: "価格", size: "xs", color: "#888888", flex: 2 },
            { type: "text", text: price, size: "sm", weight: "bold", flex: 4, align: "end" },
          ],
          margin: "sm",
        },
      ],
      paddingAll: "lg",
      spacing: "sm",
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "button",
          action: { type: "uri", label: "📍 地図で見る", uri: mapUrl },
          style: "primary",
          color: "#06C755",
          height: "sm",
        },
      ],
      paddingAll: "md",
    },
  };
}

// ─── デモ2: Flex Message を AI が動的生成する体 ───

export function demo2FlexSearch(): messagingApi.Message[] {
  return [
    {
      type: "flex",
      altText: "検索結果: イタリアン",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "🔍 AI が検索結果を生成",
              weight: "bold",
              size: "md",
              color: "#FFFFFF",
            },
            {
              type: "text",
              text: "イタリアン・来週金曜・2名",
              size: "xs",
              color: "#FFFFFFCC",
              margin: "xs",
            },
          ],
          backgroundColor: "#2E7D32",
          paddingAll: "lg",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            searchResultItem("🍝", "Trattoria Mano", "恵比寿 · ¥5,000〜", "◎ 空席あり", "#2E7D32"),
            { type: "separator", margin: "md" },
            searchResultItem("🍕", "Pizzeria Azzurri", "渋谷 · ¥3,500〜", "◎ 空席あり", "#2E7D32"),
            { type: "separator", margin: "md" },
            searchResultItem("🥩", "Osteria Bella", "代官山 · ¥8,000〜", "△ 残りわずか", "#E65100"),
          ],
          paddingAll: "lg",
          spacing: "md",
        },
      },
    } as messagingApi.FlexMessage,
    {
      type: "text",
      text: "気になるお店を選んでください 👇",
      quickReply: {
        items: [
          {
            type: "action",
            action: {
              type: "postback",
              label: "1. Trattoria Mano",
              data: "action=demo2_select&shop=1",
              displayText: "1番目のお店でお願い！",
            },
          },
          {
            type: "action",
            action: {
              type: "postback",
              label: "2. Pizzeria Azzurri",
              data: "action=demo2_select&shop=2",
              displayText: "2番目のお店でお願い！",
            },
          },
          {
            type: "action",
            action: {
              type: "postback",
              label: "3. Osteria Bella",
              data: "action=demo2_select&shop=3",
              displayText: "3番目のお店でお願い！",
            },
          },
        ],
      },
    },
  ];
}

function searchResultItem(
  emoji: string,
  name: string,
  detail: string,
  availability: string,
  availColor: string
): messagingApi.FlexComponent {
  return {
    type: "box",
    layout: "horizontal",
    contents: [
      { type: "text", text: emoji, flex: 0, size: "xl", gravity: "center" },
      {
        type: "box",
        layout: "vertical",
        contents: [
          { type: "text", text: name, weight: "bold", size: "sm" },
          { type: "text", text: detail, size: "xs", color: "#888888" },
          { type: "text", text: availability, size: "xs", color: availColor, margin: "xs" },
        ],
        flex: 1,
        paddingStart: "md",
      },
    ],
    margin: "md",
  } as messagingApi.FlexComponent;
}

const shopData: Record<string, { name: string; area: string; price: string }> = {
  "1": { name: "Trattoria Mano", area: "恵比寿", price: "¥5,000〜 / 人" },
  "2": { name: "Pizzeria Azzurri", area: "渋谷", price: "¥3,500〜 / 人" },
  "3": { name: "Osteria Bella", area: "代官山", price: "¥8,000〜 / 人" },
};

export function demo2BookingConfirm(shopId: string): messagingApi.Message[] {
  const shop = shopData[shopId] ?? shopData["1"];
  return [
    {
      type: "flex",
      altText: "予約確認",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "📋 AI が予約カードを生成",
              weight: "bold",
              size: "md",
              color: "#FFFFFF",
            },
          ],
          backgroundColor: "#1565C0",
          paddingAll: "lg",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            kvRow("店名", shop.name),
            kvRow("エリア", shop.area),
            kvRow("日時", "6/6 (金) 19:00"),
            kvRow("人数", "2名"),
            kvRow("予算目安", shop.price),
          ],
          paddingAll: "lg",
          spacing: "sm",
        },
        footer: {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "button",
              action: {
                type: "postback",
                label: "✅ 予約する",
                data: `action=demo2_book&shop=${shopId}`,
                displayText: "予約お願いします！",
              },
              style: "primary",
              color: "#06C755",
              flex: 1,
            },
            {
              type: "button",
              action: {
                type: "postback",
                label: "変更する",
                data: "action=demo2_change",
                displayText: "条件を変更したい",
              },
              style: "secondary",
              flex: 1,
            },
          ],
          paddingAll: "md",
          spacing: "sm",
        },
      },
    } as messagingApi.FlexMessage,
  ];
}

export function demo2BookingDone(shopId: string): messagingApi.Message[] {
  const shop = shopData[shopId] ?? shopData["1"];
  return [
    {
      type: "flex",
      altText: "予約完了",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "✅ 予約完了",
              weight: "bold",
              size: "lg",
              color: "#FFFFFF",
            },
          ],
          backgroundColor: "#2E7D32",
          paddingAll: "lg",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            kvRow("店名", shop.name),
            kvRow("日時", "6/6 (金) 19:00"),
            kvRow("人数", "2名"),
            kvRow("ステータス", "確定済み ✅"),
          ],
          paddingAll: "lg",
          spacing: "sm",
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              action: {
                type: "uri",
                label: "📍 お店の地図を見る",
                uri: `https://www.google.com/maps/search/${encodeURIComponent(shop.name + " " + shop.area)}`,
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

// ─── デモ3: 実行前承認 → Quick Reply + Postback ───

export function demo3Proposal(): messagingApi.Message[] {
  return [
    {
      type: "flex",
      altText: "ミーティング登録 — 確認",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "📅 ミーティング登録",
              weight: "bold",
              size: "lg",
              color: "#FFFFFF",
            },
            {
              type: "text",
              text: "以下の内容で登録します — 確認してください",
              size: "xs",
              color: "#FFFFFFCC",
              margin: "sm",
            },
          ],
          backgroundColor: "#6A1B9A",
          paddingAll: "lg",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            kvRow("タイトル", "チーム定例ミーティング"),
            kvRow("日時", "5/27 (火) 14:00–15:00"),
            kvRow("場所", "会議室 A"),
            kvRow("参加者", "開発チーム 全員"),
            { type: "separator", margin: "lg" },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "⚠️ この操作を実行してよろしいですか？",
                  size: "xs",
                  color: "#E65100",
                  wrap: true,
                },
              ],
              backgroundColor: "#FFF3E0",
              cornerRadius: "md",
              paddingAll: "md",
              margin: "lg",
            },
          ],
          paddingAll: "lg",
          spacing: "sm",
        },
      },
    } as messagingApi.FlexMessage,
    {
      type: "text",
      text: "操作を選んでください 👇",
      quickReply: {
        items: [
          {
            type: "action",
            action: {
              type: "postback",
              label: "✅ 承認する",
              data: "action=demo3_approve",
              displayText: "承認する",
            },
          },
          {
            type: "action",
            action: {
              type: "datetimepicker",
              label: "🕐 時間変更",
              data: "action=demo3_change_time",
              mode: "datetime",
            },
          },
          {
            type: "action",
            action: {
              type: "postback",
              label: "❌ キャンセル",
              data: "action=demo3_cancel",
              displayText: "キャンセル",
            },
          },
        ],
      },
    },
  ];
}

export function demo3Approved(): messagingApi.Message[] {
  return [
    {
      type: "flex",
      altText: "登録完了",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "✅ 登録完了",
              weight: "bold",
              size: "lg",
              color: "#FFFFFF",
            },
          ],
          backgroundColor: "#2E7D32",
          paddingAll: "lg",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            kvRow("タイトル", "チーム定例ミーティング"),
            kvRow("日時", "5/27 (火) 14:00–15:00"),
            kvRow("場所", "会議室 A"),
            kvRow("ステータス", "確定済み ✅"),
          ],
          paddingAll: "lg",
          spacing: "sm",
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              action: {
                type: "uri",
                label: "📅 カレンダーで確認",
                uri: "https://calendar.google.com/",
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

export function demo3Cancelled(): messagingApi.Message[] {
  return [
    {
      type: "text",
      text: "❌ ミーティング登録をキャンセルしました。",
    },
  ];
}

export function demo3TimeChanged(datetime: string): messagingApi.Message[] {
  return [
    {
      type: "flex",
      altText: "時間変更して登録完了",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "✅ 時間変更して登録完了",
              weight: "bold",
              size: "md",
              color: "#FFFFFF",
            },
          ],
          backgroundColor: "#2E7D32",
          paddingAll: "lg",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            kvRow("タイトル", "チーム定例ミーティング"),
            kvRow("日時", datetime),
            kvRow("場所", "会議室 A"),
            kvRow("ステータス", "確定済み ✅"),
          ],
          paddingAll: "lg",
          spacing: "sm",
        },
      },
    } as messagingApi.FlexMessage,
  ];
}

// ─── デモ4: 画像理解 + sender 切替 ───

export async function demo4ImageAnalysis(
  replyToken: string,
  _userId: string
): Promise<void> {
  await lineClient.replyMessage({
    replyToken,
    messages: [
      {
        type: "text",
        text: "📷 画像を受け取りました。分析します...",
        sender: {
          name: "画像認識",
          iconUrl: "https://cdn-icons-png.flaticon.com/512/2956/2956783.png",
        },
      } as messagingApi.Message,
      {
        type: "flex",
        altText: "画像分析結果",
        sender: {
          name: "分析エンジン",
          iconUrl: "https://cdn-icons-png.flaticon.com/512/3655/3655580.png",
        },
        contents: {
          type: "bubble",
          header: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "🍛 画像分析結果",
                weight: "bold",
                size: "md",
                color: "#FFFFFF",
              },
            ],
            backgroundColor: "#E65100",
            paddingAll: "lg",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              kvRow("料理名", "チキンカレー"),
              kvRow("推定量", "1人前（約350g）"),
              kvRow("信頼度", "92%"),
            ],
            paddingAll: "lg",
            spacing: "sm",
          },
        },
      } as messagingApi.FlexMessage,
      {
        type: "flex",
        altText: "栄養情報",
        sender: {
          name: "栄養計算",
          iconUrl: "https://cdn-icons-png.flaticon.com/512/3176/3176369.png",
        },
        contents: {
          type: "bubble",
          header: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "📊 栄養情報",
                weight: "bold",
                size: "md",
                color: "#FFFFFF",
              },
            ],
            backgroundColor: "#00838F",
            paddingAll: "lg",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      { type: "text", text: "カロリー", size: "sm", color: "#888888", flex: 1 },
                      { type: "text", text: "687 kcal", size: "sm", weight: "bold", flex: 1, align: "end" },
                    ],
                  },
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        type: "box",
                        layout: "vertical",
                        contents: [],
                        backgroundColor: "#FF9800",
                        height: "6px",
                        cornerRadius: "md",
                        width: "45%",
                      },
                    ],
                    backgroundColor: "#EEEEEE",
                    cornerRadius: "md",
                    height: "6px",
                    margin: "sm",
                  },
                ],
              },
              { type: "separator", margin: "lg" },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  nutritionBox("たんぱく質", "24g", "#FFEBEE"),
                  nutritionBox("脂質", "18g", "#FFF8E1"),
                  nutritionBox("炭水化物", "98g", "#E3F2FD"),
                ],
                margin: "lg",
                spacing: "md",
              },
            ],
            paddingAll: "lg",
            spacing: "md",
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "button",
                action: {
                  type: "postback",
                  label: "📝 食事記録に追加",
                  data: "action=demo4_record",
                  displayText: "食事記録に追加する",
                },
                style: "primary",
                color: "#06C755",
              },
            ],
            paddingAll: "md",
          },
        },
      } as messagingApi.FlexMessage,
    ],
  });
}

function nutritionBox(
  label: string,
  value: string,
  bgColor: string
): messagingApi.FlexComponent {
  return {
    type: "box",
    layout: "vertical",
    contents: [
      { type: "text", text: label, size: "xxs", color: "#888888", align: "center" },
      { type: "text", text: value, size: "sm", weight: "bold", align: "center", margin: "xs" },
    ],
    backgroundColor: bgColor,
    cornerRadius: "md",
    paddingAll: "sm",
    flex: 1,
  } as messagingApi.FlexComponent;
}

// ─── ヘルパー ───

function kvRow(key: string, value: string): messagingApi.FlexComponent {
  return {
    type: "box",
    layout: "horizontal",
    contents: [
      { type: "text", text: key, size: "sm", color: "#888888", flex: 2 },
      { type: "text", text: value, size: "sm", weight: "bold", flex: 3, align: "end" },
    ],
  } as messagingApi.FlexComponent;
}

