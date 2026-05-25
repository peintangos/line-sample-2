# LINE を AI エージェントの入口にする現実解 2026
## 最先端を「再現」するのではなく、LINE で「翻訳」する

---

## スライド構成（15分版・16枚）

10枚版の芯を維持しつつ、以下を増やす:

- 「最先端AIエージェント」の説明を少し丁寧にする
- LINE側の制約をAPI単位で分解する
- 近似策ごとに「何ができて、何はできないか」を明確にする
- 最後に実装アーキテクチャとデモ導線を入れる

時間配分:

| パート | 時間 | 目的 |
|--------|------|------|
| 問題提起 | 2分 | LINEは入口として強いが、実行サーフェスとしては弱いと置く |
| 最先端の比較軸 | 3分 | Streaming / UI / Approval / Tool / Multimodal / Agent連携を整理 |
| LINEのギャップ | 3分 | Messaging API, Flex, LIFF, Quick Reply, MCPの現実を示す |
| 近似策 | 5分 | 実装パターンを具体化する |
| まとめ・デモ誘導 | 2分 | 「翻訳」という結論に戻す |

---

### スライド 1: タイトル

**LINE を AI エージェントの入口にする現実解 2026**
最先端を「再現」するのではなく、LINE で「翻訳」する

話す内容:
- 今日はLINE APIをAIエージェントの観点から見直す
- 「LINEで全部できる」ではなく「LINEでどこまで寄せられるか」を話す

表現:
- LINEグリーンをアクセントにしたシンプルなタイトル
- サブタイトルは大きめに出す

---

### スライド 2: 自己紹介と前提

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

### スライド 3: 今日の主張

**LINE は AI エージェントの実行サーフェスとしては弱い。**
**でも、AIエージェントへの入口としては強い。**

なぜLINEなのか:
- 新しいアプリのインストールが不要
- LINE Login で認証も不要
- 通知がユーザーの生活導線に届く
- 日本で約9800万人のMAU

これは LINE 固有の問題ではない:
- WhatsApp は2026年1月に汎用AIチャットBotを禁止した
- Telegram は自由だが日本でのリーチが弱い
- メッセージングプラットフォーム全般がAIエージェント向けに設計されていない
- その中で LINE は日本における現実的な選択肢

話す内容:
- ここで結論を先に言う
- LINEを選ぶ理由と、制約を認める誠実さの両方を見せる
- 以降は、この評価を検証していく流れにする

表現:
- 「実行サーフェス」と「入口」を左右に分ける
- WhatsApp/Telegram のロゴも小さく入れて「LINE だけの問題ではない」を視覚化

---

### スライド 4: いまのAIエージェント体験

いまのAIエージェント体験は、ざっくり6つに分解できる。

| 体験 | 代表例 | ユーザーから見える価値 |
|------|--------|------------------------|
| Streaming | ChatGPT / Claude風の逐次表示 | 待ち時間が短く感じる |
| Generative UI | フォーム、チャート、カード生成 | 文章だけで終わらない |
| Human-in-the-Loop | 実行前承認 | 勝手に操作されない |
| Tool connection | MCP | 外部サービスを操作できる |
| Multimodal | Vision / Audio | 画像や音声を理解できる |
| Agent-to-Agent | A2A | 複数エージェントが分担できる |

話す内容:
- プロトコル名は後で出す
- まずは「体験」から理解する

表現:
- 6つのカードを2段3列で表示
- 各カードに小さいアイコン

---

### スライド 5: プロトコルは役割で見る

| プロトコル・技術 | 役割 | LINE比較で見るポイント |
|------------------|------|--------------------------|
| MCP | AIとツール/データをつなぐ（月9700万DL） | LINEをAIから操作できるか |
| AG-UI | エージェントとフロントエンドをつなぐ | 状態更新やイベントを扱えるか |
| A2UI / MCP Apps | AI応答にUIを持たせる | チャット内にUIを出せるか |
| A2A | エージェント同士をつなぐ（150+組織） | Bot同士が標準的に協調できるか |
| Structured Output | AIがJSON Schemaに従って出力 | Flex Message JSONの動的生成に使える |

