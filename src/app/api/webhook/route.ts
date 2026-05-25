import { validateSignature, webhook } from "@line/bot-sdk";
import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { handleEvent } from "@/lib/line/event-handler";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-line-signature") ?? "";

  const channelSecret = process.env.LINE_CHANNEL_SECRET!;
  if (!validateSignature(body, channelSecret, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const payload = JSON.parse(body) as { events: webhook.Event[] };

  after(async () => {
    for (const event of payload.events) {
      try {
        await handleEvent(event);
      } catch (e) {
        console.error("Event handling error:", e);
      }
    }
  });

  return NextResponse.json({ status: "ok" });
}
