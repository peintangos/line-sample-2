# LINE を AI エージェントの入口にする現実解 2026
## 最先端を「再現」するのではなく、LINE で「翻訳」する

---

## スライド構成（10分版・12枚）

話の芯:

> LINE は AI エージェントの実行サーフェスとしては遅れている。
> でも、日本で約9800万人に届くユーザー接点としては強い。
> だから最先端体験をそのまま載せるのではなく、既存APIで翻訳する。

---

### スライド 1: タイトル

**LINE を AI エージェントの入口にする現実解 2026**
最先端を「再現」するのではなく、LINE で「翻訳」する

- 発表者: 松尾淳平
- イベント: LINE APIで試したんだけど、聞いてほしい Night LT #02
- 日付: 2026年5月26日

話す内容:
- 今日のテーマは「LINEでAIエージェントをどこまで作れるか」
- ただし「LINEすごい」ではなく、「制約を見た上で現実解を探す」話

表現:
- LINEグリーンをアクセントにしたシンプルなタイトル
- サブタイトルは大きめに出す

---

### スライド 2: 今日の結論

**LINE は AI エージェントの実行環境としては遅れている。**
**でも、ユーザー接点としては強い。**

| 見方 | 評価 | 理由 |
|------|------|------|
| AIエージェントの実行サーフェス | 弱い | Streaming / Generative UI / Agent間連携が苦手 |
| 生活導線 | 強い | 日本で約9800万人のMAU。インストール不要、認証不要（LINE Login）、通知が届く |
| 現実解 | 翻訳する | Messaging API / Flex Message / Quick Reply / LIFF / MCP Server に分解する |

話す内容:
- 「LINEが最先端AIプラットフォームになる」は言いすぎ
- ただし「AIエージェントへの入口」としてはかなり強い
- これはLINE固有の問題ではない。WhatsAppは2026年1月に汎用AIチャットBotを禁止した。Telegramは自由だが日本ではリーチが弱い。メッセージングプラットフォーム全般がAIエージェント向けに設計されていない
- その中でLINEを選ぶ理由: 新しいアプリをインストールさせなくていい。ユーザーの生活導線にすでにいる

表現:
- 左に「実行環境としての弱さ」、右に「入口としての強さ」
- 最後に「翻訳」というキーワードを強調

---

### スライド 3: いまのAIエージェント体験を5つに分解する

最先端プロトコルの名前を全部覚える必要はない。
重要なのは、ユーザー体験が何に分解できるか。

| 体験 | 代表的な技術・プロトコル | 何がうれしいか |
|------|--------------------------|----------------|
| Streaming | SSE / AG-UI | 返答や状態変化がリアルタイムに見える |
| Generative UI | A2UI / MCP Apps | 文章だけでなくフォームやグラフが出る |
| Human-in-the-Loop | tool approval / confirmation flow | 実行前にユーザーが承認できる |
| Tool connection | MCP | AIが外部ツールやデータに接続できる |
| Multimodal | Vision / Audio API | 画像や音声を入力にできる |

補足としてのA2A:
- Agent-to-Agent の標準化も進んでいる（150+組織が本番稼働）
- ただし今日の主題は、ユーザーがLINE上で体験する部分

話す内容:
- MCPは月9700万DL、Claude/ChatGPT/Gemini/VSCode全対応のデファクト
- AG-UI/A2UI/MCP Apps系は「チャットがUIを持つ」方向
- Multimodalは画像・音声の理解と生成。ここはLINEとの相性が意外と良い

表現:
- プロトコルスタックではなく、5つのカードを横並び
- 「プロトコル名」より「体験」を大きく表示

---

### スライド 4: で、LINEはどこがつらいのか