話す内容:
- ここは深追いしない
- LINEとの比較軸としてだけ使う
- Structured Output は Generative UI の入口として重要。Flex Message生成に直結する

表現:
- プロトコルを上、LINE APIを下に置く変換図

---

### スライド 6: LINEの現実

| LINE API / 機能 | 得意 | 苦手 |
|-----------------|------|------|
| Messaging API | 完成メッセージ送信、通知、日常会話 | トークン逐次表示、任意UI埋め込み。Reply Token の有効期限制約 |
| Flex Message | リッチなカード表示。AIのStructured Outputと相性良い | 送信後の動的更新、複雑な入力 |
| Quick Reply / Postback | 選択・承認 | 長い状態管理、複雑なフォーム。タップで消える |
| LIFF | Web UI、Streaming、複雑な操作 | チャット内完結ではない。遷移で体験の連続性が切れる |
| LINE Bot MCP Server | AI側からLINE操作 | LINEがAIホストになるわけではない |
| sender | 役割の見た目分離 | A2Aではない |
| 画像/動画/音声受信 | メディア送受信、Vision AIとの組み合わせ | リアルタイム音声は不可 |

隠れた制約:
- 無料プランは月200通のPush Message制限
- LINE は会話履歴APIを提供しない。文脈維持はサーバー側で自前構築が必要

話す内容:
- APIごとに役割が違う
- 1つのAPIで全部やるのが苦しい
- 組み合わせ設計が必要
- Reply Token制約とメッセージ枠は LINE Bot 開発者なら全員知ってる痛み

表現:
- 「得意」「苦手」の2列を強調
- 苦手を赤にしすぎず、設計材料として見せる

---

### スライド 7: ギャップマップ

| 最先端体験 | LINE単体での再現 | LINEでの近似 | 近似度 |
|------------|------------------|--------------|--------|
| Streaming | × | LIFF + SSE | ◎（遷移あり） |
| Generative UI | △ | Flex（Structured Output）+ LIFF | △〜○ |
| Chat内インタラクティブUI | × | LIFF遷移 | △ |
| Human-in-the-Loop | ○ | Quick Reply + Postback | ○ |
| Tool connection | ○ | LINE Bot MCP Server | ○ |
| Multimodal（画像） | ○ | 画像受信 + Vision AI | ◎ |
| Agent-to-Agent | × | 内部ルーティング + sender表示 | △ |

話す内容:
- この表が15分版の中心
- 「再現」と「近似」を分けると議論がぶれない
- Multimodal が唯一「LINE が負けてない」領域であることを強調
- LINEでやるなら「体験を翻訳する」と割り切る

表現:
- 再現列と近似列を対比
- Multimodal行を緑で目立たせる

---

### スライド 8: 近似1 — Streaming

問題:
- Messaging APIは完成したメッセージを送る設計
- Reply Token は数十秒で失効。長い生成には Push Message（非同期）を使う必要がある
- ChatGPT風のトークン逐次表示とは根本的に相性が悪い

現実解:
- 通常の会話はMessaging API
- 生成が長い・進捗を見せたい処理はLIFFに遷移
- LIFF内でSSEやWeb標準のStreaming UIを使う

正直な限界:
- LIFFへの遷移 = ユーザーは「リンクタップ → WebView → 結果を見る → トークに戻る」
- チャット内でシームレスに文字が流れる体験とは質的に異なる
- 「近似度◎」はLIFF内の体験品質の話。遷移コストまで含めると「入口は別」

設計判断:
- 「短い応答」はトークで完結
- 「長い生成」「検索中」「分析中」はLIFF

話す内容:
- 「全部LIFFにする」のではなく、体験ごとに使い分けるのがポイント

表現:
- トーク画面からLIFFに遷移し、生成結果を表示する3ステップ図
- 遷移部分を点線にして「体験が切れる」ことを視覚化

---

### スライド 9: 近似2 — Generative UI

Flex Messageでできること:
- 予約候補カード、商品・店舗カード、要約カード、承認前の確認カード
- AIのStructured Outputで動的にJSON生成 → 内容は動的なカードが作れる

