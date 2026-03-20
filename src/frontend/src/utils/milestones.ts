const MILESTONES = [
  10, 50, 100, 500, 1_000, 5_000, 10_000, 50_000, 100_000, 1_000_000,
];

function milestoneKey(videoId: string, milestone: number): string {
  return `milestone_${videoId}_${milestone}`;
}

/** Returns the highest unclaimed milestone crossed at `views`, or null if none. */
export function checkMilestone(videoId: string, views: number): number | null {
  for (const m of [...MILESTONES].reverse()) {
    if (views >= m) {
      const key = milestoneKey(videoId, m);
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, "1");
        return m;
      }
      break;
    }
  }
  return null;
}

export function formatMilestone(n: number): string {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000) return `${n / 1_000}K`;
  return `${n}`;
}
