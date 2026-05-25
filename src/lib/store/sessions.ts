import { ScheduleSession, OAuthState } from "@/types";
import { randomBytes } from "crypto";

const sessionStore = new Map<string, ScheduleSession>();
const nonceStore = new Map<string, OAuthState>();

export function createSession(
  groupId: string,
  triggerUserId: string,
  triggerText: string,
  members: string[]
): ScheduleSession {
  const sessionId = randomBytes(16).toString("hex");
  const session: ScheduleSession = {
    sessionId,
    groupId,
    triggerUserId,
    triggerText,
    members,
    authorizedMembers: new Set(),
    status: "waiting_auth",
    createdAt: Date.now(),
  };
  sessionStore.set(sessionId, session);
  return session;
}

export function getSession(sessionId: string): ScheduleSession | undefined {
  return sessionStore.get(sessionId);
}

export function getActiveSessionForGroup(
  groupId: string
): ScheduleSession | undefined {
  for (const session of sessionStore.values()) {
    if (session.groupId === groupId && session.status !== "done") {
      return session;
    }
  }
  return undefined;
}

export function markMemberAuthorized(
  sessionId: string,
  userId: string
): { allAuthorized: boolean; session: ScheduleSession } | undefined {
  const session = sessionStore.get(sessionId);
  if (!session) return undefined;

  session.authorizedMembers.add(userId);
  const allAuthorized = session.members.every((m) =>
    session.authorizedMembers.has(m)
  );

  return { allAuthorized, session };
}

export function updateSessionStatus(
  sessionId: string,
  status: ScheduleSession["status"]
): void {
  const session = sessionStore.get(sessionId);
  if (session) session.status = status;
}

export function setProposedSlots(
  sessionId: string,
  slots: { start: string; end: string; label: string }[]
): void {
  const session = sessionStore.get(sessionId);
  if (session) session.proposedSlots = slots;
}

export function createNonce(sessionId: string, userId: string): string {
  const nonce = randomBytes(32).toString("hex");
  nonceStore.set(nonce, { sessionId, userId, createdAt: Date.now() });
  return nonce;
}

export function consumeNonce(nonce: string): OAuthState | undefined {
  const state = nonceStore.get(nonce);
  if (!state) return undefined;
  nonceStore.delete(nonce);
  return state;
}
