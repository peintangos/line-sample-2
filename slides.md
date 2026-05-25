# LINE を AI エージェントの入口にする現実解 2026
## 最先端を「再現」するのではなく、LINE で「翻訳」する

---

## スライド構成

5〜10分のライトニングトーク想定。

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
| 生活導線 | 強い | 日本で約9800万人のMAU |
| 現実解 | 翻訳する | Messaging API / Flex Message / Quick Reply / LIFF / MCP Server に分解する |

話す内容:
- 「LINEが最先端AIプラットフォームになる」は言いすぎ
- ただし「AIエージェントへの入口」としてはかなり強い
- 今日は最先端体験をLINEの既存APIに翻訳する

表現:
- 左に「実行環境としての弱さ」、右に「入口としての強さ」
- 最後に「翻訳」というキーワードを強調

---

### スライド 3: いまのAIエージェント体験を4つに分解する

最先端プロトコルの名前を全部覚える必要はない。
重要なのは、ユーザー体験が何に分解できるか。

| 体験 | 代表的な技術・プロトコル | 何がうれしいか |
|------|--------------------------|----------------|
| Streaming | SSE / AG-UI | 返答や状態変化がリアルタイムに見える |
| Generative UI | A2UI / Apps SDK / MCP Apps | 文章だけでなくフォームやグラフが出る |
| Human-in-the-Loop | tool approval / confirmation flow | 実行前にユーザーが承認できる |
| Tool connection | MCP | AIが外部ツールやデータに接続できる |

補足としてのA2A:
- Agent-to-Agent の標準化も進んでいる
- ただし今日の主題は、ユーザーがLINE上で体験する部分

話す内容:
- MCPは外部システム接続の標準として広がっている
- AG-UI/A2UI/MCP Apps系は「チャットがUIを持つ」方向
- A2Aは重要だが、今日のLINE活用では優先度を下げる

表現:
- プロトコルスタックではなく、4象限マップ
- 「プロトコル名」より「体験」を大きく表示

---

### スライド 4: で、LINEはどこがつらいのか

| 最先端の体験 | LINEの現実 | ギャップ |
|--------------|------------|----------|
| Streaming | Messaging API は完成形メッセージを送る | 大 |
| Generative UI | Flex Message は送信時にJSONを確定する | 大 |
| Chat内インタラクティブUI | トーク画面に任意Web UIは埋め込めない | 大 |
| Human-in-the-Loop | Quick Reply / Postback で近い体験は作れる | 中 |
| Tool connection | LINE Bot MCP Server でAI側からLINEを操作できる | 小〜中 |
| Multi-agent | Bot同士の標準的な直接連携はない | 大 |

話す内容:
- LINEのMessaging APIは、基本的には「完成したメッセージを送る」設計
- だからChatGPTやClaudeのような逐次生成・動的UIとは相性が悪い
- でも「全滅」ではない。既存APIに分解すると寄せられる部分がある

表現:
- 赤・黄・緑でギャップを表示
- 「できない」で終わらず、次のスライドへの導線として「翻訳」を置く

---

### スライド 5: 翻訳方針

**LINEで最先端を再現しようとしない。役割ごとにAPIを割り当てる。**

| 役割 | LINEでの担当 |
|------|--------------|
| 日常会話 | Messaging API |
| 承認・選択 | Quick Reply / Postback |
| カード表示 | Flex Message |
| 高度なUI・Streaming | LIFF |
| AIエコシステム接続 | LINE Bot MCP Server |
| 複数役割の見せ方 | sender の icon / name 切替 |

話す内容:
- LINEのトーク画面だけで全部やろうとすると苦しい
- 普段はMessaging API、複雑な操作だけLIFFへ逃がす
- AI側からLINEを操作したい場合はMCP Serverでつなぐ

表現:
- 「最先端」から「LINE API」へ変換する翻訳テーブル
- ここから先は具体例として3つだけ話す

---

### スライド 6: 近似1 - Streaming は LIFF + SSE に逃がす

