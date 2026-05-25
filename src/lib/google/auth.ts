import { google } from "googleapis";
import { getUserTokens, setUserTokens } from "@/lib/store/users";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.freebusy",
  "https://www.googleapis.com/auth/calendar.events",
];

export function createOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );
}

export function getAuthUrl(nonce: string): string {
  const oauth2Client = createOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state: nonce,
  });
}

export async function exchangeCode(code: string) {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function getAuthedClient(userId: string) {
  const tokens = getUserTokens(userId);
  if (!tokens) throw new Error(`No tokens for user ${userId}`);

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
  });

  if (Date.now() >= tokens.expiresAt) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    setUserTokens(userId, {
      accessToken: credentials.access_token!,
      refreshToken: tokens.refreshToken,
      expiresAt: credentials.expiry_date ?? Date.now() + 3600 * 1000,
    });
    oauth2Client.setCredentials(credentials);
  }

  return oauth2Client;
}
