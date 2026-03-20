import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useEffect, useState } from "react";
import type { Video } from "../backend";
import { VideoCard } from "../components/VideoCard";
import { useApp } from "../context/AppContext";
import { useListVideos } from "../hooks/useQueries";

let debounceTimer: ReturnType<typeof setTimeout>;

type Tab = "recommended" | "subscriptions" | "new" | "trending";

interface HomePageProps {
  searchTerm: string;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "recommended", label: "RECOMMENDED" },
  { id: "subscriptions", label: "SUBSCRIPTIONS" },
  { id: "new", label: "NEW" },
  { id: "trending", label: "TRENDING" },
];

const SKELETON_KEYS = ["sk0", "sk1", "sk2", "sk3", "sk4", "sk5"];

export function HomePage({ searchTerm }: HomePageProps) {
  const {
    setPage,
    setSelectedVideo,
    justUploadedVideoId,
    setJustUploadedVideoId,
  } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("recommended");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

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

  const filterVideos = (vids: Video[]): Video[] => {
    if (activeTab === "new")
      return [...vids].sort((a, b) => Number(b.uploadTime - a.uploadTime));
    if (activeTab === "trending")
      return [...vids].sort((a, b) => Number(b.views - a.views));
    return vids;
  };

  const filtered = filterVideos(videos);

  return (
    <main className="flex-1 overflow-y-auto pb-20">
      {/* Category tabs */}
      <div className="sticky top-0 z-30 bg-background border-b border-border/40 px-3">
        <div className="flex gap-1 overflow-x-auto py-2">
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

      {/* Video grid */}
      <div className="px-3 pt-4">
        {isLoading ? (
          <div
            data-ocid="home.loading_state"
            className="grid grid-cols-2 gap-3"
          >
            {SKELETON_KEYS.map((key) => (
              <div key={key} className="space-y-2">
                <Skeleton className="aspect-video w-full rounded-lg bg-surface2" />
                <Skeleton className="h-3 w-4/5 bg-surface2" />
                <Skeleton className="h-3 w-3/5 bg-surface2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="home.empty_state"
            className="flex flex-col items-center justify-center py-16 text-center"
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
              {debouncedSearch
                ? `No videos found for "${debouncedSearch}"`
                : "No videos yet. Be the first to upload!"}
            </p>
          </div>
        ) : (
          <>
            {debouncedSearch && (
              <p className="text-xs text-muted-foreground mb-3">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for
                &ldquo;{debouncedSearch}&rdquo;
              </p>
            )}
            <div data-ocid="home.list" className="grid grid-cols-2 gap-3">
              {filtered.map((video, i) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={i + 1}
                  onClick={() => handleVideoClick(video)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