| 最先端の体験 | LINEの現実 | ギャップ |
|--------------|------------|----------|
| Streaming | Messaging API は完成形メッセージを送る。Reply Token は数十秒で失効 | 大 |
| Generative UI | Flex Message は送信時にJSONを確定。送信後の動的更新は不可 | 大 |
| Chat内インタラクティブUI | トーク画面に任意Web UIは埋め込めない | 大 |
| Human-in-the-Loop | Quick Reply / Postback で近い体験は作れる | 中 |
| Tool connection | LINE Bot MCP Server でAI側からLINEを操作できる | 小〜中 |
| Multimodal | 画像の送受信は可能。Vision AIと組み合わせられる | 小 |
| Multi-agent | Bot同士の標準的な直接連携はない | 大 |

隠れた制約:
- 無料プランは月200通のPush Message制限。エージェントの会話ですぐ枯渇する
- LINE は会話履歴をAPI経由で提供しない。文脈維持は自前で構築が必要

話す内容:
- LINEのMessaging APIは「完成したメッセージを送る」設計
- だからChatGPTやClaudeのような逐次生成・動的UIとは相性が悪い
- ただしMultimodalだけはLINEが意外と健闘。画像を送ればVision AIで分析できる
- でも「全滅」ではない。既存APIに分解すると寄せられる部分がある

表現:
- 赤・黄・緑でギャップを表示
- Multimodalが緑（強み）であることを目立たせる
- 「できない」で終わらず、次のスライドへの導線として「翻訳」を置く

---

### スライド 5: 翻訳方針

**LINEで最先端を再現しようとしない。役割ごとにAPIを割り当てる。**

| 役割 | LINEでの担当 |
|------|--------------|
| 日常会話 | Messaging API（Push/Reply） |
| 承認・選択 | Quick Reply / Postback |
| カード表示 | Flex Message（AIにJSONを生成させる = Structured Output） |
| 高度なUI・Streaming | LIFF（ただし遷移コストあり） |
| 画像理解 | 画像受信 → Vision AI |
| AIエコシステム接続 | LINE Bot MCP Server |
| 複数役割の見せ方 | sender の icon / name 切替 |

話す内容:
- LINEのトーク画面だけで全部やろうとすると苦しい
- 普段はMessaging API、複雑な操作だけLIFFへ逃がす
- ただしLIFF遷移は「トーク → WebView → 操作 → 戻る」で体験の連続性が切れる。これは「近似」ではなく「別体験に切り替わる」に近い
- AI側からLINEを操作したい場合はMCP Serverでつなぐ

表現:
- 「最先端」から「LINE API」へ変換する翻訳テーブル
- LIFF遷移のコストを正直に図示（矢印が折れ曲がる等）
- ここから先は具体例として4つ話す

---

### スライド 6: 近似1 — Streaming は LIFF + SSE に逃がす

| やりたいこと | Messaging API | LIFF |
|--------------|---------------|------|
| トークン逐次表示 | 不向き | 可能（SSE） |
| 生成中の状態表示 | loading animation 程度 | 自由に実装可能 |
| UI更新 | メッセージ再送信が必要 | React / Next.js 等で更新可能 |

近似度: ◎（体験品質は高い。ただしLIFF遷移が入る）

話す内容:
- Messaging APIでChatGPT風の1文字ずつ流れる体験は作れない
- でもLIFFはLINE上で動くWebアプリなので、SSEや通常のWeb技術が全部使える
- Vercel AI SDKの streamText をそのまま繋げられる
- 現実解は「短い応答はトークで完結、長い生成はLIFF」

正直な限界:
- LIFFへの遷移が入るので、チャット内でシームレスに文字が流れる体験ではない
- ユーザーは「リンクをタップ → WebView が開く → 結果を見る → トークに戻る」というフロー
- チャット内完結の体験とは質的に異なる

表現:
- 左: トークに完成形テキストが届く（Messaging API）
- 中: 遷移の矢印（ワンクッション）
- 右: LIFF内で文章が逐次表示される

---

### スライド 7: 近似2 — Generative UI は Flex Message と LIFF に分ける

