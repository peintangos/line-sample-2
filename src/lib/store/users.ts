import { GoogleTokens } from "@/types";

const tokenStore = new Map<string, GoogleTokens>();

export function setUserTokens(userId: string, tokens: GoogleTokens): void {
  tokenStore.set(userId, tokens);
}

export function getUserTokens(userId: string): GoogleTokens | undefined {
  return tokenStore.get(userId);
}

export function hasUserTokens(userId: string): boolean {
  return tokenStore.has(userId);
}

export function getAllAuthorizedUserIds(): string[] {
  return Array.from(tokenStore.keys());
}
