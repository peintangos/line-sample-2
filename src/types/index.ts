export type GoogleTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export type ScheduleSession = {
  sessionId: string;
  groupId: string;
  triggerUserId: string;
  triggerText: string;
  members: string[];
  authorizedMembers: Set<string>;
  status: "waiting_auth" | "proposing" | "waiting_confirm" | "done";
  proposedSlots?: { start: string; end: string; label: string }[];
  createdAt: number;
};

export type OAuthState = {
  sessionId: string;
  userId: string;
  createdAt: number;
};
