// ── Types ──────────────────────────────────────────────────────────────────
interface WatchProgressEntry {
  progress: number;
  duration: number;
  timestamp: number;
}

interface BehaviorEntry {
  watchTime: number;
  completionRate: number;
  liked: boolean;
  commented: boolean;
  skipped: boolean;
  clicks: number;
}

type WatchProgressStore = Record<string, WatchProgressEntry>;
type BehaviorStore = Record<string, BehaviorEntry>;

// ── Storage keys ────────────────────────────────────────────────────────────
const PROGRESS_KEY = "sp_watch_progress";
const BEHAVIOR_KEY = "sp_behavior";

// ── Helpers ─────────────────────────────────────────────────────────────────
function readProgress(): WatchProgressStore {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeProgress(data: WatchProgressStore) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

function readBehavior(): BehaviorStore {
  try {
    return JSON.parse(localStorage.getItem(BEHAVIOR_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeBehavior(data: BehaviorStore) {
  localStorage.setItem(BEHAVIOR_KEY, JSON.stringify(data));
}

function defaultBehavior(): BehaviorEntry {
  return {
    watchTime: 0,
    completionRate: 0,
    liked: false,
    commented: false,
    skipped: false,
    clicks: 0,
  };
}

// ── Watch progress ───────────────────────────────────────────────────────────
let _lastSaveTime = 0;

export function saveWatchProgress(
  videoId: string,
  currentTime: number,
  duration: number,
): void {
  const now = Date.now();
  if (now - _lastSaveTime < 2000) return; // throttle to every 2s
  _lastSaveTime = now;
  if (!videoId || duration <= 0) return;
  const store = readProgress();
  store[videoId] = { progress: currentTime, duration, timestamp: now };
  writeProgress(store);
}

export function getWatchProgress(videoId: string): number {
  const store = readProgress();
  return store[videoId]?.progress ?? 0;
}

export function getAllWatchProgress(): WatchProgressStore {
  return readProgress();
}

// ── Behavior tracking ────────────────────────────────────────────────────────
export function trackBehavior(
  videoId: string,
  event: "click" | "skip" | "like" | "comment" | "watchTime",
  value?: number,
): void {
  if (!videoId) return;
  const store = readBehavior();
  const entry = store[videoId] ?? defaultBehavior();

  switch (event) {
    case "click":
      entry.clicks = (entry.clicks ?? 0) + 1;
      break;
    case "skip":
      entry.skipped = true;
      break;
    case "like":
      entry.liked = true;
      break;
    case "comment":
      entry.commented = true;
      break;
    case "watchTime":
      if (value !== undefined) {
        entry.completionRate = Math.max(entry.completionRate, value);
        entry.watchTime = value;
      }
      break;
  }

  store[videoId] = entry;
  writeBehavior(store);
}

// ── Scoring ──────────────────────────────────────────────────────────────────
export function scoreVideo(
  videoId: string,
  _creatorId: string,
  allVideoIds: string[],
): number {
  const store = readBehavior();
  const entry = store[videoId];

  if (!entry) {
    // Never seen: diversity bonus
    return 5;
  }

  let score = 0;
  score += (entry.completionRate ?? 0) * 40;
  if (entry.liked) score += 30;
  if (entry.commented) score += 10;
  score += Math.min((entry.clicks ?? 0) * 2, 20);
  if (entry.skipped) score -= 50;

  // Diversity bonus for videos not in behavior store at all
  const seen = new Set(allVideoIds.filter((id) => store[id]));
  if (!seen.has(videoId)) score += 5;

  return score;
}

// ── Recommendations ──────────────────────────────────────────────────────────
export function getRecommendedVideoIds(
  videos: Array<{ id: string; creatorId: string }>,
  limit = 20,
): string[] {
  const allIds = videos.map((v) => v.id);
  const scored = videos.map((v) => ({
    id: v.id,
    score: scoreVideo(v.id, v.creatorId, allIds),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.id);
}

// ── Continue watching ────────────────────────────────────────────────────────
export function getContinueWatchingVideoIds(limit = 10): string[] {
  const store = readProgress();
  return Object.entries(store)
    .filter(([, entry]) => {
      if (!entry.duration || entry.duration <= 0) return false;
      const pct = entry.progress / entry.duration;
      return pct > 0.05 && pct < 0.95;
    })
    .sort(([, a], [, b]) => b.timestamp - a.timestamp)
    .slice(0, limit)
    .map(([id]) => id);
}

/** Returns total count of continue-watching items (no limit applied) */
export function getContinueWatchingCount(): number {
  const store = readProgress();
  return Object.entries(store).filter(([, entry]) => {
    if (!entry.duration || entry.duration <= 0) return false;
    const pct = entry.progress / entry.duration;
    return pct > 0.05 && pct < 0.95;
  }).length;
}

// ── Progress percentage helper ───────────────────────────────────────────────
export function getWatchProgressPercent(videoId: string): number {
  const store = readProgress();
  const entry = store[videoId];
  if (!entry || !entry.duration) return 0;
  return Math.round((entry.progress / entry.duration) * 100);
}
