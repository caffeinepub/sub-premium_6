import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Video } from "../backend";
import { VideoCard } from "../components/VideoCard";
import { useApp } from "../context/AppContext";
import { useListVideos } from "../hooks/useQueries";
import {
  getContinueWatchingVideoIds,
  getRecommendedVideoIds,
  getWatchProgressPercent,
} from "../utils/recommendations";

let debounceTimer: ReturnType<typeof setTimeout>;

type Tab = "forYou" | "trending" | "new" | "subscriptions";

interface HomePageProps {
  searchTerm: string;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "forYou", label: "FOR YOU" },
  { id: "trending", label: "TRENDING" },
  { id: "new", label: "NEW" },
  { id: "subscriptions", label: "SUBSCRIPTIONS" },
];

const SKELETON_KEYS = ["sk0", "sk1", "sk2", "sk3", "sk4", "sk5"];

// ── Section: horizontal scroll row ──────────────────────────────────────────
function HorizontalRow({
  title,
  videos,
  onVideoClick,
  showProgress,
}: {
  title: string;
  videos: Video[];
  onVideoClick: (v: Video) => void;
  showProgress?: boolean;
}) {
  if (videos.length === 0) return null;
  return (
    <section className="mb-5">
      <h2 className="text-sm font-semibold text-foreground px-3 mb-2">
        {title}
      </h2>
      <div className="flex gap-3 overflow-x-auto px-3 pb-2 no-scrollbar">
        {videos.map((video, i) => {
          const pct = showProgress
            ? getWatchProgressPercent(video.id)
            : undefined;
          return (
            <div key={video.id} className="flex-shrink-0 w-44">
              <VideoCard
                video={video}
                index={i + 1}
                onClick={() => onVideoClick(video)}
                progress={pct}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Section: 2-col grid ───────────────────────────────────────────────────────
function GridSection({
  title,
  videos,
  onVideoClick,
}: {
  title: string;
  videos: Video[];
  onVideoClick: (v: Video) => void;
}) {
  if (videos.length === 0) return null;
  return (
    <section className="mb-5 px-3">
      <h2 className="text-sm font-semibold text-foreground mb-3">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {videos.map((video, i) => (
          <VideoCard
            key={video.id}
            video={video}
            index={i + 1}
            onClick={() => onVideoClick(video)}
          />
        ))}
      </div>
    </section>
  );
}

export function HomePage({ searchTerm }: HomePageProps) {
  const {
    setPage,
    setSelectedVideo,
    justUploadedVideoId,
    setJustUploadedVideoId,
  } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("forYou");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // Re-render trigger for localStorage-based recommendations
  const [recTick, setRecTick] = useState(0);
  const tickRef = useRef(recTick);
  tickRef.current = recTick;

  useEffect(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Refresh recommendations when page becomes visible
  useEffect(() => {
    const onFocus = () => setRecTick((t) => t + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const { data: videos = [], isLoading } = useListVideos(
    debouncedSearch || undefined,
  );

  // Auto-navigate to just-uploaded video when it appears in the list
  useEffect(() => {
    if (!justUploadedVideoId || videos.length === 0) return;
    const found = videos.find((v) => v.id === justUploadedVideoId);
    if (found) {
      setJustUploadedVideoId(null);
      setSelectedVideo(found);
      setPage("player");
    }
  }, [
    videos,
    justUploadedVideoId,
    setJustUploadedVideoId,
    setSelectedVideo,
    setPage,
  ]);

  const handleVideoClick = useCallback(
    (video: Video) => {
      setSelectedVideo(video);
      setPage("player");
    },
    [setSelectedVideo, setPage],
  );

  // ── Build sections (only when not searching) ─────────────────────────────
  const videoMap = new Map(videos.map((v) => [v.id, v]));

  const continueWatchingIds = getContinueWatchingVideoIds(10);
  const continueWatchingVideos = continueWatchingIds
    .map((id) => videoMap.get(id))
    .filter((v): v is Video => !!v);

  const recommendedIds = getRecommendedVideoIds(
    videos.map((v) => ({ id: v.id, creatorId: v.creatorId })),
    6,
  );
  const recommendedVideos = recommendedIds
    .map((id) => videoMap.get(id))
    .filter((v): v is Video => !!v);

  const trendingVideos = [...videos]
    .sort((a, b) => Number(b.views - a.views))
    .slice(0, 4);

  // "Discover New" = videos not interacted with much
  const discoverVideos = videos
    .filter(
      (v) =>
        !continueWatchingIds.includes(v.id) &&
        !recommendedIds.slice(0, 4).includes(v.id),
    )
    .slice(0, 4);

  const newVideos = [...videos].sort((a, b) =>
    Number(b.uploadTime - a.uploadTime),
  );

  return (
    <main className="flex-1 overflow-y-auto pb-20">
      {/* Category tabs */}
      <div className="sticky top-0 z-30 bg-background border-b border-border/40 px-3">
        <div className="flex gap-1 overflow-x-auto py-2 no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-ocid={`home.${tab.id}.tab`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-3 py-1.5 text-[11px] font-semibold tracking-wider transition-colors rounded-sm ${
                activeTab === tab.id
                  ? "text-orange border-b-2 border-orange"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        {isLoading ? (
          <div
            data-ocid="home.loading_state"
            className="grid grid-cols-2 gap-3 px-3"
          >
            {SKELETON_KEYS.map((key) => (
              <div key={key} className="space-y-2">
                <Skeleton className="aspect-video w-full rounded-lg bg-surface2" />
                <Skeleton className="h-3 w-4/5 bg-surface2" />
                <Skeleton className="h-3 w-3/5 bg-surface2" />
              </div>
            ))}
          </div>
        ) : debouncedSearch ? (
          // ── Search results ──────────────────────────────────────────────
          <div className="px-3">
            <p className="text-xs text-muted-foreground mb-3">
              {videos.length} result{videos.length !== 1 ? "s" : ""} for &ldquo;
              {debouncedSearch}&rdquo;
            </p>
            {videos.length === 0 ? (
              <div
                data-ocid="home.empty_state"
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <p className="text-muted-foreground text-sm">
                  No videos found for &ldquo;{debouncedSearch}&rdquo;
                </p>
              </div>
            ) : (
              <div data-ocid="home.list" className="grid grid-cols-2 gap-3">
                {videos.map((video, i) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    index={i + 1}
                    onClick={() => handleVideoClick(video)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : videos.length === 0 ? (
          <div
            data-ocid="home.empty_state"
            className="flex flex-col items-center justify-center py-16 text-center px-6"
          >
            <div className="w-16 h-16 rounded-full bg-surface2 flex items-center justify-center mb-4">
              <svg
                aria-hidden="true"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
              >
                <path d="M7 5L22 14L7 23V5Z" fill="oklch(0.68 0.18 35 / 0.3)" />
              </svg>
            </div>
            <p className="text-muted-foreground text-sm">
              No videos yet. Be the first to upload!
            </p>
          </div>
        ) : activeTab === "forYou" ? (
          // ── FOR YOU: Sectioned feed ──────────────────────────────────────
          <div data-ocid="home.list">
            {continueWatchingVideos.length > 0 && (
              <HorizontalRow
                title="Continue Watching"
                videos={continueWatchingVideos}
                onVideoClick={handleVideoClick}
                showProgress
              />
            )}
            <GridSection
              title="Recommended for You"
              videos={recommendedVideos}
              onVideoClick={handleVideoClick}
            />
            <HorizontalRow
              title="Trending Now"
              videos={trendingVideos}
              onVideoClick={handleVideoClick}
            />
            {discoverVideos.length > 0 && (
              <GridSection
                title="Discover New"
                videos={discoverVideos}
                onVideoClick={handleVideoClick}
              />
            )}
            {/* Fallback: show all if sections are thin */}
            {recommendedVideos.length === 0 && trendingVideos.length === 0 && (
              <div className="grid grid-cols-2 gap-3 px-3">
                {videos.map((video, i) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    index={i + 1}
                    onClick={() => handleVideoClick(video)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "trending" ? (
          // ── TRENDING ────────────────────────────────────────────────────
          <div data-ocid="home.list" className="grid grid-cols-2 gap-3 px-3">
            {[...videos]
              .sort((a, b) => Number(b.views - a.views))
              .map((video, i) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={i + 1}
                  onClick={() => handleVideoClick(video)}
                />
              ))}
          </div>
        ) : activeTab === "new" ? (
          // ── NEW ─────────────────────────────────────────────────────────
          <div data-ocid="home.list" className="grid grid-cols-2 gap-3 px-3">
            {newVideos.map((video, i) => (
              <VideoCard
                key={video.id}
                video={video}
                index={i + 1}
                onClick={() => handleVideoClick(video)}
              />
            ))}
          </div>
        ) : (
          // ── SUBSCRIPTIONS (all videos) ──────────────────────────────────
          <div className="px-3">
            <p className="text-xs text-muted-foreground mb-3 px-0">
              All Videos
            </p>
            <div data-ocid="home.list" className="grid grid-cols-2 gap-3">
              {videos.map((video, i) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={i + 1}
                  onClick={() => handleVideoClick(video)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
