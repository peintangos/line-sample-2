import { messagingApi } from "@line/bot-sdk";

type Slot = { start: string; end: string; label: string };

export function buildProposalFlex(
  sessionId: string,
  slots: Slot[]
): messagingApi.FlexMessage {
  const slotContents = slots.map((slot, i) => ({
    type: "box" as const,
    layout: "horizontal" as const,
    contents: [
      {
        type: "text" as const,
        text: `${i + 1}`,
        size: "xl" as const,
        weight: "bold" as const,
        color: "#06C755",
        flex: 0,
        gravity: "center" as const,
      },
      {
        type: "text" as const,
        text: slot.label,
        size: "sm" as const,
        wrap: true,
        flex: 1,
        gravity: "center" as const,
        margin: "md" as const,
      },
    ],
    action: {
      type: "postback" as const,
      label: `候補${i + 1}を選択`,
      data: `action=select_slot&sessionId=${sessionId}&slotIndex=${i}`,
      displayText: `候補${i + 1}: ${slot.label}`,
    },
    paddingAll: "lg",
    cornerRadius: "md",
    backgroundColor: i === 0 ? "#F0FFF0" : "#FFFFFF",
    margin: "sm" as const,
  }));

  return {
    type: "flex",
    altText: "候補日程が届きました",
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "📅 候補日程",
            weight: "bold",
            size: "lg",
            color: "#FFFFFF",
          },
          {
            type: "text",
            text: "タップして日程を選んでください",
            size: "xs",
            color: "#FFFFFFCC",
            margin: "sm",
          },
        ],
        backgroundColor: "#06C755",
        paddingAll: "lg",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: slotContents,
        spacing: "sm",
        paddingAll: "lg",
      },
    },
  } as messagingApi.FlexMessage;
}

export function buildConfirmFlex(slot: Slot): messagingApi.FlexMessage {
  const start = new Date(slot.start);
  const end = new Date(slot.end);
  const dateStr = start.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  });
  const startTime = start.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = end.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    type: "flex",
    altText: `日程確定: ${dateStr} ${startTime}〜${endTime}`,
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "✅ 日程確定！",
            weight: "bold",
            size: "lg",
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
            text: "ミーティング",
            weight: "bold",
            size: "xl",
          },
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "日付", size: "sm", color: "#888888", flex: 1 },
                  { type: "text", text: dateStr, size: "sm", flex: 3 },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "時間", size: "sm", color: "#888888", flex: 1 },
                  {
                    type: "text",
                    text: `${startTime} 〜 ${endTime}`,
                    size: "sm",
                    flex: 3,
                  },
                ],
              },
            ],
            margin: "lg",
            spacing: "sm",
          },
          {
            type: "text",
            text: "Google Calendarに登録しました 🎉",
            size: "xs",
            color: "#06C755",
            margin: "xl",
            weight: "bold",
          },
        ],
        paddingAll: "lg",
      },
    },
  } as messagingApi.FlexMessage;
}
