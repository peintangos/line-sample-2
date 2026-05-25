import { webhook } from "@line/bot-sdk";
import { lineClient } from "./client";
import { handleTextMessage } from "@/lib/handlers/text-handler";
import { handleMediaMessage } from "@/lib/handlers/media-handler";
import {
  handleFollow,
  handleJoin,
  handleMemberJoined,
  handlePostback,
  handleUnsend,
  handleVideoPlayComplete,
} from "@/lib/handlers/event-handlers";

export async function handleEvent(event: webhook.Event): Promise<void> {
  switch (event.type) {
    case "message":
      await handleMessageEvent(event as webhook.MessageEvent);
      break;
    case "follow":
      await handleFollow(event as webhook.FollowEvent);
      break;
    case "unfollow":
      console.log("User unfollowed");
      break;
    case "join":
      await handleJoin(event as webhook.JoinEvent);
      break;
    case "leave":
      console.log("Bot left group");
      break;
    case "memberJoined":
      await handleMemberJoined(event as webhook.MemberJoinedEvent);
      break;
    case "memberLeft":
      console.log("Member left group");
      break;
    case "postback":
      await handlePostback(event as webhook.PostbackEvent);
      break;
    case "unsend":
      await handleUnsend(event as webhook.UnsendEvent);
      break;
    case "videoPlayComplete":
      await handleVideoPlayComplete(
        event as webhook.VideoPlayCompleteEvent
      );
      break;
    default:
      console.log("Unhandled event type:", event.type);
  }
}

async function handleMessageEvent(event: webhook.MessageEvent): Promise<void> {
  const message = event.message;
  const replyToken = event.replyToken!;
  const source = event.source!;
  const userId = (source as webhook.UserSource).userId;

  if (userId) {
    try {
      await lineClient.showLoadingAnimation({ chatId: userId, loadingSeconds: 5 });
    } catch {
      // グループチャットでは動作しない
    }
  }

  switch (message.type) {
    case "text":
      await handleTextMessage(
        replyToken,
        (message as webhook.TextMessageContent).text,
        source
      );
      break;
    case "image":
    case "video":
    case "audio":
    case "file":
      await handleMediaMessage(replyToken, message);
      break;
    case "location": {
      const loc = message as webhook.LocationMessageContent;
      await lineClient.replyMessage({
        replyToken,
        messages: [
          {
            type: "text",
            text: `📍 ${loc.address ?? "位置情報"}付近ですね！\n緯度: ${loc.latitude}\n経度: ${loc.longitude}`,
          },
        ],
      });
      break;
    }
    case "sticker": {
      const sticker = message as webhook.StickerMessageContent;
      await lineClient.replyMessage({
        replyToken,
        messages: [
          {
            type: "text",
            text: `いいスタンプですね！（パッケージ: ${sticker.packageId}, スタンプ: ${sticker.stickerId}）`,
          },
          {
            type: "sticker",
            packageId: "446",
            stickerId: "1988",
          },
        ],
      });
      break;
    }
    default: {
      const msgType = (message as { type: string }).type;
      await lineClient.replyMessage({
        replyToken,
        messages: [{ type: "text", text: `${msgType} タイプのメッセージを受信しました` }],
      });
    }
  }
}
