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
