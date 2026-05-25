import { lineClient, blobClient } from "./client";
import { readFileSync } from "fs";
import { join } from "path";

export async function setupRichMenus(): Promise<{ menuAId: string; menuBId: string }> {
  // Tab A: メッセージタイプ
  const resA = await lineClient.createRichMenu({
    size: { width: 2500, height: 1686 },
    selected: true,
    name: "Tab A - メッセージタイプ",
    chatBarText: "メニュー",
    areas: [
      { bounds: { x: 0, y: 0, width: 833, height: 843 }, action: { type: "message", text: "テキスト" } },
      { bounds: { x: 833, y: 0, width: 834, height: 843 }, action: { type: "message", text: "Flex" } },
      { bounds: { x: 1667, y: 0, width: 833, height: 843 }, action: { type: "message", text: "テンプレート" } },
      { bounds: { x: 0, y: 843, width: 833, height: 843 }, action: { type: "message", text: "スタンプ" } },
      { bounds: { x: 833, y: 843, width: 834, height: 843 }, action: { type: "message", text: "クイックリプライ" } },
      {
        bounds: { x: 1667, y: 843, width: 833, height: 843 },
        action: { type: "richmenuswitch", richMenuAliasId: "tab-b", data: "switch_to_tab_b" },
      },
    ],
  });

  // Tab B: その他機能
  const resB = await lineClient.createRichMenu({
    size: { width: 2500, height: 1686 },
    selected: false,
    name: "Tab B - その他機能",
    chatBarText: "メニュー",
    areas: [
      { bounds: { x: 0, y: 0, width: 833, height: 843 }, action: { type: "message", text: "sender" } },
      { bounds: { x: 833, y: 0, width: 834, height: 843 }, action: { type: "message", text: "送信方法" } },
      { bounds: { x: 1667, y: 0, width: 833, height: 843 }, action: { type: "message", text: "プロフィール" } },
      { bounds: { x: 0, y: 843, width: 833, height: 843 }, action: { type: "message", text: "画像カルーセル" } },
      { bounds: { x: 833, y: 843, width: 834, height: 843 }, action: { type: "message", text: "ヘルプ" } },
      {
        bounds: { x: 1667, y: 843, width: 833, height: 843 },
        action: { type: "richmenuswitch", richMenuAliasId: "tab-a", data: "switch_to_tab_a" },
      },
    ],
  });

  const menuAId = resA.richMenuId;
  const menuBId = resB.richMenuId;

  // エイリアス作成（タブ切替用）
  try { await lineClient.deleteRichMenuAlias("tab-a"); } catch { /* 存在しなければ無視 */ }
  try { await lineClient.deleteRichMenuAlias("tab-b"); } catch { /* 存在しなければ無視 */ }

  await lineClient.createRichMenuAlias({ richMenuAliasId: "tab-a", richMenuId: menuAId });
  await lineClient.createRichMenuAlias({ richMenuAliasId: "tab-b", richMenuId: menuBId });

  // デフォルト設定
  await lineClient.setDefaultRichMenu(menuAId);

  return { menuAId, menuBId };
}

export async function uploadRichMenuImage(richMenuId: string, imagePath: string): Promise<void> {
  const imageBuffer = readFileSync(imagePath);
  const blob = new Blob([imageBuffer], { type: "image/png" });
  await blobClient.setRichMenuImage(richMenuId, blob);
}

export async function setupComplete(): Promise<void> {
  const { menuAId, menuBId } = await setupRichMenus();

  const tabAPath = join(process.cwd(), "public/assets/rich-menu.png");
  const tabBPath = join(process.cwd(), "public/assets/rich-menu-b.png");

  try {
    await uploadRichMenuImage(menuAId, tabAPath);
    await uploadRichMenuImage(menuBId, tabBPath);
    console.log("Rich menus set up successfully:", { menuAId, menuBId });
  } catch (e) {
    console.error("Failed to upload rich menu images:", e);
  }
}