| やりたいこと | Messaging API | LIFF |
|--------------|---------------|------|
| トークン逐次表示 | 不向き | 可能 |
| 生成中の状態表示 | loading animation 程度 | 自由に実装可能 |
| UI更新 | メッセージ再送信が必要 | React / Next.js 等で更新可能 |

近似度: ◎

話す内容:
- Messaging APIでChatGPT風の1文字ずつ流れる体験は作りにくい
- でもLIFFはLINE上で動くWebアプリなので、SSEや通常のWeb技術が使える
- 現実解は「普段はトーク、重い生成・逐次表示はLIFF」

注意点:
- LIFFへの遷移が入るので、完全なチャット内体験ではない
- ただし体験品質はかなり近づけられる

表現:
- 左: トークに完成形テキストが届く
- 右: LIFF内で文章が逐次表示される

---

### スライド 7: 近似2 - Generative UI は Flex Message と LIFF に分ける

| UIの種類 | LINEでの現実解 | 向いているもの |
|----------|----------------|----------------|
| 軽いカード | Flex Message 動的生成 | 要約、候補一覧、予約確認、商品カード |
| 入力フォーム | LIFF | 複数項目入力、検索条件、設定画面 |
| グラフ・地図・ダッシュボード | LIFF | 可視化、編集、複数ステップ操作 |

近似度:
- Flex Message: △
- LIFF: ○

話す内容:
- Flex MessageはCSS FlexboxベースのJSONでカードUIを作れる
- AIにJSONを生成させれば「内容が動的なカード」は作れる
- ただし送信後にチャット内で状態が動的更新されるわけではない
- 本当にインタラクティブなUIはLIFFに逃がすのが現実的

表現:
- 「Flex = 表示」「LIFF = 操作」と分けて見せる
- ClaudeがFlex JSONを生成する図は使えるが、「Generative UIそのもの」とは言い切らない

---

### スライド 8: 近似3 - Human-in-the-Loop は Quick Reply + Postback

やりたい体験:

> AI: 「Googleカレンダーにこの予定を追加していいですか？」
> User: 「はい」または「修正」
> AI: 承認後にツール実行

LINEでの実装:

| 要素 | LINE API |
|------|----------|
| 承認ボタン | Quick Reply |
| ユーザーの選択 | Postback |
| 日時入力 | Datetime picker action |
| 構造化された状態 | Postback data / サーバー側セッション |

近似度: ○

話す内容:
- Human-in-the-Loopの本質は「危ない操作の前に人間を挟む」こと
- LINEでもQuick ReplyとPostbackで承認フローは作れる
- 複雑なJSONをPostback dataに全部入れるより、サーバー側に状態を置いてIDだけ返す方が安全

表現:
- 予定追加の1フローをLINE画面風に見せる
- 「承認」「修正」「キャンセル」の3ボタン

---

### スライド 9: MCP と A2A は、LINEを中心に考えすぎない

MCP:
- MCPはAIアプリケーションを外部ツール・データ・ワークフローにつなぐ標準
- LINE Bot MCP Serverを使うと、AI側からLINEにメッセージ送信やFlex送信ができる
- つまりLINEは「AIの操作対象」としてエコシステムに入れる

A2A:
- A2Aはエージェント同士が能力を発見し、協調するためのプロトコル
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

### スライド 10: まとめ

**LINE は AI エージェントの実行サーフェスとしては遅れている。**
**でも、入口としては強い。**

| 最先端体験 | LINEでの翻訳 |
|------------|--------------|
| Streaming | LIFF + SSE |
| Generative UI | Flex Message 動的生成 + LIFF |
| Human-in-the-Loop | Quick Reply + Postback |
| Tool connection | LINE Bot MCP Server |
| Multi-agent風の見せ方 | sender 切替。ただしA2Aではない |

最後に言うこと:

> LINEで最先端AIをそのまま再現するのは難しい。
> でも、LINEの制約を理解してAPIを組み合わせれば、
> AIエージェントへの「入口」としては十分戦える。

表現:
- 「再現」ではなく「翻訳」を大きく表示
- QRコードは最後に小さく配置

---

## 15分版パターン

