import { NextRequest, NextResponse } from "next/server";
import { exchangeCode } from "@/lib/google/auth";
import { setUserTokens } from "@/lib/store/users";
import { consumeNonce, markMemberAuthorized } from "@/lib/store/sessions";
import { lineClient } from "@/lib/line/client";
import { onAllMembersAuthorized } from "@/lib/line/event-handler";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  const oauthState = consumeNonce(state);
  if (!oauthState) {
    return NextResponse.json({ error: "Invalid or expired state" }, { status: 400 });
  }

  try {
    const tokens = await exchangeCode(code);

    setUserTokens(oauthState.userId, {
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      expiresAt: tokens.expiry_date ?? Date.now() + 3600 * 1000,
    });

    await lineClient.pushMessage({
      to: oauthState.userId,
      messages: [{ type: "text", text: "カレンダー連携が完了しました！ ✅" }],
    });

    const result = markMemberAuthorized(oauthState.sessionId, oauthState.userId);
    if (result?.allAuthorized) {
      await onAllMembersAuthorized(result.session);
    }

    return new NextResponse(
      "<html><body><h2>連携完了！LINEに戻ってください。</h2></body></html>",
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (e) {
    console.error("OAuth callback error:", e);
    return NextResponse.json({ error: "OAuth failed" }, { status: 500 });
  }
}
