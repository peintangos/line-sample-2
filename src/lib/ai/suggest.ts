import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

type TimeSlot = { start: string; end: string };
type SuggestedSlot = { start: string; end: string; label: string };

export async function suggestSlots(
  freeSlots: TimeSlot[],
  triggerText: string
): Promise<SuggestedSlot[]> {
  const slotsDescription = freeSlots
    .slice(0, 20)
    .map((s) => {
      const start = new Date(s.start);
      const end = new Date(s.end);
      const day = start.toLocaleDateString("ja-JP", { weekday: "short", month: "numeric", day: "numeric" });
      const startTime = start.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
      const endTime = end.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
      return `${day} ${startTime}〜${endTime}`;
    })
    .join("\n");

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: `あなたは日程調整アシスタントです。提示された空き時間の中から、ミーティングに最適な候補を3つ選んでください。
午前中・午後早め・午後遅めなど、バリエーションを持たせてください。
必ず以下のJSON形式で返答してください。他のテキストは不要です。
[{"index": 0, "reason": "理由"}, {"index": 1, "reason": "理由"}, {"index": 2, "reason": "理由"}]
indexは空き時間リストの0始まりインデックスです。`,
    messages: [
      {
        role: "user",
        content: `リクエスト: 「${triggerText}」\n\n空き時間:\n${slotsDescription}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const parsed = JSON.parse(text) as { index: number; reason: string }[];
    const capped = freeSlots.slice(0, 20);

    return parsed.slice(0, 3).map((p) => {
      const slot = capped[p.index] ?? capped[0];
      const start = new Date(slot.start);
      const day = start.toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
        weekday: "short",
      });
      const time = start.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return {
        start: slot.start,
        end: slot.end,
        label: `${day} ${time}〜 — ${p.reason}`,
      };
    });
  } catch {
    return freeSlots.slice(0, 3).map((slot) => {
      const start = new Date(slot.start);
      const day = start.toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
        weekday: "short",
      });
      const time = start.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return { start: slot.start, end: slot.end, label: `${day} ${time}〜` };
    });
  }
}
