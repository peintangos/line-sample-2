import { lineClient } from "./client";

export async function setupRichMenu(): Promise<string> {
  const res = await lineClient.createRichMenu({
    size: { width: 2500, height: 1686 },
    selected: true,
    name: "Showcase Menu - Tab 1",
    chatBarText: "メニュー",
    areas: [
      {
        bounds: { x: 0, y: 0, width: 833, height: 843 },
        action: { type: "message", text: "テキスト" },
      },
      {
        bounds: { x: 833, y: 0, width: 834, height: 843 },
        action: { type: "message", text: "Flex" },
      },
      {
        bounds: { x: 1667, y: 0, width: 833, height: 843 },
        action: { type: "message", text: "テンプレート" },
      },
      {
        bounds: { x: 0, y: 843, width: 833, height: 843 },
        action: { type: "message", text: "スタンプ" },
      },
      {
        bounds: { x: 833, y: 843, width: 834, height: 843 },
        action: { type: "message", text: "クイックリプライ" },
      },
      {
        bounds: { x: 1667, y: 843, width: 833, height: 843 },
        action: { type: "message", text: "ヘルプ" },
      },
    ],
  });

  const richMenuId = res.richMenuId;
  await lineClient.setDefaultRichMenu(richMenuId);
  return richMenuId;
}
