import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Infinity as InfinityIcon,
  ListVideo,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CreatorTier } from "../backend";
import type { Video } from "../backend";
import { DeleteVideoDialog } from "../components/DeleteVideoDialog";
import { EditVideoSheet } from "../components/EditVideoSheet";
import { ReuploadSheet } from "../components/ReuploadSheet";
import { VideoChannelCard } from "../components/VideoChannelCard";
import { useApp } from "../context/AppContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useIsSubscribed,
  useListVideos,
  usePublicProfile,
  useSubscribe,
  useSubscriberCount,
  useUnsubscribe,
  useUserProfile,
  useVideosByCreator,
} from "../hooks/useQueries";
import type { Playlist } from "../utils/playlists";
import { getPlaylists } from "../utils/playlists";

// Cache video durations to avoid re-fetching
const durationCache = new Map<string, number | null>();

function useVideoDurations(videos: Video[]): Map<string, number | null> {
  const [durations, setDurations] = useState<Map<string, number | null>>(
    new Map(),
  );
  const loadingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (videos.length === 0) return;
    let cancelled = false;
    const toLoad = videos.filter((v) => {
      const url = v.videoBlob?.getDirectURL?.();
      return url && !durationCache.has(v.id) && !loadingRef.current.has(v.id);
    });

    for (const video of toLoad) {
      const url = video.videoBlob?.getDirectURL?.();
      if (!url) continue;
      loadingRef.current.add(video.id);
      const el = document.createElement("video");
      el.preload = "metadata";
      el.muted = true;
      el.onloadedmetadata = () => {
        const d = Number.isFinite(el.duration) ? el.duration : null;
        durationCache.set(video.id, d);
        loadingRef.current.delete(video.id);
        el.src = "";
        if (!cancelled) setDurations(new Map(durationCache));
      };
      el.onerror = () => {
        durationCache.set(video.id, null);
        loadingRef.current.delete(video.id);
        el.src = "";
        if (!cancelled) setDurations(new Map(durationCache));
      };
      el.src = url;
    }

    return () => {
      cancelled = true;
    };
  }, [videos]);

  return durations;
}

function formatSubscriberCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return `${count}`;
}