Flex Messageで苦しいこと:
- チャット内での状態更新（送ったら確定）
- 複雑なフォーム入力
- グラフや地図などの高密度UI

LIFFに逃がすべきもの:
- 多項目フォーム、ダッシュボード、検索条件編集、地図・カレンダー・グラフ

Structured Outputとの関係:
- Claude/GPT の JSON Schema 出力 → Flex Message JSON を直接生成できる
- これは「AIが動的にカードUIを作る」実装パターンとして有効
- ただし A2UI/MCP Apps とは本質的に違う: 送信後にUIが変化しない

話す内容:
- Flex Messageは「表示」、LIFFは「操作」
- AIがFlex JSONを生成するのは有効だが、本物のGenerative UIとは「送信後に状態が変わるかどうか」で決定的に違う

表現:
- Structured Output → Flex Message JSON → LINE カード表示の流れ図
- Flex Messageのカード例とLIFF画面例を左右に置く

---

### スライド 10: 近似3 — Human-in-the-Loop

承認フローの基本:

1. AIが実行案を作る
2. Flex Messageで内容を見せる
3. Quick Replyで「承認」「修正」「キャンセル」
4. Postbackで選択を受け取る
5. サーバー側のセッションIDから実行内容を復元する

最先端との比較:
- Vercel AI SDK / OpenAI Agents SDK: `needsApproval` フラグ一つ。UIフレームワークがダイアログを自動生成
- LINE: Quick Reply + Postback で同等のフローは作れる。UIのリッチさは劣るが、承認/拒否の本質は同じ

注意点:
- Postback dataに大きなJSONを詰め込みすぎない（サーバー側でセッションIDだけ返す）
- 期限切れ、二重実行、キャンセル済みのハンドリング

話す内容:
- 「人間を挟む」だけならLINEはかなり相性が良い
- Quick Reply のシンプルさは逆に強み: タップ1つで承認
- 実装上は状態管理が本体

表現:
- カレンダー登録の承認フローをシーケンス図で表示

---

### スライド 11: 近似4 — Multimodal は LINE の強み

LINE のメディアハンドリング:
- 画像・動画・音声・ファイルの送受信が標準対応
- getMessageContent でバイナリ取得
- 位置情報メッセージ（緯度経度+住所）

Vision AI との組み合わせ:
- ユーザーが写真を送る → Bot が受信 → Claude Vision / GPT-4V に渡す → 結果を Flex Message で返す
- 例: 料理写真→カロリー推定、名刺→連絡先カード、レシート→家計簿登録、商品→価格比較

なぜ LINE の強みか:
- 「写真を撮って送る」はチャットの自然な行動
- 追加UIもアプリインストールも不要
- 最先端の Vision AI と LINE の「写真を送る」UX が自然に噛み合う

話す内容:
- Multimodal だけは LINE が最先端に負けていない
- むしろ「カメラで撮って送るだけ」は最高に低い導入障壁
- ここは胸を張って「LINE でやる価値がある」と言える

表現:
- 料理写真 → AI分析 → カロリーカードの1フロー
- 「ここはLINEが強い」を緑で強調

---

### スライド 12: MCP — LINEをAIエコシステムに接続する

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
- Claude Desktop → MCP Server → LINE でメッセージ送信が可能
- LINE Bot MCP Server は LINE 公式からも試験提供されている
- ここを分けると話が正確になる

表現:
- AI Agent → MCP Server → LINE Messaging API → User

---

### スライド 13: 翻訳の限界 — LINE でやるべきではないこと

翻訳不能なもの:

| 体験 | なぜ無理か |
|------|-----------|
| チャット内リアルタイム協調編集 | トーク画面に自由なUIを埋め込めない |
| エージェントの思考過程の可視化 | Extended Thinking 的な段階表示が不向き |
| 複雑なマルチステップワークフロー | Quick Reply は1回タップで消える |
| エージェント間の自律的協調 | Bot同士が直接通信する仕組みがない |
| 長時間のリアルタイム音声会話 | LINE は音声ストリーミングAPIを提供しない |

