import { webhook } from "@line/bot-sdk";
import { lineClient, blobClient } from "@/lib/line/client";

export async function handleMediaMessage(
  replyToken: string,
  message: webhook.MessageContent
): Promise<void> {
  const typeLabels: Record<string, string> = {
    image: "🖼️ 画像",
    video: "🎬 動画",
    audio: "🔊 音声",
    file: "📄 ファイル",
  };

  const label = typeLabels[message.type] ?? message.type;
  const messageId = message.id;

  let contentInfo = "";
  if (message.type === "image" || message.type === "video" || message.type === "audio") {
    try {
      const content = await blobClient.getMessageContent(messageId);
      const chunks: Buffer[] = [];
      for await (const chunk of content as AsyncIterable<Buffer>) {
        chunks.push(chunk);
      }
      const size = Buffer.concat(chunks).length;
      contentInfo = `\nサイズ: ${(size / 1024).toFixed(1)} KB`;
      contentInfo += `\n\n💡 getMessageContent API でバイナリを取得しました`;
    } catch {
      contentInfo = "\n\n⚠️ コンテンツの取得に失敗しました";
    }
  }

  if (message.type === "file") {
    const fileMsg = message as webhook.FileMessageContent;
    contentInfo = `\nファイル名: ${fileMsg.fileName}\nサイズ: ${((fileMsg.fileSize ?? 0) / 1024).toFixed(1)} KB`;
  }

  await lineClient.replyMessage({
    replyToken,
    messages: [
      {
        type: "text",
        text: `${label}を受け取りました！\nメッセージID: ${messageId}${contentInfo}`,
      },
    ],
  });
}
