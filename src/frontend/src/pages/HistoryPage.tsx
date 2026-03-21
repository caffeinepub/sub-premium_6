import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Play } from "lucide-react";
import { motion } from "motion/react";
import type { Video } from "../backend";
import { useApp } from "../context/AppContext";
import { useListVideos, useWatchHistory } from "../hooks/useQueries";

const SKELETON_KEYS = ["sk0", "sk1", "sk2", "sk3", "sk4"];

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryPage() {
  const { setPage, setSelectedVideo } = useApp();
  const { data: history = [], isLoading: histLoading } = useWatchHistory();
  const { data: allVideos = [] } = useListVideos();

  const videoMap = new Map<string, Video>(allVideos.map((v) => [v.id, v]));

  const historyItems = history
    .map((h) => ({ view: h, video: videoMap.get(h.videoId) }))
    .filter((item) => item.video !== undefined)
    .slice(0, 50);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setPage("player");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-y-auto pb-20"
    >
      <div className="sticky top-0 z-30 bg-background border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          data-ocid="history.close_button"
          onClick={() => setPage("home")}
          className="p-1.5 rounded-full hover:bg-accent transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-base">Watch History</h1>
      </div>

      <div className="px-4 py-4">
        {histLoading ? (
          <div data-ocid="history.loading_state" className="space-y-3">
            {SKELETON_KEYS.map((key) => (
              <div key={key} className="flex gap-3">
                <Skeleton className="w-28 h-16 rounded-lg bg-surface2 flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <Skeleton className="h-3 w-full bg-surface2" />
                  <Skeleton className="h-3 w-2/3 bg-surface2" />
                </div>
              </div>
            ))}
          </div>
        ) : historyItems.length === 0 ? (
          <div
            data-ocid="history.empty_state"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-surface2 flex items-center justify-center mb-4">
              <Clock size={28} className="text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground text-sm">
              No watch history yet
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              Videos you watch will appear here
            </p>
          </div>
        ) : (
          <div data-ocid="history.list" className="space-y-3">
            {historyItems.map(({ view, video }, i) => (
              <button
                key={view.videoId}
                type="button"
                data-ocid={`history.item.${i + 1}`}
                className="w-full flex gap-3 cursor-pointer group text-left"
                onClick={() => video && handleVideoClick(video)}
              >
                {/* Thumb */}
                <div className="relative w-28 h-16 rounded-lg overflow-hidden bg-surface2 flex-shrink-0">
                  {video?.thumbnailBlob?.getDirectURL?.() ? (
                    <img
                      src={video.thumbnailBlob.getDirectURL()}
                      alt={video?.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play size={16} className="text-orange/40" />
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold line-clamp-2 leading-snug group-hover:text-orange transition-colors">
                    {video?.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Avatar className="w-4 h-4">
                      <AvatarFallback className="text-[8px] bg-orange/20 text-orange">
                        {(video?.creatorName || "U").slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {video?.creatorName}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground/70 mt-0.5 flex items-center gap-1">
                    <Clock size={9} />
                    {formatDate(view.timestamp)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
