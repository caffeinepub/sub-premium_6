import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bookmark, BookmarkCheck, Clock, Eye, Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Video } from "../backend";
import { useApp } from "../context/AppContext";
import { isVideoInAnyPlaylist } from "../utils/playlists";
import {
  formatPremiereCountdown,
  getPublishTimeMs,
  isUpcoming,
} from "../utils/premiereUtils";
import { AddToPlaylistModal } from "./AddToPlaylistModal";

interface VideoCardProps {
  video: Video;
  index: number;
  onClick: () => void;
  progress?: number; // 0-100, show progress bar on thumbnail
}

function formatViews(views: bigint): string {
  const n = Number(views);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

function timeAgo(uploadTime: bigint): string {
  const ms = Number(uploadTime) / 1_000_000;
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function useDuration(url: string | undefined): number | null {
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    if (!url) return;
    const videoEl = document.createElement("video");
    videoEl.preload = "metadata";
    videoEl.muted = true;

    const onLoaded = () => {
      const d = videoEl.duration;
      if (d && Number.isFinite(d)) {
        setDuration(d);
      } else {
        setDuration(null);
      }
      cleanup();
    };

    const onError = () => {
      setDuration(null);
      cleanup();
    };

    const cleanup = () => {
      videoEl.removeEventListener("loadedmetadata", onLoaded);
      videoEl.removeEventListener("error", onError);
      videoEl.src = "";
      videoEl.load();
    };

    videoEl.addEventListener("loadedmetadata", onLoaded);
    videoEl.addEventListener("error", onError);
    videoEl.src = url;

    return cleanup;
  }, [url]);

  return duration;
}

/** Live-updating countdown for premiere cards */
function usePremiereCountdown(publishTimeMs: number | null): string {
  const [countdown, setCountdown] = useState(() =>
    publishTimeMs ? formatPremiereCountdown(publishTimeMs) : "",
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!publishTimeMs) return;
    const tick = () => setCountdown(formatPremiereCountdown(publishTimeMs));
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [publishTimeMs]);

  return countdown;
}

export function VideoCard({ video, index, onClick, progress }: VideoCardProps) {
  const { setPage, setSelectedVideo } = useApp();
  const thumbUrl = video.thumbnailBlob?.getDirectURL?.();
  const videoUrl = video.videoBlob?.getDirectURL?.();
  const isProcessing =
    video.status === "processing" || video.status === "uploading";
  const isScheduled = video.status === "scheduled";
  const upcoming = isUpcoming(video);
  const publishTimeMs = upcoming ? getPublishTimeMs(video) : null;
  const qualityLevel = video.qualityLevel || "";
  const duration = useDuration(videoUrl);
  const premiereCountdown = usePremiereCountdown(publishTimeMs);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [inPlaylist, setInPlaylist] = useState(() =>
    isVideoInAnyPlaylist(video.id),
  );

  const handleModalClose = () => {
    setSaveModalOpen(false);
    setInPlaylist(isVideoInAnyPlaylist(video.id));
  };

  const handleClick = () => {
    if (upcoming) {
      setSelectedVideo(video);
      setPage("premiere-preview");
    } else {
      onClick();
    }
  };

  return (
    <div
      data-ocid={`video.item.${index}`}
      className="group animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Thumbnail - clickable area */}
      <div className="relative rounded-lg overflow-hidden aspect-video bg-surface2 mb-2 w-full">
        <button
          type="button"
          className="absolute inset-0 w-full h-full"
          onClick={handleClick}
          aria-label={
            upcoming
              ? `Upcoming premiere: ${video.title}`
              : `Play ${video.title}`
          }
        >
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt={video.title}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                upcoming ? "opacity-60" : "group-hover:scale-105"
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface2 to-accent/30">
              <svg
                aria-hidden="true"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  d="M10 7L25 16L10 25V7Z"
                  fill="oklch(0.68 0.18 35 / 0.5)"
                />
              </svg>
            </div>
          )}
        </button>

        {/* Duration overlay (always, unless upcoming hides it) */}
        {duration !== null && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono pointer-events-none">
            {formatDuration(duration)}
          </div>
        )}

        {/* ── UPCOMING overlay ── */}
        {upcoming && (
          <>
            {/* Semi-transparent dark overlay */}
            <div className="absolute inset-0 bg-black/50 pointer-events-none" />
            {/* UPCOMING badge top-left */}
            <div className="absolute top-1.5 left-1.5 pointer-events-none">
              <span className="px-2 py-0.5 rounded-full bg-orange text-white text-[9px] font-black uppercase tracking-widest">
                Upcoming
              </span>
            </div>
            {/* Lock icon center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-1">
              <div className="w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center">
                <Lock size={14} className="text-white/80" />
              </div>
              {premiereCountdown && (
                <span className="text-white text-[10px] font-semibold bg-black/70 px-2 py-0.5 rounded-full">
                  {premiereCountdown}
                </span>
              )}
            </div>
          </>
        )}

        {/* Processing overlay badge */}
        {isProcessing && !upcoming && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
            <span className="bg-black/80 text-white text-[10px] px-2 py-1 rounded-full font-medium animate-pulse">
              Processing...
            </span>
          </div>
        )}
        {/* Scheduled badge (non-upcoming, e.g. own video that's queued but publishTime not set) */}
        {isScheduled && !upcoming && (
          <div className="absolute top-1.5 left-1.5 bg-orange-500/90 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide pointer-events-none">
            Scheduled
          </div>
        )}
        {/* Quality chip */}
        {!isProcessing && !isScheduled && qualityLevel && (
          <div className="absolute bottom-1 left-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold pointer-events-none">
            {qualityLevel}
          </div>
        )}
        {/* Progress bar */}
        {progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 pointer-events-none">
            <div
              className="h-full bg-orange-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}

        {/* Bookmark / Save button (hide for upcoming) */}
        {!upcoming && (
          <button
            type="button"
            data-ocid={`video.edit_button.${index}`}
            onClick={(e) => {
              e.stopPropagation();
              setSaveModalOpen(true);
            }}
            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
            aria-label="Save to playlist"
          >
            {inPlaylist ? (
              <BookmarkCheck size={13} className="text-orange" />
            ) : (
              <Bookmark size={13} className="text-white" />
            )}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="flex gap-2">
        <Avatar className="w-7 h-7 flex-shrink-0 mt-0.5">
          <AvatarFallback className="bg-orange/20 text-orange text-[10px] font-bold">
            {(video.creatorName || "U").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <button
          type="button"
          className="flex-1 min-w-0 text-left"
          onClick={handleClick}
        >
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug mb-1">
            {video.title}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {video.creatorName || "Unknown"}
          </p>
          {upcoming ? (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[11px] font-semibold text-orange">
                {premiereCountdown}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Eye size={10} /> {formatViews(video.views)}
              </span>
              <span className="text-muted-foreground/50 text-[10px]">•</span>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock size={10} /> {timeAgo(video.uploadTime)}
              </span>
            </div>
          )}
        </button>
      </div>

      <AddToPlaylistModal
        videoId={video.id}
        open={saveModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
