// ─────────────────────────────────────────────────────────────────────────────
// Date & Time preferences utility
// ─────────────────────────────────────────────────────────────────────────────

export type TimeFormat = "12h" | "24h";
export type DateFormat = "MDY" | "DMY";
export type TimezoneMode = "auto" | "manual";

export interface DateTimePrefs {
  timeFormat: TimeFormat;
  dateFormat: DateFormat;
  timezoneMode: TimezoneMode;
  manualTimezone: string;
}

const STORAGE_KEY = "sp_datetime_prefs";

const DEFAULTS: DateTimePrefs = {
  timeFormat: "12h",
  dateFormat: "MDY",
  timezoneMode: "auto",
  manualTimezone: "",
};

export function loadDateTimePrefs(): DateTimePrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<DateTimePrefs>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveDateTimePrefs(prefs: DateTimePrefs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

export function getEffectiveTimezone(prefs: DateTimePrefs): string {
  if (prefs.timezoneMode === "auto" || !prefs.manualTimezone) {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  return prefs.manualTimezone;
}

export function formatAppTime(date: Date, prefs?: DateTimePrefs): string {
  const p = prefs ?? loadDateTimePrefs();
  const tz = getEffectiveTimezone(p);
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: p.timeFormat === "12h",
      timeZone: tz,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: p.timeFormat === "12h",
    }).format(date);
  }
}

export function formatAppDate(date: Date, prefs?: DateTimePrefs): string {
  const p = prefs ?? loadDateTimePrefs();
  const tz = getEffectiveTimezone(p);
  try {
    if (p.dateFormat === "DMY") {
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: tz,
      }).format(date);
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: tz,
    }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

export function formatAppDateTime(date: Date, prefs?: DateTimePrefs): string {
  return `${formatAppDate(date, prefs)} at ${formatAppTime(date, prefs)}`;
}

export function nanosToDate(nanos: bigint): Date {
  return new Date(Number(nanos / 1_000_000n));
}

export function dateToNanos(date: Date): bigint {
  return BigInt(date.getTime()) * 1_000_000n;
}

// ─── Scheduling storage ───────────────────────────────────────────────────────

export interface ScheduledVideoInfo {
  videoId: string;
  title: string;
  publishTime: number; // ms since epoch
  notified: boolean;
}

const SCHEDULE_KEY = "sp_scheduled_videos";

export function getScheduledVideos(): ScheduledVideoInfo[] {
  try {
    const raw = localStorage.getItem(SCHEDULE_KEY);
    return raw ? (JSON.parse(raw) as ScheduledVideoInfo[]) : [];
  } catch {
    return [];
  }
}

export function saveScheduledVideo(info: ScheduledVideoInfo): void {
  try {
    const all = getScheduledVideos().filter((s) => s.videoId !== info.videoId);
    all.push(info);
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function removeScheduledVideo(videoId: string): void {
  try {
    const all = getScheduledVideos().filter((s) => s.videoId !== videoId);
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function markScheduledVideoNotified(videoId: string): void {
  try {
    const all = getScheduledVideos().map((s) =>
      s.videoId === videoId ? { ...s, notified: true } : s,
    );
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

// ─── Common timezones ──────────────────────────────────────────────────────────

export const COMMON_TIMEZONES = [
  { label: "UTC (±00:00)", value: "UTC" },
  { label: "London (GMT/BST)", value: "Europe/London" },
  { label: "Paris / Berlin (CET)", value: "Europe/Paris" },
  { label: "Moscow (MSK)", value: "Europe/Moscow" },
  { label: "Dubai (GST)", value: "Asia/Dubai" },
  { label: "Mumbai (IST)", value: "Asia/Kolkata" },
  { label: "Bangkok (ICT)", value: "Asia/Bangkok" },
  { label: "Singapore / HK (SGT)", value: "Asia/Singapore" },
  { label: "Tokyo / Seoul (JST)", value: "Asia/Tokyo" },
  { label: "Sydney (AEST)", value: "Australia/Sydney" },
  { label: "Auckland (NZST)", value: "Pacific/Auckland" },
  { label: "Honolulu (HST)", value: "Pacific/Honolulu" },
  { label: "Anchorage (AKST)", value: "America/Anchorage" },
  { label: "Los Angeles (PST/PDT)", value: "America/Los_Angeles" },
  { label: "Denver (MST/MDT)", value: "America/Denver" },
  { label: "Chicago (CST/CDT)", value: "America/Chicago" },
  { label: "New York (EST/EDT)", value: "America/New_York" },
  { label: "Toronto (EST/EDT)", value: "America/Toronto" },
  { label: "São Paulo (BRT)", value: "America/Sao_Paulo" },
  { label: "Buenos Aires (ART)", value: "America/Argentina/Buenos_Aires" },
];