// ── Own Channel ──────────────────────────────────────────────────────────────
function OwnChannelView() {
  const { setPage, setSelectedVideo } = useApp();
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: allVideos = [] } = useListVideos();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const myPrincipal = identity?.getPrincipal().toString() ?? null;
  const { data: subCount = 0 } = useSubscriberCount(myPrincipal);

  // Edit / Delete / Reupload state
  const [editVideo, setEditVideo] = useState<Video | null>(null);
  const [deleteVideo, setDeleteVideo] = useState<Video | null>(null);
  const [reuploadVideo, setReuploadVideo] = useState<Video | null>(null);

  useEffect(() => {
    setPlaylists(
      getPlaylists().filter(
        (p) => p.videoIds.length > 0 || p.id === "watch_later",
      ),
    );
  }, []);

  const myVideos = allVideos
    .filter((v) => v.creatorId === identity?.getPrincipal().toString())
    .sort((a, b) => Number(b.uploadTime - a.uploadTime));

  const durations = useVideoDurations(myVideos);

  const { data: creatorStats } = useQuery({
    queryKey: ["creatorStats"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCreatorStats();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !!identity,
    staleTime: 60_000,
  });

  const displayName = profile?.displayName || "Your Name";
  const username = profile?.username || "username";
  const avatarSrc = profile?.avatarBlobId || "";
  const avatarInitials = displayName.slice(0, 2).toUpperCase() || "SP";

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setPage("player");
  };

  // Playlist thumbnails — first video thumbnail or gradient
  const videoMap = new Map(allVideos.map((v) => [v.id, v]));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-col pb-20 min-h-full"
    >
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-background border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          data-ocid="channel.close_button"
          onClick={() => setPage("menu")}
          className="p-1.5 rounded-full hover:bg-accent transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-base">My Channel</h1>
      </div>

      {/* Channel header */}
      <div className="px-4 pt-5 pb-4 flex flex-col items-center gap-3 bg-background">
        <Avatar className="w-20 h-20 border-2 border-orange">
          {avatarSrc && <AvatarImage src={avatarSrc} />}
          <AvatarFallback className="bg-surface2 text-xl font-bold text-orange">
            {avatarInitials}
          </AvatarFallback>
        </Avatar>

        {profileLoading ? (
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-4 w-28 rounded bg-surface2 animate-pulse" />
            <div className="h-3 w-20 rounded bg-surface2 animate-pulse" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-0.5 text-center">
            <p className="font-bold text-white text-lg leading-tight">
              {displayName}
            </p>
            <p className="text-sm text-muted-foreground">@{username}</p>

            {creatorStats?.tier === CreatorTier.verified && (
              <div className="flex items-center gap-1 mt-1">
                <BadgeCheck size={13} className="text-blue-400" />
                <span className="text-[11px] font-semibold text-blue-400">
                  Verified Creator
                </span>
              </div>
            )}
            {creatorStats?.tier === CreatorTier.active && (
              <div className="flex items-center gap-1 mt-1">
                <ShieldCheck size={13} className="text-orange" />
                <span className="text-[11px] font-semibold text-orange">
                  Active Creator
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="outline"
                className="border-orange/40 text-orange/80 text-[10px] px-2 py-0 h-5 gap-1"
              >
                <InfinityIcon size={10} />
                Unlimited uploads
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
              <Users size={13} />
              <span className="text-xs">
                {formatSubscriberCount(subCount)} subscriber
                {subCount !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Manage Channel button */}
            <button
              type="button"
              data-ocid="channel.secondary_button"
              onClick={() => setPage("menu")}
              className="mt-3 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border border-orange text-orange hover:bg-orange/10 transition-colors"
            >
              <Settings size={12} />
              Manage Channel
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="videos" className="flex-1">
        <TabsList
          data-ocid="channel.tab"
          className="w-full rounded-none bg-background border-b border-border/40 h-10 px-4 gap-0 justify-start"
        >
          <TabsTrigger
            value="videos"
            className="text-xs font-semibold px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-orange data-[state=active]:text-orange data-[state=active]:bg-transparent bg-transparent"
          >
            Videos ({myVideos.length})
          </TabsTrigger>
          <TabsTrigger
            value="playlists"
            className="text-xs font-semibold px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-orange data-[state=active]:text-orange data-[state=active]:bg-transparent bg-transparent"
          >
            Playlists ({playlists.length})
          </TabsTrigger>
        </TabsList>

        {/* Videos tab */}
        <TabsContent value="videos" className="mt-0">
          {myVideos.length === 0 ? (
            <div
              data-ocid="channel.empty_state"
              className="flex flex-col items-center gap-3 py-16 text-center px-4"
            >
              <div className="w-14 h-14 rounded-full bg-surface2 flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path d="M5 3L17 10L5 17V3Z" fill="oklch(0.68 0.18 35)" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                No videos uploaded yet
              </p>
            </div>
          ) : (
            <div
              data-ocid="channel.list"
              className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 px-3 pt-3"
            >
              {myVideos.map((video, i) => (
                <VideoChannelCard
                  key={video.id}
                  video={video}
                  index={i + 1}
                  duration={durations.get(video.id)}
                  onEdit={setEditVideo}
                  onDelete={setDeleteVideo}
                  onReupload={setReuploadVideo}
                  onClick={handleVideoClick}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Playlists tab */}
        <TabsContent value="playlists" className="mt-0">
          {playlists.length === 0 ? (
            <div
              data-ocid="channel.empty_state"
              className="flex flex-col items-center gap-3 py-16 text-center px-4"
            >
              <div className="w-14 h-14 rounded-full bg-surface2 flex items-center justify-center">
                <ListVideo size={22} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No playlists yet</p>
            </div>
          ) : (
            <div
              data-ocid="channel.list"
              className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 px-3 pt-3"
            >
              {playlists.map((playlist, i) => {
                const firstVideoId = playlist.videoIds[0];
                const firstVideo = firstVideoId
                  ? videoMap.get(firstVideoId)
                  : undefined;
                const thumbUrl = firstVideo?.thumbnailBlob?.getDirectURL?.();
                return (
                  <button
                    key={playlist.id}
                    type="button"
                    data-ocid={`channel.item.${i + 1}`}
                    className="rounded-xl overflow-hidden bg-[#1a1a1a] cursor-pointer text-left group"
                    onClick={() => setPage("menu")}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={playlist.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-orange/20 flex items-center justify-center">
                          <ListVideo size={24} className="text-orange/50" />
                        </div>
                      )}
                      <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                        {playlist.videoIds.length} video
                        {playlist.videoIds.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <div className="px-2 py-2">
                      <p className="text-[13px] font-medium line-clamp-2 text-white/90 leading-snug">
                        {playlist.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <EditVideoSheet
        video={editVideo}
        open={!!editVideo}
        onClose={() => setEditVideo(null)}
      />
      <DeleteVideoDialog
        video={deleteVideo}
        open={!!deleteVideo}
        onClose={() => setDeleteVideo(null)}
      />
      <ReuploadSheet
        video={reuploadVideo}
        open={!!reuploadVideo}
        onClose={() => setReuploadVideo(null)}
      />
    </motion.div>
  );
}

// ── Public Channel View ───────────────────────────────────────────────────────
function PublicChannelView({ creatorId }: { creatorId: string }) {
  const { setPage, setSelectedVideo, setChannelCreatorId, setLoginModalOpen } =
    useApp();
  const { identity } = useInternetIdentity();
  const myPrincipal = identity?.getPrincipal().toString() ?? null;
  const isOwn = myPrincipal === creatorId;

  const { data: profile, isLoading: profileLoading } =
    usePublicProfile(creatorId);
  const { data: videos = [], isLoading: videosLoading } =
    useVideosByCreator(creatorId);
  const { data: subCountRaw = 0 } = useSubscriberCount(creatorId);
  const { data: subscribedRaw = false } = useIsSubscribed(creatorId);
  const subscribeMut = useSubscribe();
  const unsubscribeMut = useUnsubscribe();

  // Optimistic state
  const [optimisticSubscribed, setOptimisticSubscribed] = useState<
    boolean | null
  >(null);
  const [optimisticCount, setOptimisticCount] = useState<number | null>(null);

  const subscribed =
    optimisticSubscribed !== null ? optimisticSubscribed : subscribedRaw;
  const subCount = optimisticCount !== null ? optimisticCount : subCountRaw;

  const durations = useVideoDurations(videos);

  const displayName = profile?.displayName || "Creator";
  const username = profile?.username || "unknown";
  const avatarSrc = profile?.avatarBlobId || "";
  const avatarInitials = displayName.slice(0, 2).toUpperCase() || "SP";

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setPage("player");
  };

  const handleSubscribeToggle = () => {
    if (!identity) {
      setLoginModalOpen(true);
      return;
    }
    if (subscribed) {
      setOptimisticSubscribed(false);
      setOptimisticCount(Math.max(0, subCount - 1));
      unsubscribeMut.mutate(creatorId, {
        onError: () => {
          setOptimisticSubscribed(null);
          setOptimisticCount(null);
        },
      });
      toast(`Unsubscribed from ${displayName}`);
    } else {
      setOptimisticSubscribed(true);
      setOptimisticCount(subCount + 1);
      subscribeMut.mutate(creatorId, {
        onError: () => {
          setOptimisticSubscribed(null);
          setOptimisticCount(null);
        },
      });
      toast.success(`Subscribed to ${displayName}`);
    }
  };

  const handleManageChannel = () => {
    setChannelCreatorId(null);
    setPage("channel");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-col pb-20 min-h-full"
    >
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-background border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          data-ocid="channel.close_button"
          onClick={() => {
            setChannelCreatorId(null);
            setPage("home");
          }}
          className="p-1.5 rounded-full hover:bg-accent transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-base line-clamp-1">
          {profileLoading ? "Channel" : displayName}
        </h1>
      </div>

      {/* Channel header */}
      <div className="px-4 pt-5 pb-4 flex flex-col items-center gap-3 bg-background">
        <Avatar className="w-20 h-20 border-2 border-orange">
          {avatarSrc && <AvatarImage src={avatarSrc} />}
          <AvatarFallback className="bg-surface2 text-xl font-bold text-orange">
            {avatarInitials}
          </AvatarFallback>
        </Avatar>

        {profileLoading ? (
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-4 w-28 rounded bg-surface2 animate-pulse" />
            <div className="h-3 w-20 rounded bg-surface2 animate-pulse" />
            <div className="h-3 w-16 rounded bg-surface2 animate-pulse" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-0.5 text-center">
            <p className="font-bold text-white text-lg leading-tight">
              {displayName}
            </p>
            <p className="text-sm text-muted-foreground">@{username}</p>

            <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
              <Users size={13} />
              <span className="text-xs">
                {formatSubscriberCount(subCount)} subscriber
                {subCount !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Subscribe / Manage button */}
            {isOwn ? (
              <button
                type="button"
                data-ocid="channel.secondary_button"
                onClick={handleManageChannel}
                className="mt-3 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border border-orange text-orange hover:bg-orange/10 transition-colors"
              >
                <Settings size={12} />
                Manage Channel
              </button>
            ) : (
              <button
                type="button"
                data-ocid="channel.toggle"
                onClick={handleSubscribeToggle}
                className={`mt-3 flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  subscribed
                    ? "bg-orange text-white"
                    : "border border-border text-foreground hover:bg-surface2"
                }`}
              >
                {subscribed ? (
                  <>
                    <Check size={14} /> Subscribed
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="videos" className="flex-1">
        <TabsList
          data-ocid="channel.tab"
          className="w-full rounded-none bg-background border-b border-border/40 h-10 px-4 gap-0 justify-start"
        >
          <TabsTrigger
            value="videos"
            className="text-xs font-semibold px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-orange data-[state=active]:text-orange data-[state=active]:bg-transparent bg-transparent"
          >
            Videos ({videos.length})
          </TabsTrigger>
          <TabsTrigger
            value="playlists"
            className="text-xs font-semibold px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-orange data-[state=active]:text-orange data-[state=active]:bg-transparent bg-transparent"
          >
            Playlists
          </TabsTrigger>
        </TabsList>

        {/* Videos tab — read-only grid */}
        <TabsContent value="videos" className="mt-0">
          {videosLoading ? (
            <div
              data-ocid="channel.loading_state"
              className="grid grid-cols-2 gap-2.5 px-3 pt-3"
            >
              {["s1", "s2", "s3", "s4"].map((k) => (
                <div key={k} className="space-y-2">
                  <div className="aspect-video w-full rounded-lg bg-surface2 animate-pulse" />
                  <div className="h-3 w-4/5 rounded bg-surface2 animate-pulse" />
                </div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div
              data-ocid="channel.empty_state"
              className="flex flex-col items-center gap-3 py-16 text-center px-4"
            >
              <div className="w-14 h-14 rounded-full bg-surface2 flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M5 3L17 10L5 17V3Z"
                    fill="oklch(0.68 0.18 35 / 0.4)"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">No videos yet</p>
            </div>
          ) : (
            <div
              data-ocid="channel.list"
              className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 px-3 pt-3"
            >
              {videos.map((video, i) => (
                <button
                  key={video.id}
                  type="button"
                  data-ocid={`channel.item.${i + 1}`}
                  className="rounded-xl overflow-hidden bg-surface2 cursor-pointer text-left group"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    {video.thumbnailBlob?.getDirectURL?.() ? (
                      <img
                        src={video.thumbnailBlob.getDirectURL()}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-surface2 to-orange/15 flex items-center justify-center">
                        <svg
                          aria-hidden="true"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M4 2L14 8L4 14V2Z"
                            fill="oklch(0.68 0.18 35 / 0.4)"
                          />
                        </svg>
                      </div>
                    )}
                    {/* Duration overlay */}
                    {(() => {
                      const d = durations.get(video.id);
                      if (d == null) return null;
                      const h = Math.floor(d / 3600);
                      const m = Math.floor((d % 3600) / 60);
                      const s = Math.floor(d % 60);
                      const fmt =
                        h > 0
                          ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
                          : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
                      return (
                        <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                          {fmt}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="px-2 py-2">
                    <p className="text-[13px] font-medium line-clamp-2 text-white/90 leading-snug">
                      {video.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Playlists tab — public playlists (coming soon for other users) */}
        <TabsContent value="playlists" className="mt-0">
          <div
            data-ocid="channel.empty_state"
            className="flex flex-col items-center gap-3 py-16 text-center px-4"
          >
            <div className="w-14 h-14 rounded-full bg-surface2 flex items-center justify-center">
              <ListVideo size={22} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Playlists coming soon
            </p>
            <p className="text-xs text-muted-foreground/60">
              Public playlists from this creator will appear here
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function ChannelPage() {
  const { channelCreatorId } = useApp();

  if (channelCreatorId) {
    return <PublicChannelView creatorId={channelCreatorId} />;
  }
  return <OwnChannelView />;
}
