import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Eye, MoreVertical } from "lucide-react";
import type { Video } from "../backend";

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

export function VideoCard({ video, index, onClick, progress }: VideoCardProps) {
  const thumbUrl = video.thumbnailBlobId?.getDirectURL?.();

  return (
    <div
      data-ocid={`video.item.${index}`}
      className="group animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Thumbnail - clickable area */}
      <button
        type="button"
        className="relative rounded-lg overflow-hidden aspect-video bg-surface2 mb-2 w-full block"
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
              <path d="M10 7L25 16L10 25V7Z" fill="oklch(0.68 0.18 35 / 0.5)" />
            </svg>
          </div>
        )}
        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
          --:--
        </div>
        {/* Progress bar */}
        {progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-orange-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </button>

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
        <button
          type="button"
          data-ocid={`video.edit_button.${index}`}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical size={14} />
        </button>
      </div>
    </div>
  );
}
