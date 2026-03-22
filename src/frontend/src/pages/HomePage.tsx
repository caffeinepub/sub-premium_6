import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, ListVideo, Play, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Video } from "../backend";
import { AddToPlaylistModal } from "../components/AddToPlaylistModal";
import { VideoCard } from "../components/VideoCard";
import { useApp } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useListVideos } from "../hooks/useQueries";
import {
  type PlaylistPrivacy,
  createPlaylist,
  getPlaylists,
} from "../utils/playlists";
import {
  getContinueWatchingCount,
  getContinueWatchingVideoIds,
  getRecommendedVideoIds,
  getWatchProgressPercent,
} from "../utils/recommendations";
import { getSubscriptions } from "../utils/subscriptions";

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

const NOW_MS = Date.now();
const HOURS_48 = 48 * 60 * 60 * 1000;

function isNewUpload(uploadTime: bigint): boolean {
  const ms = Number(uploadTime) / 1_000_000;
  return NOW_MS - ms < HOURS_48;
}

// ── Section: horizontal scroll row ──────────────────────────────────────────
function HorizontalRow({
  title,
  videos,
  onVideoClick,
  showProgress,
  onViewMore,
}: {
  title: string;
  videos: Video[];
  onVideoClick: (v: Video) => void;
  showProgress?: boolean;
  onViewMore?: () => void;
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
        {onViewMore && (
          <button
            type="button"
            onClick={onViewMore}
            data-ocid="home.history.button"
            className="flex-shrink-0 w-20 h-full min-h-[120px] flex flex-col items-center justify-center gap-1 text-orange text-xs font-semibold bg-surface2/60 rounded-xl border border-border/30"
          >
            <span className="text-lg">⋯</span>
            <span>View more</span>
          </button>
        )}
      </div>
    </section>
  );
}

