import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bookmark, BookmarkCheck, Clock, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import type { Video } from "../backend";
import { isVideoInAnyPlaylist } from "../utils/playlists";
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

export function VideoCard({ video, index, onClick, progress }: VideoCardProps) {
  const thumbUrl = video.thumbnailBlob?.getDirectURL?.();
  const videoUrl = video.videoBlob?.getDirectURL?.();
  const isProcessing =
    video.status === "processing" || video.status === "uploading";
  const qualityLevel = video.qualityLevel || "";
  const duration = useDuration(videoUrl);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [inPlaylist, setInPlaylist] = useState(() =>
    isVideoInAnyPlaylist(video.id),
  );

  // Refresh inPlaylist when modal closes
  const handleModalClose = () => {
    setSaveModalOpen(false);
    setInPlaylist(isVideoInAnyPlaylist(video.id));
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
          onClick={onClick}
          aria-label={`Play ${video.title}`}
        >
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

        {duration !== null && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono pointer-events-none">
            {formatDuration(duration)}
          </div>
        )}
        {/* Processing overlay badge */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
            <span className="bg-black/80 text-white text-[10px] px-2 py-1 rounded-full font-medium animate-pulse">
              Processing...
            </span>
          </div>
        )}
        {/* Quality chip */}
        {!isProcessing && qualityLevel && (
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

        {/* Bookmark / Save button */}
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
          onClick={onClick}
        >
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug mb-1">
            {video.title}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {video.creatorName || "Unknown"}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Eye size={10} /> {formatViews(video.views)}
            </span>
            <span className="text-muted-foreground/50 text-[10px]">•</span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock size={10} /> {timeAgo(video.uploadTime)}
            </span>
          </div>
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
