import { google } from "googleapis";
import { getAuthedClient } from "./auth";

export type TimeSlot = { start: string; end: string };
export type BusySlot = TimeSlot;

export async function getFreeBusy(
  userId: string,
  timeMin: string,
  timeMax: string
): Promise<BusySlot[]> {
  const auth = await getAuthedClient(userId);
  const calendar = google.calendar({ version: "v3", auth });

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      items: [{ id: "primary" }],
    },
  });

  const busy = res.data.calendars?.primary?.busy ?? [];
  return busy.map((b) => ({
    start: b.start!,
    end: b.end!,
  }));
}

export function findCommonFreeSlots(
  busyByUser: Map<string, BusySlot[]>,
  timeMin: string,
  timeMax: string,
  slotDurationMinutes: number = 60
): TimeSlot[] {
  const start = new Date(timeMin).getTime();
  const end = new Date(timeMax).getTime();
  const step = 30 * 60 * 1000; // 30-min increments
  const duration = slotDurationMinutes * 60 * 1000;

  const allBusy: { start: number; end: number }[] = [];
  for (const slots of busyByUser.values()) {
    for (const slot of slots) {
      allBusy.push({
        start: new Date(slot.start).getTime(),
        end: new Date(slot.end).getTime(),
      });
    }
  }

  const freeSlots: TimeSlot[] = [];
  for (let t = start; t + duration <= end; t += step) {
    const slotStart = t;
    const slotEnd = t + duration;

    const hour = new Date(slotStart).getHours();
    if (hour < 9 || hour >= 18) continue;

    const conflicts = allBusy.some(
      (busy) => slotStart < busy.end && slotEnd > busy.start
    );
    if (!conflicts) {
      freeSlots.push({
        start: new Date(slotStart).toISOString(),
        end: new Date(slotEnd).toISOString(),
      });
    }
  }

  return freeSlots;
}

export async function createEvent(
  userId: string,
  summary: string,
  start: string,
  end: string,
  attendeeEmails?: string[]
): Promise<string> {
  const auth = await getAuthedClient(userId);
  const calendar = google.calendar({ version: "v3", auth });

  const res = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary,
      start: { dateTime: start },
      end: { dateTime: end },
      attendees: attendeeEmails?.map((email) => ({ email })),
    },
  });

  return res.data.htmlLink!;
}