LINE でやるべき / Web にすべき の判断基準:

| LINE が向いている | Web アプリが向いている |
|-------------------|----------------------|
| 新しいアプリを入れさせたくない | リッチなUI操作が必要 |
| 通知・リマインドが主体 | 長いワークフロー |
| 短い会話で完結する | リアルタイム協調 |
| 画像を送って分析してほしい | ダッシュボード・データ分析 |

話す内容:
- 「翻訳できない」を認めることが、設計の質を上げる
- LINE は「入口」と「通知チャネル」に徹する
- 重い処理は Web / LIFF に逃がす

表現:
- 翻訳可能/不能を明確に分けた図
- 判断基準をフローチャート風に

---

### スライド 14: 推奨アーキテクチャ

```
User
  |
LINE Talk（入口・通知・承認）
  |
Messaging API / Flex / Quick Reply
  |
Webhook → Agent Orchestrator
  |        |          |         |
  |        |          |         +-- Vision AI（画像分析）
  |        |          +------------ MCP Servers / External Tools
  |        +----------------------- Session / Approval State
  +-------------------------------- LIFF App（Streaming / Rich UI）
```

設計の基本:
- トークは入口と通知
- Flex Messageは要約と確認（Structured Outputで動的生成）
- Quick Reply/Postbackは承認
- LIFFはStreaming・複雑なUI（体験の連続性は切れる）
- 画像受信 → Vision AI は LINE の強み
- MCPは外部接続

話す内容:
- ここで全体像を回収する
- 「LINEのトーク画面に全部載せる」ではなく、役割分担で作る

表現:
- シンプルなシステム構成図
- API名を正確に置く

---

### スライド 15: デモで見せるならこの順番

デモ導線:

1. LINEで料理の写真を送る → Vision AIが分析 → カロリーカード（Flex）が返る【Multimodal】
2. 「この献立で1週間分の買い物リスト作って」→ ローディング → テキストで返答【Messaging API】
3. 「もっと詳しく」→ LIFF に遷移 → Streaming で詳細レシピ表示【LIFF + SSE】
4. 「この食材をAmazonで注文していい？」→ Quick Reply で承認【Human-in-the-Loop】
5. 承認後、MCP経由で外部サービス操作 → 結果をFlex Messageで通知【MCP + Flex】

話す内容:
- 15分あるならデモまたは擬似デモを1つ入れたい
- 1つのシナリオで5つの翻訳パターンを全部見せる
- 技術説明より「この体験ならLINEで作れる」が伝わる

表現:
- 5ステップの横流れ
- 各ステップに使うAPI名と対応する最先端体験名を小さく添える

---

### スライド 16: まとめ

**LINEは最先端AIエージェントの実行環境ではない。**
**でも、AIエージェントへの入口としては現実的に強い。**

| 最先端体験 | LINEでの翻訳 | 近似度 |
|------------|--------------|--------|
| Streaming | LIFF + SSE（遷移コストあり） | ◎ |
| Generative UI | Flex Message（Structured Output）+ LIFF | △〜○ |
| Human-in-the-Loop | Quick Reply + Postback | ○ |
| Multimodal | 画像受信 + Vision AI | ◎ |
| Tool connection | LINE Bot MCP Server | ○ |
| Multi-agent | sender切替（A2Aではない） | △ |

持ち帰ってほしいこと:
- StreamingはLIFFへ（ただし体験は切れる）
- Generative UIはFlex Message（Structured Output）とLIFFに分ける
- 承認フローはQuick Reply/Postbackで作れる
- Multimodalは LINE の強み。画像を送るだけでAI分析
- MCPでLINEをAIエコシステムに接続する
- sender切替はA2Aではなく、役割の可視化
- 翻訳できないものは LINE でやらない

最後の一言:

> LINEで最先端を再現するのではなく、
> LINEの制約に合わせて最先端体験を翻訳する。
>
> メッセージングプラットフォームの制約は LINE だけの問題ではない。
> その中で、9800万人の生活導線にいるLINEを活かす設計をする。

表現:
- 「翻訳」を大きく表示
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
