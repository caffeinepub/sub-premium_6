import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bookmark,
  Check,
  Download,
  Eye,
  MessageCircle,
  Plus,
  Share2,
  SkipForward,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Video } from "../backend";
import { VideoCard } from "../components/VideoCard";
import { useApp } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useIncrementViews,
  useListVideos,
  useUpdateWatchHistory,
} from "../hooks/useQueries";
import { checkMilestone, formatMilestone } from "../utils/milestones";
import { addNotification } from "../utils/notifications";
import {
  addVideoToPlaylist,
  createPlaylist,
  getPlaylists,
  isVideoInPlaylist,
  removeVideoFromPlaylist,
} from "../utils/playlists";
import {
  getRecommendedVideoIds,
  getWatchProgress,
  saveWatchProgress,
  trackBehavior,
} from "../utils/recommendations";
import { isSubscribed, toggleSubscription } from "../utils/subscriptions";

function formatViews(views: bigint | number): string {
  const n = Number(views);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

function timeAgo(uploadTime: bigint): string {
  const ms = Number(uploadTime) / 1_000_000;
  const diff = Date.now() - ms;
  const days = Math.floor(diff / 86_400_000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  return "Today";
}

export function VideoPlayerPage() {
  const {
    selectedVideo,
    setPage,
    setSelectedVideo,
    setMiniPlayerActive,
    setMiniPlayerVideo,
    setNotifTick,
  } = useApp();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const incrementViews = useIncrementViews();
  const updateHistory = useUpdateWatchHistory();
  const { data: allVideos } = useListVideos();
  const hasTracked = useRef(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const watchStartRef = useRef<number>(0);
  const lastSaveRef = useRef<number>(0);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<{ text: string; time: string }[]>(
    [],
  );
  const [showDesc, setShowDesc] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [saveSheetOpen, setSaveSheetOpen] = useState(false);
  const [playlists, setPlaylists] = useState(getPlaylists());
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const [autoplayCountdown, setAutoplayCountdown] = useState<number | null>(
    null,
  );
  const [nextVideo, setNextVideo] = useState<Video | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const trackView = async (videoId: string) => {
    await Promise.all([
      incrementViews.mutateAsync(videoId).catch(() => {}),
      updateHistory.mutateAsync(videoId).catch(() => {}),
    ]);
    const myPrincipal = identity?.getPrincipal().toString();
    if (myPrincipal && selectedVideo?.creatorId === myPrincipal) {
      const cachedVideos =
        queryClient.getQueryData<Video[]>(["videos", ""]) ?? [];
      const updated = cachedVideos.find((v) => v.id === videoId);
      if (updated) {
        const milestone = checkMilestone(videoId, Number(updated.views));
        if (milestone !== null) {
          toast.success(
            `🎉 Your video hit ${formatMilestone(milestone)} views!`,
            { duration: 6000 },
          );
        }
      }
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: trackView is intentionally stable
  useEffect(() => {
    if (selectedVideo && !hasTracked.current) {
      hasTracked.current = true;
      trackView(selectedVideo.id);
      trackBehavior(selectedVideo.id, "click");
      watchStartRef.current = Date.now();
      const saved = getWatchProgress(selectedVideo.id);
      if (saved > 5 && videoRef.current) {
        videoRef.current.currentTime = saved;
      }
    }
  }, [selectedVideo]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on video id change
  useEffect(() => {
    if (!selectedVideo) return;
    hasTracked.current = false;
    setLiked(false);
    setDisliked(false);
    setLikeCount(0);
    setComments([]);
    setShowDesc(false);
    setAutoplayCountdown(null);
    setNextVideo(null);
    setSubscribed(isSubscribed(selectedVideo.creatorId));
    if (countdownRef.current) clearInterval(countdownRef.current);
    window.scrollTo({ top: 0 });
    setMiniPlayerActive(false);
  }, [selectedVideo?.id]);

  useEffect(() => {
    return () => {
      if (selectedVideo && watchStartRef.current > 0) {
        const elapsed = (Date.now() - watchStartRef.current) / 1000;
        if (elapsed < 10) {
          trackBehavior(selectedVideo.id, "skip");
        }
      }
    };
  }, [selectedVideo]);

  useEffect(() => {
    const onScroll = () => {
      if (!playerRef.current) return;
      const rect = playerRef.current.getBoundingClientRect();
      const sticky = rect.bottom < 0;
      setIsSticky(sticky);
      if (sticky && selectedVideo) {
        setMiniPlayerVideo(selectedVideo);
        setMiniPlayerActive(true);
        videoRef.current?.pause();
      } else if (!sticky) {
        setMiniPlayerActive(false);
        videoRef.current?.play().catch(() => {});
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [selectedVideo, setMiniPlayerActive, setMiniPlayerVideo]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: trackView and setSelectedVideo are stable
  useEffect(() => {
    if (autoplayCountdown === null) return;
    if (autoplayCountdown <= 0) {
      if (nextVideo) {
        setSelectedVideo(nextVideo);
        hasTracked.current = false;
        trackView(nextVideo.id);
      }
      setAutoplayCountdown(null);
      setNextVideo(null);
      return;
    }
    countdownRef.current = setInterval(() => {
      setAutoplayCountdown((c) => (c !== null ? c - 1 : null));
    }, 1000);
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [autoplayCountdown, nextVideo]);

  if (!selectedVideo) {
    setPage("home");
    return null;
  }

  const videoUrl = selectedVideo.videoBlobId?.getDirectURL?.();

  const otherVideos = (allVideos ?? []).filter(
    (v: Video) => v.id !== selectedVideo.id,
  );
  const recommendedIds = getRecommendedVideoIds(
    otherVideos.map((v) => ({ id: v.id, creatorId: v.creatorId })),
    8,
  );
  const recommended = recommendedIds
    .map((id) => otherVideos.find((v) => v.id === id))
    .filter((v): v is Video => !!v);

  const handleVideoEnded = () => {
    if (selectedVideo) trackBehavior(selectedVideo.id, "watchTime", 1.0);
    if (recommended.length > 0) {
      setNextVideo(recommended[0]);
      setAutoplayCountdown(7);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const vid = e.currentTarget;
    if (!selectedVideo || !vid.duration) return;
    const now = Date.now();
    if (now - lastSaveRef.current >= 2000) {
      lastSaveRef.current = now;
      saveWatchProgress(selectedVideo.id, vid.currentTime, vid.duration);
      const completionRate = vid.currentTime / vid.duration;
      trackBehavior(selectedVideo.id, "watchTime", completionRate);
    }
  };

  const cancelAutoplay = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setAutoplayCountdown(null);
    setNextVideo(null);
  };

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      setLiked(true);
      setDisliked(false);
      setLikeCount((c) => c + 1);
      trackBehavior(selectedVideo.id, "like");
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
    } else {
      setDisliked(true);
      if (liked) {
        setLiked(false);
        setLikeCount((c) => c - 1);
      }
    }
  };

  const handleShare = async () => {
    const text = `Watch "${selectedVideo.title}" on SUB PREMIUM`;
    if (navigator.share) {
      await navigator
        .share({ title: selectedVideo.title, text })
        .catch(() => {});
    } else {
      await navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `${selectedVideo.title}.mp4`;
    a.click();
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    trackBehavior(selectedVideo.id, "comment");
    setComments((prev) => [
      { text: commentText.trim(), time: "Just now" },
      ...prev,
    ]);
    setCommentText("");
  };

  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    hasTracked.current = false;
    trackView(video.id);
  };

  const handleSubscribe = () => {
    const newState = toggleSubscription(selectedVideo.creatorId);
    setSubscribed(newState);
    if (newState) {
      addNotification({
        type: "new_video",
        title: "Subscribed!",
        body: `You'll be notified of new videos from ${
          selectedVideo.creatorName || "this creator"
        }`,
        videoId: selectedVideo.id,
      });
      setNotifTick((t) => t + 1);
      toast.success(`Subscribed to ${selectedVideo.creatorName || "creator"}`);
    } else {
      toast(`Unsubscribed from ${selectedVideo.creatorName || "creator"}`);
    }
  };

  const handleTogglePlaylist = (playlistId: string) => {
    if (isVideoInPlaylist(playlistId, selectedVideo.id)) {
      removeVideoFromPlaylist(playlistId, selectedVideo.id);
    } else {
      addVideoToPlaylist(playlistId, selectedVideo.id);
    }
    setPlaylists(getPlaylists());
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    const pl = createPlaylist(newPlaylistName.trim());
    addVideoToPlaylist(pl.id, selectedVideo.id);
    setPlaylists(getPlaylists());
    setNewPlaylistName("");
    toast.success(`Added to "${pl.name}"`);
  };

  const nextThumb = nextVideo?.thumbnailBlobId?.getDirectURL?.();

  return (
    <motion.div
      data-ocid="player.page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Back Bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-background sticky top-0 z-10 border-b border-border/30">
        <button
          type="button"
          data-ocid="player.back_button"
          onClick={() => setPage("home")}
          className="p-2 rounded-full hover:bg-surface2 transition-colors text-foreground"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-sm font-semibold truncate flex-1 text-foreground">
          {selectedVideo.title}
        </h2>
      </div>

      {/* Video Player (true 16:9) */}
      <div ref={playerRef} className="w-full bg-black">
        <div className="relative w-full aspect-video">
          {videoUrl ? (
            // biome-ignore lint/a11y/useMediaCaption: user-uploaded content
            <video
              ref={videoRef}
              data-ocid="player.canvas_target"
              src={videoUrl}
              controls={!autoplayCountdown}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
              onEnded={handleVideoEnded}
              onTimeUpdate={handleTimeUpdate}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <p className="text-white/40 text-sm">Video unavailable</p>
            </div>
          )}

          {/* Autoplay countdown overlay */}
          <AnimatePresence>
            {autoplayCountdown !== null && nextVideo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3"
              >
                {nextThumb && (
                  <img
                    src={nextThumb}
                    alt=""
                    className="w-24 h-16 object-cover rounded-lg opacity-80"
                  />
                )}
                <div className="relative w-12 h-12">
                  <svg
                    aria-hidden="true"
                    className="w-12 h-12 -rotate-90"
                    viewBox="0 0 48 48"
                  >
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="4"
                    />
                    <motion.circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="oklch(0.68 0.18 35)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={125.6}
                      strokeDashoffset={125.6 - (125.6 * autoplayCountdown) / 7}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                    {autoplayCountdown}
                  </span>
                </div>
                <p className="text-xs text-white/60 uppercase tracking-widest font-semibold">
                  Up Next
                </p>
                <p className="text-white font-semibold text-sm text-center line-clamp-2 max-w-[220px]">
                  {nextVideo.title}
                </p>
                <button
                  type="button"
                  data-ocid="player.cancel_button"
                  onClick={cancelAutoplay}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors mt-1"
                >
                  <X size={13} />
                  Cancel autoplay
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isSticky && (
        <div className="bg-zinc-900/80 border-b border-white/5 px-4 py-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground truncate flex-1">
            Playing in mini-player
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs text-orange-400 font-medium ml-2 flex-shrink-0"
          >
            Scroll up
          </button>
        </div>
      )}

      {/* Page body */}
      <div className="px-4 pt-3 pb-4 space-y-4">
        <div>
          <h1 className="text-foreground font-bold text-base leading-snug">
            {selectedVideo.title}
          </h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-sm text-muted-foreground">
              {selectedVideo.creatorName || "Unknown"}
            </span>
            <span className="text-muted-foreground/40 text-xs">•</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye size={11} />
              {formatViews(selectedVideo.views)} views
            </span>
            <span className="text-muted-foreground/40 text-xs">•</span>
            <span className="text-xs text-muted-foreground">
              {timeAgo(selectedVideo.uploadTime)}
            </span>
          </div>

          {/* Subscribe button */}
          <button
            type="button"
            data-ocid="player.toggle"
            onClick={handleSubscribe}
            className={`mt-2 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              subscribed
                ? "bg-orange text-white"
                : "border border-border text-foreground hover:bg-surface2"
            }`}
          >
            {subscribed ? (
              <>
                <Check size={12} /> Subscribed
              </>
            ) : (
              <>Subscribe</>
            )}
          </button>
        </div>

        <button
          type="button"
          className="w-full text-left bg-surface2/60 rounded-xl px-3 py-2.5 text-sm text-muted-foreground"
          onClick={() => setShowDesc((s) => !s)}
        >
          {showDesc ? (
            <span>
              {(selectedVideo as any).description || "No description provided."}
            </span>
          ) : (
            <span className="line-clamp-1">
              {(selectedVideo as any).description || "No description provided."}
              <span className="text-accent ml-1 font-medium">more</span>
            </span>
          )}
        </button>

        {/* Action buttons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            data-ocid="player.like_button"
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
              liked
                ? "bg-accent text-black"
                : "bg-surface2 text-foreground hover:bg-surface2/80"
            }`}
          >
            <ThumbsUp size={15} />
            <span>{likeCount > 0 ? likeCount.toLocaleString() : "Like"}</span>
          </button>

          <button
            type="button"
            data-ocid="player.dislike_button"
            onClick={handleDislike}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
              disliked
                ? "bg-surface2/90 text-red-400"
                : "bg-surface2 text-foreground hover:bg-surface2/80"
            }`}
          >
            <ThumbsDown size={15} />
          </button>

          <button
            type="button"
            data-ocid="player.share_button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface2 text-foreground hover:bg-surface2/80 text-sm font-medium transition-colors flex-shrink-0"
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>

          <button
            type="button"
            data-ocid="player.save_button"
            onClick={() => {
              setPlaylists(getPlaylists());
              setSaveSheetOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface2 text-foreground hover:bg-surface2/80 text-sm font-medium transition-colors flex-shrink-0"
          >
            <Bookmark size={15} />
            <span>Save</span>
          </button>

          <button
            type="button"
            data-ocid="player.download_button"
            onClick={handleDownload}
            disabled={!videoUrl}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface2 text-foreground hover:bg-surface2/80 text-sm font-medium transition-colors flex-shrink-0 disabled:opacity-40"
          >
            <Download size={15} />
            <span>Download</span>
          </button>
        </div>

        <div className="border-t border-border/40" />

        {/* Comments */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={15} className="text-muted-foreground" />
            <span className="text-sm font-semibold">
              {comments.length} Comment{comments.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex gap-2 mb-4">
            <Avatar className="w-7 h-7 flex-shrink-0">
              <AvatarFallback className="bg-accent/20 text-accent text-[10px] font-bold">
                ME
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                data-ocid="player.textarea"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="min-h-[60px] text-sm bg-surface2/50 border-border/40 resize-none"
                rows={2}
              />
              {commentText.trim() && (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCommentText("")}
                    data-ocid="player.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleComment}
                    data-ocid="player.submit_button"
                  >
                    Comment
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {comments.map((c, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              <div key={i} className="flex gap-2">
                <Avatar className="w-7 h-7 flex-shrink-0">
                  <AvatarFallback className="bg-accent/20 text-accent text-[10px] font-bold">
                    ME
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-xs font-semibold text-foreground">
                    You{" "}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {c.time}
                  </span>
                  <p className="text-sm text-foreground mt-0.5">{c.text}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No comments yet. Be the first!
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-border/40" />

        {recommended.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold mb-3">Recommended for You</h2>
            <div className="space-y-4">
              {recommended.map((video: Video, index: number) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={index + 1}
                  onClick={() => handleSelectVideo(video)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Save to Playlist Sheet */}
      <AnimatePresence>
        {saveSheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60"
              onClick={() => setSaveSheetOpen(false)}
            />
            {/* Sheet */}
            <motion.div
              data-ocid="player.sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-surface1 rounded-t-2xl max-h-[70vh] flex flex-col max-w-[430px] mx-auto"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
                <span className="text-sm font-semibold">Save to playlist</span>
                <button
                  type="button"
                  data-ocid="player.close_button"
                  onClick={() => setSaveSheetOpen(false)}
                  className="p-1 rounded-full hover:bg-surface2"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {playlists.map((pl) => {
                  const inList = isVideoInPlaylist(pl.id, selectedVideo.id);
                  return (
                    <button
                      key={pl.id}
                      type="button"
                      data-ocid="player.toggle"
                      onClick={() => handleTogglePlaylist(pl.id)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface2 transition-colors border-b border-border/20"
                    >
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">
                          {pl.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pl.videoIds.length} video
                          {pl.videoIds.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      {inList && (
                        <Check
                          size={16}
                          className="text-orange flex-shrink-0"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* New playlist */}
              <div className="px-4 py-3 border-t border-border/40 flex gap-2">
                <Input
                  data-ocid="player.input"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="New playlist name..."
                  className="flex-1 h-9 text-sm bg-surface2 border-border/60"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreatePlaylist();
                  }}
                />
                <button
                  type="button"
                  data-ocid="player.primary_button"
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange text-white text-sm font-medium disabled:opacity-40 transition-colors"
                >
                  <Plus size={14} /> Create
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