15分取れる場合は、10枚版の芯を維持しつつ、以下を増やす。

- 「最先端AIエージェント」の説明を少し丁寧にする
- LINE側の制約をAPI単位で分解する
- 近似策ごとに「何ができて、何はできないか」を明確にする
- 最後に実装アーキテクチャとデモ導線を入れる

時間配分:

| パート | 時間 | 目的 |
|--------|------|------|
| 問題提起 | 2分 | LINEは入口として強いが、実行サーフェスとしては弱いと置く |
| 最先端の比較軸 | 3分 | Streaming / UI / Approval / Tool / Agent連携を整理 |
| LINEのギャップ | 3分 | Messaging API, Flex, LIFF, Quick Reply, MCPの現実を示す |
| 近似策 | 5分 | 実装パターンを具体化する |
| まとめ・デモ誘導 | 2分 | 「翻訳」という結論に戻す |

---

### 15分版 スライド 1: タイトル

**LINE を AI エージェントの入口にする現実解 2026**
最先端を「再現」するのではなく、LINE で「翻訳」する

話す内容:
- 今日はLINE APIをAIエージェントの観点から見直す
- 「LINEで全部できる」ではなく「LINEでどこまで寄せられるか」を話す

表現:
- 10枚版と同じタイトル
- 右下に「15min version」と小さく入れる

---

### 15分版 スライド 2: 自己紹介と前提

- 松尾淳平
- Zennで「LINE を AI エージェントの入口にする現実解」を執筆
- 今回はその続編として、LINEの限界と近似設計を話す

今日扱わないこと:
- LLMモデル性能の比較
- LINE公式アカウント運用論
- 完全なA2A実装

話す内容:
- 聴衆に「LINE APIを触った人」と「AIエージェントに興味がある人」が混ざっている想定
- だから最初に比較軸を揃える

表現:
- 記事QRコードを1つ
- テキストは少なめ

---

### 15分版 スライド 3: 今日の主張

**LINE は AI エージェントの実行サーフェスとしては弱い。**
**でも、AIエージェントへの入口としては強い。**

| 観点 | LINEの評価 |
|------|------------|
| リアルタイム生成 | 弱い |
| 動的UI | 弱い |
| ツール承認 | 近似可能 |
| 外部ツール接続 | MCPで接続可能 |
| ユーザー接点 | 強い |

話す内容:
- ここで結論を先に言う
- 以降は、この評価を検証していく流れにする

表現:
- 「実行サーフェス」と「入口」を左右に分ける
- 左は弱点、右は強み

---

### 15分版 スライド 4: いまのAIエージェント体験

いまのAIエージェント体験は、ざっくり5つに分解できる。

| 体験 | 代表例 | ユーザーから見える価値 |
|------|--------|------------------------|
| Streaming | ChatGPT / Claude風の逐次表示 | 待ち時間が短く感じる |
| Generative UI | フォーム、チャート、カード生成 | 文章だけで終わらない |
| Human-in-the-Loop | 実行前承認 | 勝手に操作されない |
| Tool connection | MCP | 外部サービスを操作できる |
| Agent-to-Agent | A2A | 複数エージェントが分担できる |

話す内容:
- プロトコル名は後で出す
- まずは「体験」から理解する

表現:
- 5つのカードを横並びまたは2段で表示
- 各カードに小さいアイコン

---

### 15分版 スライド 5: プロトコルは役割で見る

| プロトコル・技術 | 役割 | LINE比較で見るポイント |
|------------------|------|--------------------------|
| MCP | AIとツール/データをつなぐ | LINEをAIから操作できるか |
| AG-UI | エージェントとフロントエンドをつなぐ | 状態更新やイベントを扱えるか |
| A2UI / Apps SDK / MCP Apps | AI応答にUIを持たせる | チャット内にUIを出せるか |
| A2A | エージェント同士をつなぐ | Bot同士が標準的に協調できるか |

話す内容:
- ここは深追いしない
- LINEとの比較軸としてだけ使う
- 「最先端プロトコルをLINEに移植する」のではなく「役割をLINE APIへ翻訳する」

