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
  handleBeacon,
  handleAccountLink,
} from "@/lib/handlers/event-handlers";
import {
  demo2BookingConfirm,
  demo2BookingDone,
  demo3Approved,
  demo3Cancelled,
  demo3TimeChanged,
  demo4ImageAnalysis,
} from "@/lib/handlers/demo-handlers";

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
      if (await handleDemoPostback(event as webhook.PostbackEvent)) break;
      await handlePostback(event as webhook.PostbackEvent);
      break;
    case "unsend":
      await handleUnsend(event as webhook.UnsendEvent);
      break;
    case "videoPlayComplete":
      await handleVideoPlayComplete(event as webhook.VideoPlayCompleteEvent);
      break;
    case "beacon":
      await handleBeacon(event as webhook.BeaconEvent);
      break;
    case "accountLink":
      await handleAccountLink(event as webhook.AccountLinkEvent);
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

  if (message.type === "text") {
    const textMsg = message as webhook.TextMessageContent;

    // メンション検知
    const mention = textMsg.mention;
    if (mention?.mentionees?.some((m) => "isSelf" in m && (m as { isSelf?: boolean }).isSelf)) {
      await lineClient.replyMessage({
        replyToken,
        messages: [{
          type: "text",
          text: `🔔 Botがメンションされました！\n\nmention.mentionees で isSelf: true を検知しています。\nテキスト: 「${textMsg.text}」`,
        }],
      });
      return;
    }

    // 引用メッセージ検知
    if (textMsg.quotedMessageId) {
      await lineClient.replyMessage({
        replyToken,
        messages: [{
          type: "text",
          text: `💬 引用メッセージを検知しました！\n\nquotedMessageId: ${textMsg.quotedMessageId}\nテキスト: 「${textMsg.text}」`,
        }],
      });
      return;
    }

    await handleTextMessage(replyToken, textMsg.text, source);
    return;
  }

  switch (message.type) {
    case "image":
      if (userId) {
        await demo4ImageAnalysis(replyToken, userId);
      } else {
        await handleMediaMessage(replyToken, message);
      }
      break;
    case "video":
    case "audio":
    case "file":
      await handleMediaMessage(replyToken, message);
      break;
    case "location": {
      const loc = message as webhook.LocationMessageContent;
      await lineClient.replyMessage({
        replyToken,
        messages: [{
          type: "text",
          text: `📍 ${loc.address ?? "位置情報"}付近ですね！\n緯度: ${loc.latitude}\n経度: ${loc.longitude}\n\n💡 location メッセージで address/latitude/longitude を受信できます`,
        }],
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
            text: `いいスタンプですね！\nパッケージID: ${sticker.packageId}\nスタンプID: ${sticker.stickerId}\n\n💡 Botが送れるスタンプはパッケージが限定されています`,
          },
          { type: "sticker", packageId: "446", stickerId: "1988" },
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

async function handleDemoPostback(event: webhook.PostbackEvent): Promise<boolean> {
  const data = new URLSearchParams(event.postback.data ?? "");
  const action = data.get("action");
  const replyToken = event.replyToken;
  if (!replyToken || !action?.startsWith("demo")) return false;

  switch (action) {
    case "demo2_select": {
      const shopId = data.get("shop") ?? "1";
      await lineClient.replyMessage({
        replyToken,
        messages: demo2BookingConfirm(shopId),
      });
      return true;
    }
    case "demo2_book": {
      const shopId = data.get("shop") ?? "1";
      await lineClient.replyMessage({
        replyToken,
        messages: demo2BookingDone(shopId),
      });
      return true;
    }
    case "demo2_change": {
      await lineClient.replyMessage({
        replyToken,
        messages: [{ type: "text", text: "条件を変更して再検索します。\n\n「デモ2」と送ってやり直してみてください。" }],
      });
      return true;
    }
    case "demo3_approve": {
      await lineClient.replyMessage({
        replyToken,
        messages: demo3Approved(),
      });
      return true;
    }
    case "demo3_cancel": {
      await lineClient.replyMessage({
        replyToken,
        messages: demo3Cancelled(),
      });
      return true;
    }
    case "demo3_change_time": {
      const params = event.postback.params as Record<string, string> | undefined;
      const datetime = params?.datetime ?? params?.date ?? "指定なし";
      await lineClient.replyMessage({
        replyToken,
        messages: demo3TimeChanged(datetime),
      });
      return true;
    }
    case "demo4_record": {
      await lineClient.replyMessage({
        replyToken,
        messages: [{ type: "text", text: "📝 食事記録に追加しました！\n\n本日の摂取カロリー: 1,234 kcal / 2,000 kcal" }],
      });
      return true;
    }
    default:
      return false;
  }
}
