/**
 * リッチメニュー画像とサンプルアセットを生成するスクリプト
 * 実行: npx tsx scripts/generate-assets.ts
 *
 * SVGをベースに画像を生成（外部依存なし）
 */
import { writeFileSync, mkdirSync } from "fs";

mkdirSync("public/assets/imagemap", { recursive: true });

// リッチメニュー画像 (2500x1686) - SVG
const richMenuSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="2500" height="1686">
  <rect width="2500" height="1686" fill="#FFFFFF"/>
  <!-- Row 1 -->
  <rect x="0" y="0" width="833" height="843" fill="#06C755" rx="0"/>
  <text x="416" y="400" text-anchor="middle" fill="white" font-size="80" font-family="sans-serif" font-weight="bold">テキスト</text>
  <text x="416" y="480" text-anchor="middle" fill="white" font-size="40" font-family="sans-serif">TEXT</text>

  <rect x="833" y="0" width="834" height="843" fill="#00B900" rx="0"/>
  <text x="1250" y="400" text-anchor="middle" fill="white" font-size="80" font-family="sans-serif" font-weight="bold">Flex</text>
  <text x="1250" y="480" text-anchor="middle" fill="white" font-size="40" font-family="sans-serif">FLEX</text>

  <rect x="1667" y="0" width="833" height="843" fill="#009900" rx="0"/>
  <text x="2083" y="400" text-anchor="middle" fill="white" font-size="70" font-family="sans-serif" font-weight="bold">テンプレート</text>
  <text x="2083" y="480" text-anchor="middle" fill="white" font-size="40" font-family="sans-serif">TPL</text>

  <!-- Row 2 -->
  <rect x="0" y="843" width="833" height="843" fill="#4DC870" rx="0"/>
  <text x="416" y="1243" text-anchor="middle" fill="white" font-size="80" font-family="sans-serif" font-weight="bold">スタンプ</text>
  <text x="416" y="1323" text-anchor="middle" fill="white" font-size="40" font-family="sans-serif">:)</text>

  <rect x="833" y="843" width="834" height="843" fill="#3CB371" rx="0"/>
  <text x="1250" y="1200" text-anchor="middle" fill="white" font-size="60" font-family="sans-serif" font-weight="bold">クイック</text>
  <text x="1250" y="1280" text-anchor="middle" fill="white" font-size="60" font-family="sans-serif" font-weight="bold">リプライ</text>
  <text x="1250" y="1360" text-anchor="middle" fill="white" font-size="40" font-family="sans-serif">QR</text>

  <rect x="1667" y="843" width="833" height="843" fill="#2E8B57" rx="0"/>
  <text x="2083" y="1200" text-anchor="middle" fill="white" font-size="60" font-family="sans-serif" font-weight="bold">Tab B</text>
  <text x="2083" y="1280" text-anchor="middle" fill="white" font-size="40" font-family="sans-serif">その他 →</text>

  <!-- Grid lines -->
  <line x1="833" y1="0" x2="833" y2="1686" stroke="white" stroke-width="4"/>
  <line x1="1667" y1="0" x2="1667" y2="1686" stroke="white" stroke-width="4"/>
  <line x1="0" y1="843" x2="2500" y2="843" stroke="white" stroke-width="4"/>
</svg>`;

writeFileSync("public/assets/rich-menu.svg", richMenuSvg);

// サンプル画像 (1040x1040)
const sampleImageSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="1040">
  <rect width="1040" height="1040" fill="#06C755"/>
  <text x="520" y="480" text-anchor="middle" fill="white" font-size="100" font-family="sans-serif" font-weight="bold">LINE</text>
  <text x="520" y="600" text-anchor="middle" fill="white" font-size="50" font-family="sans-serif">Messaging API</text>
  <text x="520" y="700" text-anchor="middle" fill="white" font-size="40" font-family="sans-serif">Sample Image</text>
</svg>`;

writeFileSync("public/assets/sample-image.svg", sampleImageSvg);

