# LINE を AI エージェントの入口にする現実解 2026
## — 最先端プロトコルとの差、既存APIでどこまで寄せられるか

---

## スライド構成

---

### スライド 1: タイトル

**LINE を AI エージェントの入口にする現実解 2026**
最先端プロトコルとの差、既存APIでどこまで寄せられるか

- 発表者: 松尾淳平
- イベント: LINE APIで試したんだけど、聞いてほしい Night LT #02
- 日付: 2026年5月26日

表現: シンプルなタイトルスライド。LINEのグリーンをアクセントカラーに。

---

### スライド 2: 自己紹介

- 松尾淳平
- Zenn で「LINE を AI エージェントの入口にする現実解」を執筆
- 今日はその続編 — LINE の「限界」と「可能性」の話

表現: 記事のリンク or QRコード。簡潔に。

---

### スライド 3: 2026年、AIエージェントの世界はこうなった

プロトコルスタックの図:

```
A2UI   — AIがUIを動的生成（Google）
AG-UI  — エージェント↔フロントエンド通信（CopilotKit, AWS）
A2A    — エージェント↔エージェント連携（Google, 150+組織）
MCP    — エージェント↔ツール/データ接続（Anthropic, 月9700万DL）
MCP Apps — AIチャット内にインタラクティブUI
```

話す内容:
- MCP はデファクト。Claude/ChatGPT/Gemini/VSCode 全対応
- A2A でエージェント同士が自律的に連携する時代
- AG-UI/A2UI で「AIがUIを作る」のが当たり前に
- MCP Apps でチャット内にダッシュボードやフォームが直接出る

表現: プロトコルスタックを積み木のような図で表現。各層の採用企業ロゴを小さく添える。

---

### スライド 4: 最先端のエージェント体験

具体的に「今のAIエージェント」は何ができるか:

- **ストリーミング**: トークンが1文字ずつ流れてくる（ChatGPT/Claude的体験）
- **Generative UI**: AIが返答としてフォーム、チャート、ダッシュボードを動的生成
- **Human-in-the-Loop**: 「この操作を実行していいですか？」→ 承認/拒否
- **マルチエージェント**: 検索エージェント → 分析エージェント → レポートエージェントが自動連携
- **MCP Apps**: チャット内で地図表示、予約フォーム入力、データ可視化

話す内容:
- これが2026年の「普通」になりつつある
- Vercel AI SDK、OpenAI Agents SDK、LangGraph が実現している世界

表現: 各体験のスクリーンショットやモックアップ。「今のAI体験」の具体イメージ。

---

### スライド 5: で、LINEは？

**ギャップ一覧表（これがこのLTのメイン）**

| 最先端 | LINEの現実 | GAP |
|--------|-----------|-----|
| SSEストリーミング | ❌ メッセージは完成形で届く | 大 |
| Generative UI | ❌ Flex Message（静的JSON）が限界 | 大 |
| MCP Apps（チャット内UI） | ❌ 埋め込みUI不可 | 大 |
| Human-in-the-Loop | △ Quick Reply / Postback | 中 |
| A2A（マルチエージェント） | ❌ Bot同士の直接通信なし | 大 |
| MCP（ツール接続） | △ 自作は可能 | 小 |
| マルチモーダル | △ 画像送受信は可能 | 小 |

話す内容:
- 正直、めちゃくちゃ辛い
- でも日本の9800万人が毎日使ってるプラットフォーム
- 「使えない」じゃなく「どう戦うか」

表現: 赤（❌）黄（△）で視覚的にGAPを表現。右端にGAPの大きさを棒グラフ的に。

---

### スライド 6: 既存APIでどこまで寄せられるか

**ここからが本題。** 6つの最先端機能に対して、LINE の既存APIでの近似方法を紹介。

表現: 「最先端」→「LINEでの近似」を矢印で繋ぐ図。

---

### スライド 7: ① ストリーミング → LIFF + SSE

- Messaging API ではストリーミング不可能
- **LIFF (LINE内WebView) なら SSE が使える**
- ChatGPTライクなトークン逐次表示を LINE 内で実現

近似度: ◎（ほぼ同等の体験）

話す内容:
- LIFF は LINE 内で開く WebView なので、普通の Web 技術が全部使える
- Server-Sent Events で Vercel AI SDK の streamText をそのまま繋げる
- 「普段は Messaging API、ストリーミングが必要な時だけ LIFF に遷移」がベストプラクティス

表現: Messaging API（完成形テキスト）vs LIFF（トークンが流れるアニメーション）の対比。

---

### スライド 8: ② Generative UI → Flex Message 動的生成