| UIの種類 | LINEでの現実解 | 向いているもの |
|----------|----------------|----------------|
| 軽いカード | Flex Message 動的生成 | 要約、候補一覧、予約確認、商品カード |
| 入力フォーム | LIFF | 複数項目入力、検索条件、設定画面 |
| グラフ・地図 | LIFF | 可視化、編集、複数ステップ操作 |

近似度: Flex △ / LIFF ○

Structured Outputとの関係:
- Claude/GPT は JSON Schema に従った構造化出力が可能
- これを Flex Message の JSON 生成に使えば「AIが動的にカードを作る」は実現できる
- ただし A2UI/MCP Apps のように送信後にインタラクティブに更新はされない
- あくまで「内容が動的なカード」であり「動的に変化するUI」ではない

話す内容:
- Flex MessageはCSS FlexboxベースのJSON。カードUIとしてはかなり表現力がある
- AIのStructured Outputでこれを生成するのは有効なパターン
- ただし本物のGenerative UIとは「送信後に状態が変わるかどうか」で決定的に違う
- 入力やインタラクションが必要ならLIFF一択

表現:
- 「Flex = 表示」「LIFF = 操作」と分けて見せる
- Structured Outputの概念図（AI → JSON Schema → Flex Message JSON）

---

### スライド 8: 近似3 — Human-in-the-Loop は Quick Reply + Postback

やりたい体験:

> AI: 「Googleカレンダーにこの予定を追加していいですか？」
> User: 「はい」または「修正」
> AI: 承認後にツール実行

LINEでの実装:

| 要素 | LINE API |
|------|----------|
| 承認ボタン | Quick Reply（最大13個） |
| ユーザーの選択 | Postback |
| 日時入力 | Datetime picker action |
| 構造化された状態 | Postback data にセッションID → サーバー側で状態管理 |

近似度: ○

話す内容:
- Human-in-the-Loopの本質は「危ない操作の前に人間を挟む」こと
- 最先端では Vercel AI SDK / OpenAI Agents SDK の `needsApproval` フラグ一つで実現
- LINEでも Quick Reply + Postback で同等の承認フローは作れる
- UIのリッチさは劣るが、フローとしては同等
- 実装上の注意: Postback data には ID だけ入れて、実行内容はサーバー側で保持。期限切れ・二重実行・キャンセル済みのハンドリングも必要

表現:
- 予定追加の承認フローをLINE画面風に見せる
- 「承認」「修正」「キャンセル」の3ボタン
- 最先端のモーダルダイアログと対比

---

### スライド 9: 近似4 — Multimodal は LINE の強み

最先端:
- Claude Vision / GPT-4V で画像を理解
- 音声入出力、動画解析

LINEでの実装:
- ユーザーが LINE で画像を送る → Webhook で受信 → getMessageContent でバイナリ取得 → Vision AI に渡す → 結果を Flex Message で返す
- 例: 料理写真 → カロリー推定、名刺 → 連絡先カード化、レシート → 家計簿登録

近似度: ◎

話す内容:
- ここは LINE が最先端に負けていない数少ない領域
- LINE はもともと画像・動画・音声・ファイルの送受信に対応している
- Vision AI との組み合わせは追加実装だけで実現可能
- 「写真を送るだけで AI が理解して返答」は LINE のチャット体験とも自然に合う

表現:
- 料理写真を送る → カロリー情報のFlex Messageが返る、の1フロー
- 「ここはLINEが強い」を緑で強調

---

### スライド 10: MCP と A2A は、LINEを中心に考えすぎない

MCP:
- AIアプリケーションを外部ツール・データ・ワークフローにつなぐ標準（月9700万DL）
- LINE Bot MCP Serverを使うと、AI側からLINEにメッセージ送信やFlex送信ができる
- つまりLINEは「AIの操作対象」としてエコシステムに入れる

A2A:
- エージェント同士が能力を発見し、協調するためのプロトコル（150+組織が本番稼働）
- LINEのsender切替はA2Aではない
- できるのは「1つのBot内の役割を見た目で分ける」こと

