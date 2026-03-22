import type { Video } from "../backend";
import { getScheduledVideos } from "./dateTimePrefs";

/**
 * Returns true if the video has a scheduled publish time in the future.
 */
export function isUpcoming(video: Video): boolean {
  if (video.status !== "scheduled") return false;
  const scheduled = getScheduledVideos();
  const entry = scheduled.find((s) => s.videoId === video.id);
  if (!entry) return false;
  return entry.publishTime > Date.now();
}

/**
 * Returns the publish time in ms for a video (from localStorage).
 */
export function getPublishTimeMs(video: Video): number | null {
  const scheduled = getScheduledVideos();
  const entry = scheduled.find((s) => s.videoId === video.id);
  return entry ? entry.publishTime : null;
}

/**
 * Returns countdown string: "Premieres in 2d 3h", "Premieres in 3h 20m", "Premieres in 45m", "Premieres in 30s"
 */
export function formatPremiereCountdown(publishTimeMs: number): string {
  const diff = publishTimeMs - Date.now();
  if (diff <= 0) return "Premiering now";

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0 && hours > 0) return `Premieres in ${days}d ${hours}h`;
  if (days > 0) return `Premieres in ${days}d`;
  if (hours > 0 && minutes > 0) return `Premieres in ${hours}h ${minutes}m`;
  if (hours > 0) return `Premieres in ${hours}h`;
  if (minutes > 0) return `Premieres in ${minutes}m`;
  return `Premieres in ${seconds}s`;
}

/**
 * Returns formatted publish date string: "March 25 at 12:00 AM"
 */
export function formatPremiereDate(publishTimeMs: number): string {
  const date = new Date(publishTimeMs);
  const datePart = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart} at ${timePart}`;
}

/**
 * Returns days label: "Premieres in 2 days", "Premieres tomorrow", "Premieres today"
 */
export function formatPremiereDaysLabel(publishTimeMs: number): string {
  const diff = publishTimeMs - Date.now();
  if (diff <= 0) return "Premiering now";

  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Premieres today";
  if (days === 1) return "Premieres tomorrow";
  return `Premieres in ${days} days`;
}
