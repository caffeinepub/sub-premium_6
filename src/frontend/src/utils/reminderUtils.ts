// Stores reminders in localStorage keyed by `reminder_<userId>_<videoId>`
// userId can be principal string or "anon"

export function getReminderKey(userId: string, videoId: string): string {
  return `reminder_${userId}_${videoId}`;
}

export type ReminderEntry = {
  videoId: string;
  videoTitle: string;
  publishTimeMs: number;
  notified: boolean;
};

export function setReminder(
  userId: string,
  videoId: string,
  videoTitle: string,
  publishTimeMs: number,
): void {
  localStorage.setItem(
    getReminderKey(userId, videoId),
    JSON.stringify({ videoId, videoTitle, publishTimeMs, notified: false }),
  );
}

export function removeReminder(userId: string, videoId: string): void {
  localStorage.removeItem(getReminderKey(userId, videoId));
}

export function hasReminder(userId: string, videoId: string): boolean {
  return localStorage.getItem(getReminderKey(userId, videoId)) !== null;
}

export function getPendingReminders(userId: string): ReminderEntry[] {
  const entries: ReminderEntry[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(`reminder_${userId}_`)) {
      try {
        const raw = localStorage.getItem(key) ?? "{}";
        const val = JSON.parse(raw) as ReminderEntry;
        if (!val.notified) entries.push(val);
      } catch {
        // ignore malformed entries
      }
    }
  }
  return entries;
}

export function markReminderNotified(userId: string, videoId: string): void {
  const key = getReminderKey(userId, videoId);
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      const val = JSON.parse(raw) as ReminderEntry;
      localStorage.setItem(key, JSON.stringify({ ...val, notified: true }));
    } catch {
      // ignore
    }
  }
}