話す内容:
- MCPは「LINEの中にAIを閉じ込める」話ではなく、「AI側からLINEに触れる」話
- sender切替はデモ映えするが、マルチエージェントそのものではない
- ここを誠実に言うと、逆に技術的に信頼される

表現:
- Claude / ChatGPT / Agent → MCP → LINE Bot → ユーザー
- sender切替は「検索役」「要約役」などを1画面で見せる程度

---

### スライド 11: 翻訳の限界 — LINE でやるべきではないこと

LINEの既存APIで翻訳できないもの:

| 体験 | なぜ翻訳できないか |
|------|---------------------|
| チャット内リアルタイム協調編集 | トーク画面に自由なUIを埋め込めない |
| エージェントの思考過程の可視化 | テキストは送れるが Extended Thinking 的な段階表示は不向き |
| 複雑なマルチステップワークフロー | Quick Reply は1回タップで消える。状態遷移の長いフローはチャットに乗らない |
| エージェント間の自律的協調 | Bot同士が直接通信する仕組みがない。sender切替は演出に過ぎない |

判断基準:

| 条件 | LINE でやる | Web アプリにする |
|------|------------|-----------------|
| ユーザーに新しいアプリを入れさせたくない | ✅ | |
| 通知・リマインドが主体 | ✅ | |
| 短い会話で完結する | ✅ | |
| リッチなUI操作が必要 | | ✅ |
| 長いワークフロー | | ✅ |
| リアルタイム協調 | | ✅ |

話す内容:
- 「翻訳できる」と「翻訳できない」の線引きが大事
- LINE でやるべきでないことを無理にやると、体験が壊れる
- LINE は「入口」と「通知チャネル」に徹し、重い処理は Web アプリや LIFF に逃がす
- これが「翻訳」の本質: すべてを LINE に押し込むのではなく、適材適所で設計する

表現:
- 「翻訳可能」と「翻訳不能」を明確に分けた図
- 判断基準のフローチャート風

---

### スライド 12: まとめ

**LINE は AI エージェントの実行サーフェスとしては遅れている。**
**でも、入口としては強い。**

| 最先端体験 | LINEでの翻訳 | 近似度 |
|------------|--------------|--------|
| Streaming | LIFF + SSE（遷移コストあり） | ◎ |
| Generative UI | Flex Message（Structured Output）+ LIFF | △〜○ |
| Human-in-the-Loop | Quick Reply + Postback | ○ |
| Multimodal | 画像受信 + Vision AI | ◎ |
| Tool connection | LINE Bot MCP Server | ○ |
| Multi-agent | sender切替（A2Aではない） | △ |

最後に言うこと:

> LINEで最先端AIをそのまま再現するのは難しい。
> でも、翻訳できる部分とできない部分を見極めれば、
> AIエージェントへの「入口」としては十分戦える。
>
> メッセージングプラットフォームの制約はLINEだけの問題ではない。
> WhatsApp も Telegram も同じ壁にぶつかっている。
> その中で、9800万人の生活導線にいる LINE を活かす設計をする。
> それが「翻訳」。

表現:
- 近似度マップを最終版として表示
- 「再現」ではなく「翻訳」を大きく
- QRコード: 記事 + Bot + GitHub

---

### 参考リンク

- 記事: https://zenn.dev/peintangos/articles/b024c86e672191
- ショーケースBot: (LINEのQRコード)
- GitHub: https://github.com/peintangos/line-sample-2
- MCP: https://modelcontextprotocol.io/introduction
- A2A: https://github.com/a2aproject/A2A
- AG-UI: https://docs.ag-ui.com/introduction
- A2UI: https://developers.googleblog.com/a2ui-v0-9-generative-ui/
- MCP Apps: https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/
- LINE Flex Message: https://developers.line.biz/en/docs/messaging-api/using-flex-messages/
- LINE Quick Reply: https://developers.line.biz/en/docs/messaging-api/using-quick-reply/
- LINE LIFF: https://developers.line.biz/ja/docs/liff/overview/
- LINE Bot MCP Server: https://github.com/line/line-bot-mcp-server