表現:
- プロトコルを上、LINE APIを下に置く変換図

---

### 15分版 スライド 6: LINEの現実

| LINE API / 機能 | 得意 | 苦手 |
|-----------------|------|------|
| Messaging API | 完成メッセージ送信、通知、日常会話 | トークン逐次表示、任意UI埋め込み |
| Flex Message | リッチなカード表示 | 送信後の動的更新、複雑な入力 |
| Quick Reply / Postback | 選択・承認 | 長い状態管理、複雑なフォーム |
| LIFF | Web UI、Streaming、複雑な操作 | チャット内完結ではない |
| LINE Bot MCP Server | AI側からLINE操作 | LINEがAIホストになるわけではない |
| sender | 役割の見た目分離 | A2Aではない |

話す内容:
- APIごとに役割が違う
- 1つのAPIで全部やるのが苦しい
- 組み合わせ設計が必要

表現:
- 「得意」「苦手」の2列を強調
- 苦手を赤にしすぎず、設計材料として見せる

---

### 15分版 スライド 7: ギャップマップ

| 最先端体験 | LINE単体での再現 | LINEでの近似 |
|------------|------------------|--------------|
| Streaming | × | LIFF + SSE |
| Generative UI | △ | Flex Message + LIFF |
| Chat内インタラクティブUI | × | LIFF遷移 |
| Human-in-the-Loop | ○ | Quick Reply + Postback |
| Tool connection | ○ | LINE Bot MCP Server |
| Agent-to-Agent | × | 内部ルーティング + sender表示 |

話す内容:
- この表が15分版の中心
- 「再現」と「近似」を分けると議論がぶれない
- LINEでやるなら「体験を翻訳する」と割り切る

表現:
- 再現列と近似列を対比
- 近似列を緑寄りにして「現実解」を見せる

---

### 15分版 スライド 8: 近似1 - Streaming

問題:
- Messaging APIは完成したメッセージを送る設計
- ChatGPT風のトークン逐次表示とは相性が悪い

現実解:
- 通常の会話はMessaging API
- 生成が長い・進捗を見せたい処理はLIFFに遷移
- LIFF内でSSEやWeb標準のStreaming UIを使う

設計判断:
- 「短い応答」はトークで完結
- 「長い生成」「検索中」「分析中」はLIFF

話す内容:
- ここで「全部LIFFにする」のではなく、体験ごとに使い分けるのがポイント

表現:
- トーク画面からLIFFに遷移し、生成結果を表示する3ステップ図

---

### 15分版 スライド 9: 近似2 - Generative UI

Flex Messageでできること:
- 予約候補カード
- 商品・店舗カード
- 要約カード
- 承認前の確認カード

Flex Messageで苦しいこと:
- チャット内での状態更新
- 複雑なフォーム入力
- グラフや地図などの高密度UI

LIFFに逃がすべきもの:
- 多項目フォーム
- ダッシュボード
- 検索条件編集
- 地図・カレンダー・グラフ

話す内容:
- Flex Messageは「表示」、LIFFは「操作」
- AIがFlex JSONを生成するのは有効だが、A2UIやMCP Appsと同じ体験ではない

表現:
- Flex Messageのカード例とLIFF画面例を左右に置く

---

### 15分版 スライド 10: 近似3 - Human-in-the-Loop

承認フローの基本:

1. AIが実行案を作る
2. Flex Messageで内容を見せる
3. Quick Replyで「承認」「修正」「キャンセル」
4. Postbackで選択を受け取る
5. サーバー側のセッションIDから実行内容を復元する

注意点:
- Postback dataに大きなJSONを詰め込みすぎない
- 実行対象はサーバー側で保持する
- 期限切れ、二重実行、キャンセル済みを扱う

話す内容:
- 「人間を挟む」だけならLINEはかなり相性が良い
- 実装上は状態管理が本体

表現:
- カレンダー登録の承認フローをシーケンス図で表示

---

### 15分版 スライド 11: MCP - LINEをAIエコシステムに接続する

MCPでできること:
- AI側からLINEにテキストを送る
- AI側からFlex Messageを送る
- ユーザープロフィールなどを取得する
- LINEを「AIが使えるツール」にする