// イメージマップ用画像 (1040x520)
const imagemapSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="520">
  <rect x="0" y="0" width="520" height="520" fill="#06C755"/>
  <text x="260" y="240" text-anchor="middle" fill="white" font-size="50" font-family="sans-serif" font-weight="bold">左タップ</text>
  <text x="260" y="310" text-anchor="middle" fill="white" font-size="30" font-family="sans-serif">→ LINE Developers</text>

  <rect x="520" y="0" width="520" height="520" fill="#00B900"/>
  <text x="780" y="240" text-anchor="middle" fill="white" font-size="50" font-family="sans-serif" font-weight="bold">右タップ</text>
  <text x="780" y="310" text-anchor="middle" fill="white" font-size="30" font-family="sans-serif">→ メッセージ送信</text>

  <line x1="520" y1="0" x2="520" y2="520" stroke="white" stroke-width="4"/>
</svg>`;

writeFileSync("public/assets/imagemap/1040.svg", imagemapSvg);

// リッチメニューB画像 (2500x1686) - SVG
const richMenuBSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="2500" height="1686">
  <rect width="2500" height="1686" fill="#FFFFFF"/>
  <!-- Row 1 -->
  <rect x="0" y="0" width="833" height="843" fill="#FF6B6B" rx="0"/>
  <text x="416" y="400" text-anchor="middle" fill="white" font-size="70" font-family="sans-serif" font-weight="bold">Sender</text>
  <text x="416" y="480" text-anchor="middle" fill="white" font-size="30" font-family="sans-serif">ICON</text>

  <rect x="833" y="0" width="834" height="843" fill="#4ECDC4" rx="0"/>
  <text x="1250" y="400" text-anchor="middle" fill="white" font-size="70" font-family="sans-serif" font-weight="bold">送信方法</text>
  <text x="1250" y="480" text-anchor="middle" fill="white" font-size="30" font-family="sans-serif">SEND</text>

  <rect x="1667" y="0" width="833" height="843" fill="#45B7D1" rx="0"/>
  <text x="2083" y="380" text-anchor="middle" fill="white" font-size="60" font-family="sans-serif" font-weight="bold">プロ</text>
  <text x="2083" y="460" text-anchor="middle" fill="white" font-size="60" font-family="sans-serif" font-weight="bold">フィール</text>
  <text x="2083" y="540" text-anchor="middle" fill="white" font-size="30" font-family="sans-serif">USER</text>

  <!-- Row 2 -->
  <rect x="0" y="843" width="833" height="843" fill="#96CEB4" rx="0"/>
  <text x="416" y="1200" text-anchor="middle" fill="white" font-size="55" font-family="sans-serif" font-weight="bold">画像</text>
  <text x="416" y="1280" text-anchor="middle" fill="white" font-size="55" font-family="sans-serif" font-weight="bold">カルーセル</text>
  <text x="416" y="1360" text-anchor="middle" fill="white" font-size="30" font-family="sans-serif">IMG</text>

  <rect x="833" y="843" width="834" height="843" fill="#FFEAA7" rx="0"/>
  <text x="1250" y="1243" text-anchor="middle" fill="#333333" font-size="80" font-family="sans-serif" font-weight="bold">ヘルプ</text>
  <text x="1250" y="1323" text-anchor="middle" fill="#333333" font-size="40" font-family="sans-serif">HELP</text>

  <rect x="1667" y="843" width="833" height="843" fill="#06C755" rx="0"/>
  <text x="2083" y="1200" text-anchor="middle" fill="white" font-size="60" font-family="sans-serif" font-weight="bold">Tab A</text>
  <text x="2083" y="1280" text-anchor="middle" fill="white" font-size="40" font-family="sans-serif">に戻る</text>
  <text x="2083" y="1360" text-anchor="middle" fill="white" font-size="60" font-family="sans-serif">&lt;-</text>

  <!-- Grid lines -->
  <line x1="833" y1="0" x2="833" y2="1686" stroke="white" stroke-width="4"/>
  <line x1="1667" y1="0" x2="1667" y2="1686" stroke="white" stroke-width="4"/>
  <line x1="0" y1="843" x2="2500" y2="843" stroke="white" stroke-width="4"/>
</svg>`;

writeFileSync("public/assets/rich-menu-b.svg", richMenuBSvg);

console.log("Assets generated:");
console.log("  public/assets/rich-menu.svg");
console.log("  public/assets/sample-image.svg");
console.log("  public/assets/imagemap/1040.svg");
console.log("");
console.log("NOTE: LINE requires PNG/JPEG for rich menu images.");
console.log("Convert SVGs to PNG before uploading:");
console.log("  npx sharp-cli -i public/assets/rich-menu.svg -o public/assets/rich-menu.png");