- A2UI は「AIがUIコンポーネントを宣言的に生成」する標準
- LINE には Flex Message がある — CSS Flexbox ベースのカードUI
- **Claude に Flex Message の JSON を生成させれば「Generative Flex」になる**

近似度: △（静的だが、内容は動的に生成可能）

話す内容:
- Flex Message Simulator でデザイン → JSONスキーマを Claude に渡す
- markdown-flex-message ライブラリで Markdown → Flex 自動変換も可能
- 限界: インタラクティブ性はない。タップ → ポストバックが精一杯

表現: Claude が Flex Message JSON を生成 → LINE に美しいカードが表示される流れ。

---

### スライド 9: ③ Human-in-the-Loop → Quick Reply + Postback

- 最先端: `needsApproval` フラグ一つでツール実行の承認フロー
- LINE: **Quick Reply でユーザーに選択肢を提示 → Postback で結果を受け取る**

近似度: ○（フローとしては同等、UIの自由度が低い）

話す内容:
- 例: AIが「Googleカレンダーに予定を追加しますか？」→ Quick Reply で「はい/いいえ」
- Postback の data パラメータに構造化データを入れれば、複雑な承認フローも可能
- 日時選択アクションで日時ピッカーも出せる

表現: 最先端のモーダルダイアログ vs LINE の Quick Reply ボタンの対比。

---

### スライド 10: ④ MCP → LINE Bot MCP Server

- MCP: AIがツールやデータに接続する標準プロトコル
- **LINE Bot MCP Server を作れば、Claude Desktop から LINE を操作できる**

近似度: ○（逆方向のMCP — LINE がツール「として」使われる）

話す内容:
- MCP Server を書けば、Claude Desktop から pushMessage、Flex Message 送信、グループ管理が可能
- LINE Bot MCP Server は LINE 公式からも試験提供されている
- LINE が「AIのツール」になる世界

表現: Claude Desktop → MCP → LINE Bot → ユーザーのメッセージフロー図。

---

### スライド 11: ⑤ MCP Apps → LIFF

- MCP Apps: AIチャット内にダッシュボードやフォームを直接表示
- LINE: **LIFF で LINE 内に自由な Web UI を表示**

近似度: △（WebView遷移が入るのでシームレスさに欠ける）

話す内容:
- LIFF は Full/Tall/Compact の3サイズで表示可能
- チャット→LIFF遷移のワンクッションが体験的にはマイナス
- ただし LIFF 内では React/Next.js 等で何でもできる

表現: MCP Apps のチャット内UI vs LIFF の WebView 遷移の対比。

---

### スライド 12: ⑥ A2A → Sender切替で擬似マルチエージェント

- A2A: エージェント同士が Agent Card で能力を宣言し合い、自律的にタスクを委譲
- LINE: **sender プロパティで1つのBotが複数のアイコン・名前で発言**

近似度: △（見た目だけ。内部は1Bot）

話す内容:
- sender で「検索エージェント」「分析エージェント」を演出
- 内部では1つのBotが Claude の Tool Use で複数の役割を切り替え
- 真の A2A ではないが、ユーザーから見れば「複数のAIが協力してる」体験は作れる

表現: 1つのBotが sender 切替で異なるアイコン・名前で発言するLINE画面のスクリーンショット。

---

### スライド 13: まとめ — 近似度マップ

| 最先端 | LINE近似 | 近似度 |
|--------|---------|--------|
| ストリーミング | LIFF + SSE | ◎ |
| Generative UI | Flex Message 動的生成 | △ |
| Human-in-the-Loop | Quick Reply + Postback | ○ |
| MCP | LINE Bot MCP Server | ○ |
| MCP Apps | LIFF | △ |
| A2A | sender 切替 + Tool Use | △ |

話す内容:
- 完全に再現できるものはストリーミングだけ
- 他は「近似」— でも LINE のリーチを考えると、この近似で十分価値がある
- 重要なのは「LINEの制約を理解した上で設計する」こと

表現: レーダーチャートで最先端 vs LINE の近似度を視覚化。

---

### スライド 14: 結論

**LINE は AI エージェントのプラットフォームとしては「遅れてる」。**
**でも9800万人のリーチは、どんな最先端UIよりも強い。**

- 制約を理解して、既存APIで最大限寄せる
- Messaging API で日常会話、LIFF で高度な体験
- MCP で LINE を AI エコシステムに接続する

「最先端に追いつく」のではなく「最先端の体験を LINE で翻訳する」

表現: 「LINE = 9800万人への入口」を強調する図。

---

### スライド 15: リンク

- 記事: https://zenn.dev/peintangos/articles/b024c86e672191
- ショーケースBot: (LINEのQRコード)
- GitHub: https://github.com/peintangos/line-sample-2

表現: QRコード2つ（記事、Bot友だち追加）。