誤解しやすい点:
- LINEアプリ内にMCP Appsが出るわけではない
- LINEがAIエージェントホストになるわけではない
- あくまでAI側からLINE Messaging APIを操作できるという話

話す内容:
- MCPは「LINEの中のAI」ではなく「AIから触れるLINE」
- ここを分けると話が正確になる

表現:
- AI Agent → MCP Server → LINE Messaging API → User

---

### 15分版 スライド 12: A2A - sender切替はA2Aではない

A2A:
- エージェント同士が能力を発見する
- タスクを委譲する
- 長い処理を協調して進める

LINEでできる近似:
- 内部では1つのBotがルーティングする
- senderのname/iconで「検索役」「要約役」「承認役」を見た目で分ける
- ユーザーには役割分担が見えやすくなる

大事な線引き:
- これはA2Aではない
- ユーザー体験上の演出、または内部設計の可視化

話す内容:
- ここは正直に言う
- 「A2Aっぽく見せる」ではなく「役割を見える化する」と表現する

表現:
- 1つのBotから、役割別の吹き出しが出るLINE画面風モック

---

### 15分版 スライド 13: 推奨アーキテクチャ

```
User
  |
LINE Talk
  |
Messaging API
  |
Webhook / Agent Orchestrator
  |        |          |
  |        |          +-- MCP Servers / External Tools
  |        +------------- Session / Approval State
  +---------------------- LIFF App for rich UI / streaming
```

設計の基本:
- トークは入口
- LIFFは高度UI
- Flex Messageは要約と確認
- Quick Reply/Postbackは承認
- MCPは外部接続

話す内容:
- ここで全体像を回収する
- 「LINEのトーク画面に全部載せる」ではなく、役割分担で作る

表現:
- シンプルなシステム構成図
- API名を正確に置く

---

### 15分版 スライド 14: デモで見せるならこの順番

デモ導線:

1. LINEで「明日の予定を整理して」と送る
2. Botが要約カードをFlex Messageで返す
3. 「カレンダー登録していい？」をQuick Replyで承認
4. 長い分析が必要なところでLIFFを開く
5. LIFF内でStreaming表示
6. 最後にMCP経由でLINEへ結果通知

話す内容:
- 15分あるならデモまたは擬似デモを1つ入れたい
- 技術説明より「この体験ならLINEで作れる」が伝わる

表現:
- 6ステップの横流れ
- 各ステップに使うAPI名を小さく添える

---

### 15分版 スライド 15: まとめ

**LINEは最先端AIエージェントの実行環境ではない。**
**でも、AIエージェントへの入口としては現実的に強い。**

持ち帰ってほしいこと:
- StreamingはLIFFへ逃がす
- Generative UIはFlex MessageとLIFFに分ける
- 承認フローはQuick Reply/Postbackで作れる
- MCPでLINEをAIエコシステムに接続する
- sender切替はA2Aではなく、役割の可視化として使う

最後の一言:

> LINEで最先端を再現するのではなく、
> LINEの制約に合わせて最先端体験を翻訳する。

表現:
- 10枚版と同じ結論に戻す
- 記事、Bot、GitHubのQRコード

---

### 参考リンク

- 記事: https://zenn.dev/peintangos/articles/b024c86e672191
- ショーケースBot: (LINEのQRコード)
- GitHub: https://github.com/peintangos/line-sample-2
- MCP: https://modelcontextprotocol.io/docs/getting-started/intro
- A2A: https://github.com/a2aproject/A2A
- AG-UI: https://docs.ag-ui.com/introduction
- A2UI: https://a2ui.org/specification/v0_10/docs/a2ui_protocol/
- LINE Flex Message: https://developers.line.biz/en/docs/messaging-api/using-flex-messages/
- LINE Quick Reply: https://developers.line.biz/en/docs/messaging-api/using-quick-reply/
- LINE LIFF: https://developers.line.biz/ja/docs/liff/overview/
- LINE Bot MCP Server: https://github.com/line/line-bot-mcp-server
