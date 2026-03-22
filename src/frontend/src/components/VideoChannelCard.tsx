import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, RefreshCw, Share2, Trash2 } from "lucide-react";
import type { Video } from "../backend";

export function formatDuration(seconds: number): string {
  if (!seconds || !Number.isFinite(seconds) || seconds <= 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface VideoChannelCardProps {
  video: Video;
  index: number;
  onEdit: (video: Video) => void;
  onDelete: (video: Video) => void;
  onReupload: (video: Video) => void;
  onClick: (video: Video) => void;
  duration?: number | null;
}

export function VideoChannelCard({
  video,
  index,
  onEdit,
  onDelete,
  onReupload,
  onClick,
  duration,
}: VideoChannelCardProps) {
  const thumbUrl = video.thumbnailBlob?.getDirectURL?.();
  const isProcessing =
    video.status === "processing" || video.status === "uploading";

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: video.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div
      data-ocid={`channel.item.${index}`}
      className="rounded-xl overflow-hidden bg-[#1a1a1a] cursor-pointer group"
    >
      {/* Thumbnail - clickable area */}
      <div className="relative aspect-video overflow-hidden">
        <button
          type="button"
          className="absolute inset-0 w-full h-full"
          onClick={() => onClick(video)}
          aria-label={`Play ${video.title}`}
        >
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-orange/20 flex items-center justify-center">
              <svg
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M6 4L20 12L6 20V4Z" fill="oklch(0.68 0.18 35 / 0.5)" />
              </svg>
            </div>
          )}
        </button>

        {/* Duration pill */}
        {duration != null && duration > 0 && (
          <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded pointer-events-none">
            {formatDuration(duration)}
          </div>
        )}

        {/* Processing overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
            <span className="bg-black/80 text-white text-[10px] px-2 py-1 rounded-full font-medium animate-pulse">
              Processing...
            </span>
          </div>
        )}

        {/* 3-dot menu */}
        <div className="absolute top-1.5 right-1.5 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                data-ocid={`channel.dropdown_menu.${index}`}
                className="p-1 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                aria-label="Video options"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical size={14} className="text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 bg-[#1a1a1a] border-border/40"
            >
              <DropdownMenuItem
                data-ocid={`channel.edit_button.${index}`}
                onClick={() => onEdit(video)}
                className="gap-2 text-sm cursor-pointer"
              >
                <Pencil size={13} />
                Edit video
              </DropdownMenuItem>
              <DropdownMenuItem
                data-ocid={`channel.delete_button.${index}`}
                onClick={() => onDelete(video)}
                className="gap-2 text-sm cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 size={13} />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                data-ocid={`channel.secondary_button.${index}`}
                onClick={() => onReupload(video)}
                className="gap-2 text-sm cursor-pointer"
              >
                <RefreshCw size={13} />
                Re-upload
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleShare}
                className="gap-2 text-sm cursor-pointer"
              >
                <Share2 size={13} />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Title */}
      <div className="px-2 py-2">
        <p className="text-[13px] font-medium line-clamp-2 text-white/90 leading-snug">
          {video.title}
        </p>
      </div>
    </div>
  );
}
