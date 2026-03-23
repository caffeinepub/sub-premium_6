import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Captions,
  Check,
  ChevronDown,
  Clock,
  Download,
  Eye,
  Maximize,
  MessageCircle,
  Pause,
  Play,
  Plus,
  SendHorizontal,
  Share2,
  SkipBack,
  SkipForward,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Video } from "../backend";
import { AddToPlaylistModal } from "../components/AddToPlaylistModal";
import { type CommentData, CommentItem } from "../components/CommentItem";
import { VideoCard } from "../components/VideoCard";
import { useApp } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCaptionTracks,
  useIncrementViews,
  useListVideos,
  useUpdateWatchHistory,
} from "../hooks/useQueries";
import { useI18n } from "../i18n";
import { checkMilestone, formatMilestone } from "../utils/milestones";
import { addNotification } from "../utils/notifications";
import { isVideoInAnyPlaylist } from "../utils/playlists";
import { isUpcoming } from "../utils/premiereUtils";
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

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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

// ---------------------------------------------------------------------------
// VideoPlayerPage
// ---------------------------------------------------------------------------
export function VideoPlayerPage() {
  const {
    selectedVideo,
    setPage,
    setSelectedVideo,
    setMiniPlayerActive,
    setMiniPlayerVideo,
    setNotifTick,
    setChannelCreatorId,
  } = useApp();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const incrementViews = useIncrementViews();
  const updateHistory = useUpdateWatchHistory();
  const { data: allVideos } = useListVideos();
  const hasTracked = useRef(false);
  const { language: userLang, t } = useI18n();
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const watchStartRef = useRef<number>(0);
  const lastSaveRef = useRef<number>(0);
  const captionBlobUrlRef = useRef<string | null>(null);
  const isDraggingRef = useRef(false);
  const [dragPct, setDragPct] = useState<number | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tapCountRef = useRef(0);
  const lastTapSideRef = useRef<"left" | "right" | null>(null);
  const [seekFeedback, setSeekFeedback] = useState<{
    side: "left" | "right";
    key: number;
  } | null>(null);
  const seekFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<CommentData[]>([]);
  const [showDesc, setShowDesc] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [saveSheetOpen, setSaveSheetOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [autoplayCountdown, setAutoplayCountdown] = useState<number | null>(
    null,
  );
  const [nextVideo, setNextVideo] = useState<Video | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // CC state
  const [ccEnabled, setCcEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem("sp_cc");
      if (stored !== null) return stored === "1";
      return false;
    } catch {
      return false;
    }
  });
  const [selectedLang, setSelectedLang] = useState(() => {
    try {
      const subtitlePref = localStorage.getItem("subtitle_lang");
      const captionPref = localStorage.getItem("sp_caption_lang");
      return captionPref || subtitlePref || "en";
    } catch {
      return "en";
    }
  });

  const { data: captionTracks = [] } = useGetCaptionTracks(
    selectedVideo?.id ?? "",
    true,
  );

  const hasTracks = captionTracks.length > 0;
  const isCreator =
    identity?.getPrincipal().toString() === selectedVideo?.creatorId;

  // Auto-enable CC when tracks load and user has no stored preference
  useEffect(() => {
    if (captionTracks.length > 0) {
      try {
        if (localStorage.getItem("sp_cc") === null) {
          setCcEnabled(true);
        }
      } catch {}
    }
  }, [captionTracks.length]);

  const activeTrack =
    captionTracks.find((t) => t.language === selectedLang) ??
    captionTracks[0] ??
    null;

  // Build blob URL for active track
  useEffect(() => {
    if (captionBlobUrlRef.current) {
      URL.revokeObjectURL(captionBlobUrlRef.current);
      captionBlobUrlRef.current = null;
    }
    if (activeTrack?.vtt) {
      captionBlobUrlRef.current = URL.createObjectURL(
        new Blob([activeTrack.vtt], { type: "text/vtt" }),
      );
    }
  }, [activeTrack]);

  useEffect(() => {
    return () => {
      if (captionBlobUrlRef.current) {
        URL.revokeObjectURL(captionBlobUrlRef.current);
        captionBlobUrlRef.current = null;
      }
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: activeTrack change triggers track reload
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const tracks = vid.textTracks;
    if (tracks.length > 0) {
      tracks[0].mode = ccEnabled ? "showing" : "hidden";
    }
  }, [ccEnabled, activeTrack]);

  // -------------------------------------------------------------------------
  // Controls timer helpers
  // -------------------------------------------------------------------------
  const resetControlsTimer = () => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    setControlsVisible(true);
    controlsTimerRef.current = setTimeout(
      () => setControlsVisible(false),
      5000,
    );
  };

  const toggleCc = () => {
    setCcEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sp_cc", next ? "1" : "0");
      } catch {}
      return next;
    });
    resetControlsTimer();
  };

  const handleLangSelect = (lang: string) => {
    setSelectedLang(lang);
    try {
      localStorage.setItem("sp_caption_lang", lang);
      localStorage.setItem("subtitle_lang", lang);
    } catch {}
    setLangMenuOpen(false);
    if (!ccEnabled) {
      setCcEnabled(true);
      try {
        localStorage.setItem("sp_cc", "1");
      } catch {}
    }
    resetControlsTimer();
  };

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
    setCurrentTime(0);
    setIsPlaying(false);
    setControlsVisible(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(
      () => setControlsVisible(false),
      5000,
    );
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

  // CRITICAL safety check: never render player for locked upcoming videos
  if (isUpcoming(selectedVideo)) {
    setPage("premiere-preview");
    return null;
  }

  const videoUrl = selectedVideo.videoBlob?.getDirectURL?.();

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

  // -------------------------------------------------------------------------
  // Progress bar helpers (inlined)
  // -------------------------------------------------------------------------
  const duration = videoDuration ?? 0;
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayPct = dragPct !== null ? dragPct : pct;

  function getPctFromPointer(e: PointerEvent | React.PointerEvent): number {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const raw = (e.clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(1, raw)) * 100;
  }

  function handleTrackPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    const p = getPctFromPointer(e);
    setDragPct(p);
    setCurrentTime((p / 100) * duration);
    resetControlsTimer();
  }

  function handleTrackPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return;
    const p = getPctFromPointer(e);
    setDragPct(p);
    setCurrentTime((p / 100) * duration);
  }

  function handleTrackPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return;
    const p = getPctFromPointer(e);
    isDraggingRef.current = false;
    setDragPct(null);
    if (videoRef.current) {
      videoRef.current.currentTime = (p / 100) * duration;
      setCurrentTime((p / 100) * duration);
    }
    resetControlsTimer();
  }

  // -------------------------------------------------------------------------
  // Tap / gesture handling
  // -------------------------------------------------------------------------
  const handleVideoTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const side = e.clientX < rect.left + rect.width / 2 ? "left" : "right";
    tapCountRef.current += 1;
    lastTapSideRef.current = side;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      const count = tapCountRef.current;
      const tapSide = lastTapSideRef.current;
      tapCountRef.current = 0;
      lastTapSideRef.current = null;
      if (count >= 2 && tapSide) {
        // double-tap seek
        const vid = videoRef.current;
        if (!vid) return;
        if (tapSide === "left") {
          vid.currentTime = Math.max(0, vid.currentTime - 10);
        } else {
          vid.currentTime = Math.min(vid.duration || 0, vid.currentTime + 10);
        }
        setCurrentTime(vid.currentTime);
        if (seekFeedbackTimerRef.current)
          clearTimeout(seekFeedbackTimerRef.current);
        setSeekFeedback({ side: tapSide, key: Date.now() });
        seekFeedbackTimerRef.current = setTimeout(
          () => setSeekFeedback(null),
          700,
        );
        resetControlsTimer();
      } else {
        // single tap: toggle controls
        setControlsVisible((prev) => {
          if (!prev) {
            resetControlsTimer();
          } else {
            if (controlsTimerRef.current)
              clearTimeout(controlsTimerRef.current);
            setControlsVisible(false);
          }
          return !prev;
        });
      }
    }, 250);
  };

  const handlePrevVideo = () => {
    if (!allVideos || allVideos.length === 0) return;
    const currentIndex = allVideos.findIndex(
      (v: Video) => v.id === selectedVideo.id,
    );
    const prevIndex = (currentIndex - 1 + allVideos.length) % allVideos.length;
    handleSelectVideo(allVideos[prevIndex]);
  };

  const handleNextVideo = () => {
    if (recommended.length > 0) {
      handleSelectVideo(recommended[0]);
    } else if (allVideos && allVideos.length > 0) {
      const currentIndex = allVideos.findIndex(
        (v: Video) => v.id === selectedVideo.id,
      );
      const nextIndex = (currentIndex + 1) % allVideos.length;
      handleSelectVideo(allVideos[nextIndex]);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (selectedVideo) trackBehavior(selectedVideo.id, "watchTime", 1.0);
    if (recommended.length > 0) {
      setNextVideo(recommended[0]);
      setAutoplayCountdown(7);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const vid = e.currentTarget;
    if (!selectedVideo || !vid.duration) return;
    if (!isDraggingRef.current) {
      setCurrentTime(vid.currentTime);
    }
    const now = Date.now();
    if (now - lastSaveRef.current >= 2000) {
      lastSaveRef.current = now;
      saveWatchProgress(selectedVideo.id, vid.currentTime, vid.duration);
      const completionRate = vid.currentTime / vid.duration;
      trackBehavior(selectedVideo.id, "watchTime", completionRate);
    }
  };

  const handlePlayPause = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
    resetControlsTimer();
  };

  const handleFullscreen = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
    resetControlsTimer();
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

  const nextThumb = nextVideo?.thumbnailBlob?.getDirectURL?.();

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
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: video tap area is intentionally click-only */}
        <div className="relative w-full aspect-video" onClick={handleVideoTap}>
          {videoUrl ? (
            // biome-ignore lint/a11y/useMediaCaption: user-uploaded content
            <video
              ref={videoRef}
              data-ocid="player.canvas_target"
              src={videoUrl}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
              onEnded={handleVideoEnded}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => {
                setIsPlaying(true);
                resetControlsTimer();
              }}
              onPause={() => {
                setIsPlaying(false);
                setControlsVisible(true);
                if (controlsTimerRef.current)
                  clearTimeout(controlsTimerRef.current);
              }}
              onLoadedMetadata={(e) => {
                const d = e.currentTarget.duration;
                if (d && Number.isFinite(d)) {
                  setVideoDuration(d);
                }
              }}
            >
              {activeTrack?.vtt && captionBlobUrlRef.current && (
                <track
                  key={captionBlobUrlRef.current}
                  kind="subtitles"
                  src={captionBlobUrlRef.current}
                  default={ccEnabled}
                  label={activeTrack?.captionLabel ?? "Captions"}
                  srcLang={activeTrack?.language ?? "en"}
                />
              )}
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <p className="text-white/40 text-sm">Video unavailable</p>
            </div>
          )}

          {/* ================================================================
              SINGLE CONTROLS OVERLAY — fades in/out together
              ================================================================ */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{ opacity: controlsVisible ? 1 : 0 }}
          >
            {/* Gradient scrim — top & bottom */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.65) 100%)",
              }}
            />

            {/* TOP ROW: CC (left) + Fullscreen (right) */}
            <div
              className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 pt-3"
              style={{ pointerEvents: controlsVisible ? "auto" : "none" }}
            >
              {/* CC button */}
              {hasTracks && (
                <div className="relative">
                  <button
                    type="button"
                    data-ocid="player.toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (captionTracks.length > 1) {
                        setLangMenuOpen((o) => !o);
                        resetControlsTimer();
                      } else {
                        toggleCc();
                      }
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      ccEnabled
                        ? "bg-black/60 text-white border-white/40"
                        : "bg-black/40 text-white/50 border-white/20"
                    }`}
                    aria-label="Toggle captions"
                  >
                    <Captions size={13} />
                    CC
                    {captionTracks.length > 1 && (
                      <ChevronDown size={10} className="ml-0.5" />
                    )}
                  </button>

                  {/* Language dropdown — inside overlay */}
                  <AnimatePresence>
                    {langMenuOpen && (
                      <motion.div
                        data-ocid="player.dropdown_menu"
                        initial={{ opacity: 0, y: -4, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.96 }}
                        transition={{ duration: 0.12 }}
                        className="absolute top-8 left-0 z-50 bg-black/90 border border-white/20 rounded-xl shadow-lg overflow-hidden min-w-[130px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* CC on/off toggle row */}
                        <button
                          type="button"
                          onClick={() => toggleCc()}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-white/10 flex items-center justify-between border-b border-white/10"
                        >
                          <span className="text-white/80">Captions</span>
                          <span
                            className={`text-[10px] font-bold ${
                              ccEnabled ? "text-orange-400" : "text-white/40"
                            }`}
                          >
                            {ccEnabled ? "ON" : "OFF"}
                          </span>
                        </button>
                        {captionTracks.map((t) => (
                          <button
                            key={t.language}
                            type="button"
                            onClick={() => handleLangSelect(t.language)}
                            className={`w-full text-left px-3 py-2 text-xs hover:bg-white/10 flex items-center justify-between ${
                              selectedLang === t.language
                                ? "text-orange-400 font-bold"
                                : "text-white/80"
                            }`}
                          >
                            {t.captionLabel || t.language}
                            {selectedLang === t.language && (
                              <Check size={11} className="text-orange-400" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Spacer when no CC */}
              {!hasTracks && <div />}

              {/* Fullscreen button — circular */}
              <button
                type="button"
                data-ocid="player.button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullscreen();
                }}
                className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                aria-label="Fullscreen"
              >
                <Maximize size={16} />
              </button>
            </div>

            {/* CENTER ROW: ⏮ Play/Pause ⏭ */}
            <div
              className="absolute inset-0 flex items-center justify-center gap-10"
              style={{ pointerEvents: controlsVisible ? "auto" : "none" }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevVideo();
                }}
                className="text-white drop-shadow-lg active:scale-90 transition-transform"
                aria-label="Previous video"
              >
                <SkipBack size={32} fill="white" />
              </button>

              <button
                type="button"
                data-ocid="player.toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                className="text-white drop-shadow-lg active:scale-90 transition-transform"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={44} fill="white" />
                ) : (
                  <Play size={44} fill="white" />
                )}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextVideo();
                }}
                className="text-white drop-shadow-lg active:scale-90 transition-transform"
                aria-label="Next video"
              >
                <SkipForward size={32} fill="white" />
              </button>
            </div>

            {/* BOTTOM ROW: timeline */}
            <div
              className="absolute bottom-0 left-0 right-0 px-3 pb-3 flex flex-col gap-1"
              style={{ pointerEvents: controlsVisible ? "auto" : "none" }}
            >
              {/* Track */}
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: slider handles keyboard via role=slider and aria */}
              <div
                ref={trackRef}
                data-ocid="player.canvas_target"
                role="slider"
                aria-label="Video progress"
                aria-valuenow={Math.round(displayPct)}
                aria-valuemin={0}
                aria-valuemax={100}
                tabIndex={0}
                className="relative flex items-center cursor-pointer select-none"
                style={{ height: "20px" }}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  handleTrackPointerDown(e);
                }}
                onPointerMove={handleTrackPointerMove}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  handleTrackPointerUp(e);
                }}
                onPointerCancel={(e) => {
                  e.stopPropagation();
                  handleTrackPointerUp(e);
                }}
              >
                {/* Bar */}
                <div
                  className="absolute inset-x-0 rounded-full"
                  style={{
                    height: "4px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: `linear-gradient(to right, #FF0000 ${displayPct}%, rgba(255,255,255,0.7) ${displayPct}%)`,
                  }}
                />
                {/* Scrubber */}
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: "14px",
                    height: "14px",
                    background: "#FF0000",
                    left: `calc(${displayPct}% - 7px)`,
                    top: "50%",
                    transform: "translateY(-50%)",
                    boxShadow:
                      "0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(255,0,0,0.4)",
                  }}
                />
              </div>

              {/* Time labels */}
              <div className="flex items-center justify-between">
                <span
                  className="text-white text-xs tabular-nums"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {duration > 0
                    ? formatDuration(
                        dragPct !== null
                          ? (dragPct / 100) * duration
                          : currentTime,
                      )
                    : "0:00"}
                </span>
                <span
                  className="text-white text-xs tabular-nums"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {duration > 0 ? formatDuration(duration) : "0:00"}
                </span>
              </div>
            </div>
          </div>
          {/* END CONTROLS OVERLAY */}

          {/* Seek feedback flash */}
          <AnimatePresence>
            {seekFeedback && (
              <motion.div
                key={seekFeedback.key}
                initial={{ opacity: 0.9, scale: 0.9 }}
                animate={{ opacity: 0.9, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  [seekFeedback.side === "left" ? "left" : "right"]: "12%",
                }}
              >
                <div className="bg-black/60 rounded-full px-3 py-1.5 text-white text-xs font-bold">
                  {seekFeedback.side === "left" ? "−10s" : "+10s"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
        {/* END aspect-video */}
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
            <button
              type="button"
              data-ocid="player.link"
              onClick={() => {
                setChannelCreatorId(selectedVideo.creatorId);
                setPage("channel");
              }}
              className="text-sm text-muted-foreground hover:text-orange transition-colors font-medium"
            >
              {selectedVideo.creatorName || "Unknown"}
            </button>
            <span className="text-muted-foreground/40 text-xs">•</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye size={11} />
              {formatViews(selectedVideo.views)} views
            </span>
            <span className="text-muted-foreground/40 text-xs">•</span>
            <span className="text-xs text-muted-foreground">
              {timeAgo(selectedVideo.uploadTime)}
            </span>
            {videoDuration !== null && (
              <>
                <span className="text-muted-foreground/40 text-xs">•</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={11} />
                  {formatDuration(videoDuration)}
                </span>
              </>
            )}
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

        {/* No-captions strip — only visible to the creator */}
        {!hasTracks && isCreator && (
          <div
            data-ocid="player.card"
            className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-orange/25 bg-orange/5"
          >
            <p className="text-xs text-muted-foreground leading-snug">
              <span className="text-orange font-semibold">No captions yet</span>{" "}
              — add captions for better reach and accessibility.
            </p>
            <button
              type="button"
              data-ocid="captions.open_modal_button"
              onClick={() => setPage("upload")}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-orange text-white text-xs font-semibold hover:bg-orange/90 transition-colors"
            >
              Add Captions
            </button>
          </div>
        )}

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
            onClick={() => setSaveSheetOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface2 text-foreground hover:bg-surface2/80 text-sm font-medium transition-colors flex-shrink-0"
          >
            {isVideoInAnyPlaylist(selectedVideo.id) ? (
              <BookmarkCheck size={15} className="text-orange" />
            ) : (
              <Bookmark size={15} />
            )}
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

          <div className="space-y-3">
            {comments.map((c, i) => (
              <CommentItem
                // biome-ignore lint/suspicious/noArrayIndexKey: order rarely changes
                key={i}
                comment={c}
                index={i + 1}
                userLang={userLang}
              />
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t("comment.noComments")}
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

      {/* Sticky Comment Input Bar — above BottomNav */}
      <div
        data-ocid="player.comment_bar"
        className="fixed left-0 right-0 z-40 flex items-center gap-2 px-3 py-2 border-t border-border/40 max-w-[430px] mx-auto"
        style={{
          bottom: "64px",
          backgroundColor: "#121212",
          paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <Avatar className="w-7 h-7 flex-shrink-0">
          <AvatarFallback className="bg-accent/20 text-accent text-[10px] font-bold">
            ME
          </AvatarFallback>
        </Avatar>
        <input
          data-ocid="player.textarea"
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onFocus={(e) => {
            setTimeout(() => {
              e.target.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 300);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && commentText.trim()) handleComment();
          }}
          placeholder={t("comment.placeholder")}
          className="flex-1 h-9 rounded-full px-4 text-sm"
          style={{
            backgroundColor: "#1a1a1a",
            color: "#ffffff",
            border: "1px solid #333",
            outline: "none",
          }}
        />
        <button
          type="button"
          data-ocid="player.submit_button"
          onClick={handleComment}
          disabled={!commentText.trim()}
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
          style={{ backgroundColor: commentText.trim() ? "#f97316" : "#333" }}
          aria-label="Post comment"
        >
          <SendHorizontal size={16} className="text-white" />
        </button>
      </div>

      <AddToPlaylistModal
        videoId={selectedVideo.id}
        open={saveSheetOpen}
        onClose={() => setSaveSheetOpen(false)}
      />
    </motion.div>
  );
}
