import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Video, VideoView } from "../backend";
import { VideoCard } from "../components/VideoCard";
import { useApp } from "../context/AppContext";
import { useListVideos, useWatchHistory } from "../hooks/useQueries";
import { getWatchProgressPercent } from "../utils/recommendations";

const SKELETON_KEYS = ["sk0", "sk1", "sk2", "sk3", "sk4"];
const INITIAL_VISIBLE = 50;
const LOAD_MORE_STEP = 20;

const DAY = 24 * 60 * 60 * 1000;
const WEEK = 7 * DAY;

function getBucket(ts: bigint): "today" | "week" | "earlier" {
  const ms = Number(ts) / 1_000_000;
  const age = Date.now() - ms;
  if (age < DAY) return "today";
  if (age < WEEK) return "week";
  return "earlier";
}

const BUCKET_LABELS: Record<"today" | "week" | "earlier", string> = {
  today: "Today",
  week: "This Week",
  earlier: "Earlier",
};

interface HistoryItem {
  view: VideoView;
  video: Video;
}

export function HistoryPage() {
  const { setPage, setSelectedVideo } = useApp();
  const { data: history = [], isLoading: histLoading } = useWatchHistory();
  const { data: allVideos = [] } = useListVideos();
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const videoMap = new Map<string, Video>(allVideos.map((v) => [v.id, v]));

  // Deduplicate: keep most recent entry per videoId
  const dedupMap = new Map<string, VideoView>();
  for (const h of history) {
    const existing = dedupMap.get(h.videoId);
    if (!existing || h.timestamp > existing.timestamp) {
      dedupMap.set(h.videoId, h);
    }
  }

  const deduped = Array.from(dedupMap.values()).sort((a, b) =>
    Number(b.timestamp - a.timestamp),
  );

  const totalCount = deduped.length;
  const visibleDeduped = deduped.slice(0, visibleCount);

  const historyItems: HistoryItem[] = visibleDeduped
    .map((h) => ({ view: h, video: videoMap.get(h.videoId) }))
    .filter((item): item is HistoryItem => item.video !== undefined);

  // Bucket into time groups
  const buckets: Record<"today" | "week" | "earlier", HistoryItem[]> = {
    today: [],
    week: [],
    earlier: [],
  };
  for (const item of historyItems) {
    buckets[getBucket(item.view.timestamp)].push(item);
  }

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setPage("player");
  };

  const orderedBuckets = (["today", "week", "earlier"] as const).filter(
    (b) => buckets[b].length > 0,
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-y-auto pb-20"
    >
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-background border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          data-ocid="history.close_button"
          onClick={() => setPage("home")}
          className="p-1.5 rounded-full hover:bg-accent transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-base">Watch History</h1>
      </div>

      {/* Content */}
      {histLoading ? (
        <div data-ocid="history.loading_state" className="pt-4">
          <div className="px-3 mb-2">
            <Skeleton className="h-4 w-16 bg-surface2 rounded" />
          </div>
          <div className="flex gap-3 px-3 overflow-hidden">
            {SKELETON_KEYS.map((key) => (
              <div key={key} className="flex-shrink-0 w-44 space-y-2">
                <Skeleton className="w-full aspect-video rounded-lg bg-surface2" />
                <Skeleton className="h-3 w-full bg-surface2 rounded" />
                <Skeleton className="h-3 w-2/3 bg-surface2 rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : historyItems.length === 0 ? (
        <div
          data-ocid="history.empty_state"
          className="flex flex-col items-center justify-center py-16 text-center px-4"
        >
          <div className="w-16 h-16 rounded-full bg-surface2 flex items-center justify-center mb-4">
            <Clock size={28} className="text-muted-foreground/40" />
          </div>
          <p className="text-muted-foreground text-sm">No watch history yet</p>
          <p className="text-muted-foreground/60 text-xs mt-1">
            Videos you watch will appear here
          </p>
        </div>
      ) : (
        <div data-ocid="history.list" className="pt-4">
          {orderedBuckets.map((bucket) => (
            <section key={bucket} className="mb-6">
              <h2 className="text-sm font-semibold text-foreground px-3 mb-2">
                {BUCKET_LABELS[bucket]}
              </h2>
              {/* Horizontal scroll row */}
              <div
                className="flex gap-3 overflow-x-auto px-3 pb-2"
                style={{ scrollbarWidth: "none" }}
              >
                {buckets[bucket].map((item, i) => (
                  <div key={item.view.videoId} className="flex-shrink-0 w-44">
                    <VideoCard
                      video={item.video}
                      index={i + 1}
                      onClick={() => handleVideoClick(item.video)}
                      progress={getWatchProgressPercent(item.view.videoId)}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Load more */}
          {totalCount > visibleCount && (
            <div className="flex justify-center pb-4 px-3">
              <button
                type="button"
                data-ocid="history.secondary_button"
                onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
                className="px-5 py-2 rounded-full bg-surface2 hover:bg-accent/30 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border/40"
              >
                Load more ({totalCount - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