// ── Section: 2-col grid ───────────────────────────────────────────────────────
function GridSection({
  title,
  videos,
  onVideoClick,
  showNewBadge,
}: {
  title: string;
  videos: Video[];
  onVideoClick: (v: Video) => void;
  showNewBadge?: boolean;
}) {
  if (videos.length === 0) return null;
  return (
    <section className="mb-5 px-3">
      <h2 className="text-sm font-semibold text-foreground mb-3">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {videos.map((video, i) => (
          <div key={video.id} className="relative">
            {showNewBadge && isNewUpload(video.uploadTime) && (
              <span className="absolute top-1 left-1 z-10 bg-orange text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                NEW
              </span>
            )}
            <VideoCard
              video={video}
              index={i + 1}
              onClick={() => onVideoClick(video)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Playlists Row ─────────────────────────────────────────────────────────────
function PlaylistsRow() {
  const { setPage, setSelectedPlaylistId } = useApp();
  const [playlists, setPlaylists] = useState(() => getPlaylists());
  const { data: allVideos = [] } = useListVideos();
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrivacy, setNewPrivacy] = useState<PlaylistPrivacy>("public");
  // For AddToPlaylistModal (create-only mode reuse: just open empty)
  const [addModalVideoId, setAddModalVideoId] = useState<string | null>(null);

  const videoMap = new Map(allVideos.map((v) => [v.id, v]));
  const preview = playlists.slice(0, 10);
  const hasMore = playlists.length > 10;

  const handleCreatePlaylist = () => {
    if (!newTitle.trim()) return;
    createPlaylist(newTitle.trim(), newPrivacy);
    setPlaylists(getPlaylists());
    setNewTitle("");
    setNewPrivacy("public");
    setCreateOpen(false);
  };

  return (
    <section className="mb-5">
      <div className="flex items-center justify-between px-3 mb-2">
        <div className="flex items-center gap-1.5">
          <ListVideo size={14} className="text-orange" />
          <h2 className="text-sm font-semibold text-foreground">Playlists</h2>
        </div>
        {hasMore && (
          <button
            type="button"
            data-ocid="home.primary_button"
            onClick={() => setPage("menu")}
            className="text-xs text-orange font-medium hover:text-orange/80 transition-colors"
          >
            View all
          </button>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto px-3 pb-2 no-scrollbar">
        {preview.map((pl, i) => {
          const firstVideoId = pl.videoIds[0];
          const firstVideo = firstVideoId ? videoMap.get(firstVideoId) : null;
          const thumbUrl = firstVideo?.thumbnailBlob?.getDirectURL?.();
          return (
            <button
              key={pl.id}
              type="button"
              data-ocid={`home.item.${i + 1}`}
              onClick={() => {
                setSelectedPlaylistId(pl.id);
                setPage("playlist");
              }}
              className="flex-shrink-0 w-32 text-left group"
            >
              {/* Thumbnail */}
              <div className="relative w-32 h-20 rounded-xl overflow-hidden bg-surface2 mb-1.5">
                {thumbUrl ? (
                  <img
                    src={thumbUrl}
                    alt={pl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-surface2 to-orange/15 flex items-center justify-center">
                    <Play size={18} className="text-orange/40" />
                  </div>
                )}
                {/* Count overlay */}
                <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                  {pl.videoIds.length} video
                  {pl.videoIds.length !== 1 ? "s" : ""}
                </div>
              </div>
              <p className="text-xs font-medium text-foreground truncate leading-snug">
                {pl.title}
              </p>
            </button>
          );
        })}

        {/* Create new playlist button */}
        <button
          type="button"
          data-ocid="home.open_modal_button"
          onClick={() => setCreateOpen(true)}
          className="flex-shrink-0 w-32 flex flex-col items-center justify-center gap-2 h-20 rounded-xl border-2 border-dashed border-border/40 hover:border-orange/40 transition-colors text-muted-foreground hover:text-orange"
        >
          <Plus size={20} />
          <span className="text-[10px] font-medium">New playlist</span>
        </button>

        {hasMore && (
          <button
            type="button"
            onClick={() => setPage("menu")}
            data-ocid="home.secondary_button"
            className="flex-shrink-0 w-20 h-20 flex flex-col items-center justify-center gap-1 text-orange text-xs font-semibold bg-surface2/60 rounded-xl border border-border/30"
          >
            <span className="text-lg">⋯</span>
            <span>View more</span>
          </button>
        )}
      </div>

      {/* Inline create modal */}
      {createOpen && (
        <>
          <button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-50 bg-black/60 w-full h-full cursor-default"
            onClick={() => setCreateOpen(false)}
          />
          <div
            data-ocid="home.modal"
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] rounded-t-2xl px-4 py-5 max-w-[430px] mx-auto border-t border-white/10"
          >
            <p className="text-sm font-semibold text-white mb-4">
              Create Playlist
            </p>
            <Input
              data-ocid="home.input"
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreatePlaylist()}
              placeholder="Playlist name..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-orange h-9 text-sm mb-3"
            />
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-white/50">Privacy:</span>
              <button
                type="button"
                data-ocid="home.toggle"
                onClick={() => setNewPrivacy("public")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  newPrivacy === "public"
                    ? "bg-orange text-white"
                    : "bg-white/10 text-white/60 hover:bg-white/15"
                }`}
              >
                Public
              </button>
              <button
                type="button"
                data-ocid="home.toggle"
                onClick={() => setNewPrivacy("private")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  newPrivacy === "private"
                    ? "bg-orange text-white"
                    : "bg-white/10 text-white/60 hover:bg-white/15"
                }`}
              >
                Private
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                data-ocid="home.cancel_button"
                onClick={() => {
                  setCreateOpen(false);
                  setNewTitle("");
                }}
                className="flex-1 py-2 rounded-xl bg-white/10 text-white/70 text-sm font-medium hover:bg-white/15 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="home.confirm_button"
                onClick={handleCreatePlaylist}
                disabled={!newTitle.trim()}
                className="flex-1 py-2 rounded-xl bg-orange text-white text-sm font-semibold disabled:opacity-40 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </>
      )}

      {addModalVideoId && (
        <AddToPlaylistModal
          videoId={addModalVideoId}
          open
          onClose={() => setAddModalVideoId(null)}
        />
      )}
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
  const { identity } = useInternetIdentity();
  const [activeTab, setActiveTab] = useState<Tab>("forYou");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [recTick, setRecTick] = useState(0);
  const tickRef = useRef(recTick);
  tickRef.current = recTick;

  useEffect(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    const onFocus = () => setRecTick((t) => t + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const { data: videos = [], isLoading } = useListVideos(
    debouncedSearch || undefined,
  );

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

  const videoMap = new Map(videos.map((v) => [v.id, v]));

  const continueWatchingIds = getContinueWatchingVideoIds(10);
  const continueWatchingVideos = continueWatchingIds
    .map((id) => videoMap.get(id))
    .filter((v): v is Video => !!v);

  const totalContinueWatching = getContinueWatchingCount();

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

  // Subscriptions tab
  const subscriptions = getSubscriptions();
  const subscribedVideos = videos.filter((v) =>
    subscriptions.includes(v.creatorId),
  );

  // Your Videos (user uploads)
  const userPrincipal = identity?.getPrincipal().toString();
  const yourVideos = userPrincipal
    ? videos.filter((v) => v.creatorId === userPrincipal).slice(0, 5)
    : [];

  // Liked Videos
  const likedVideoIds: string[] = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("sub_liked_videos") ?? "[]",
      ) as string[];
    } catch {
      return [];
    }
  })();
  const likedVideos = likedVideoIds
    .map((id) => videoMap.get(id))
    .filter((v): v is Video => !!v)
    .slice(0, 5);

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
          <div data-ocid="home.list">
            {/* 1. Continue Watching */}
            {continueWatchingVideos.length > 0 && (
              <HorizontalRow
                title="Continue Watching"
                videos={continueWatchingVideos}
                onVideoClick={handleVideoClick}
                showProgress
                onViewMore={
                  totalContinueWatching > 10
                    ? () => setPage("history")
                    : undefined
                }
              />
            )}

            {/* 2. Playlists */}
            <PlaylistsRow />

            {/* 3. Your Videos */}
            {yourVideos.length > 0 && (
              <section className="mb-5">
                <div className="flex items-center justify-between px-3 mb-2">
                  <h2 className="text-sm font-semibold text-foreground">
                    Your Videos
                  </h2>
                  <button
                    type="button"
                    data-ocid="home.secondary_button"
                    onClick={() => setPage("menu")}
                    className="text-xs text-orange font-medium hover:text-orange/80 transition-colors"
                  >
                    View all
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto px-3 pb-2 no-scrollbar">
                  {yourVideos.map((video, i) => (
                    <div key={video.id} className="flex-shrink-0 w-44">
                      <VideoCard
                        video={video}
                        index={i + 1}
                        onClick={() => handleVideoClick(video)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Liked Videos */}
            {likedVideos.length > 0 && (
              <HorizontalRow
                title="Liked Videos"
                videos={likedVideos}
                onVideoClick={handleVideoClick}
              />
            )}

            {/* 5. Recommended */}
            <GridSection
              title="Recommended for You"
              videos={recommendedVideos}
              onVideoClick={handleVideoClick}
            />

            {/* 6. Trending Now */}
            <HorizontalRow
              title="Trending Now"
              videos={trendingVideos}
              onVideoClick={handleVideoClick}
            />

            {/* 7. Discover New */}
            {discoverVideos.length > 0 && (
              <GridSection
                title="Discover New"
                videos={discoverVideos}
                onVideoClick={handleVideoClick}
              />
            )}
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
          // ── SUBSCRIPTIONS ───────────────────────────────────────────────
          <div className="px-3">
            {subscriptions.length === 0 ? (
              <div
                data-ocid="home.empty_state"
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <Bell className="w-10 h-10 text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground text-sm font-medium">
                  Subscribe to creators
                </p>
                <p className="text-muted-foreground/60 text-xs mt-1">
                  Their videos will appear here
                </p>
              </div>
            ) : subscribedVideos.length === 0 ? (
              <div
                data-ocid="home.empty_state"
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <p className="text-muted-foreground text-sm">
                  No new videos from your subscriptions
                </p>
              </div>
            ) : (
              <GridSection
                title="From Subscriptions"
                videos={subscribedVideos}
                onVideoClick={handleVideoClick}
                showNewBadge
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
