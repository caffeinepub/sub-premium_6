import { d as createLucideIcon, ax as useI18n, r as reactExports, j as jsxRuntimeExports, F as Avatar, G as AvatarImage, H as AvatarFallback, aP as translateComment, u as useApp, g as useInternetIdentity, aw as useQueryClient, aQ as useVideoEngagement, aR as useIncrementViews, aS as useRecordView, aT as useLikeVideo, aU as useDislikeVideo, aV as usePostComment, aW as useUpdateWatchHistory, b as useListVideos, O as useGetCaptionTracks, y as isSubscribed, C as isUpcoming, m as motion, aX as Pause, P as Play, av as ChevronDown, A as AnimatePresence, ac as Check, a0 as Settings, X, aY as MessageCircle, aI as Sheet, aK as SheetContent, aL as SheetHeader, aM as SheetTitle, e as ue, K as toggleSubscription, aZ as addNotification } from "./index-DSOyFnVG.js";
import { t as trackBehavior, d as getWatchProgress, c as getRecommendedVideoIds, E as Eye, B as BookmarkCheck, V as VideoCard, A as AddToPlaylistModal, s as saveWatchProgress } from "./recommendations-SxJSX6Y2.js";
import { C as Captions, a as CaptionManager } from "./CaptionManager-C4JFh2rg.js";
import { b as isVideoInAnyPlaylist } from "./playlists-BxogQr83.js";
import { A as ArrowLeft } from "./arrow-left-FCtMkwAX.js";
import { C as ChevronRight } from "./chevron-right-K2z2zorW.js";
import { C as Clock } from "./clock-_PitsIeG.js";
import { S as Share2 } from "./share-2-stuau9JC.js";
import { B as Bookmark } from "./bookmark-CXa_WCMS.js";
import "./lock-QCMAnrix.js";
import "./plus-ChHCscM6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z",
      key: "117uat"
    }
  ],
  ["path", { d: "M6 12h16", key: "s4cdu5" }]
];
const SendHorizontal = createLucideIcon("send-horizontal", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["polygon", { points: "19 20 9 12 19 4 19 20", key: "o2sva" }],
  ["line", { x1: "5", x2: "5", y1: "19", y2: "5", key: "1ocqjk" }]
];
const SkipBack = createLucideIcon("skip-back", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["polygon", { points: "5 4 15 12 5 20 5 4", key: "16p6eg" }],
  ["line", { x1: "19", x2: "19", y1: "5", y2: "19", key: "futhcm" }]
];
const SkipForward = createLucideIcon("skip-forward", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M17 14V2", key: "8ymqnk" }],
  [
    "path",
    {
      d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z",
      key: "m61m77"
    }
  ]
];
const ThumbsDown = createLucideIcon("thumbs-down", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M7 10v12", key: "1qc93n" }],
  [
    "path",
    {
      d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",
      key: "emmmcr"
    }
  ]
];
const ThumbsUp = createLucideIcon("thumbs-up", __iconNode);
function CommentItem({ comment, index, userLang }) {
  const { t } = useI18n();
  const [displayText, setDisplayText] = reactExports.useState(comment.text);
  const [isTranslated, setIsTranslated] = reactExports.useState(false);
  const [isTranslating, setIsTranslating] = reactExports.useState(false);
  const [visible, setVisible] = reactExports.useState(true);
  const cacheRef = reactExports.useRef(null);
  const commentLang = comment.lang ?? "en";
  const canTranslate = commentLang !== userLang;
  const displayName = comment.username ?? "User";
  const initials = displayName.charAt(0).toUpperCase();
  const handleTranslate = async () => {
    if (cacheRef.current) {
      setVisible(false);
      setTimeout(() => {
        setDisplayText(cacheRef.current);
        setIsTranslated(true);
        setVisible(true);
      }, 150);
      return;
    }
    setIsTranslating(true);
    try {
      const translated = await translateComment(comment.text, userLang);
      cacheRef.current = translated;
      setVisible(false);
      setTimeout(() => {
        setDisplayText(translated);
        setIsTranslated(true);
        setVisible(true);
        setIsTranslating(false);
      }, 150);
    } catch {
      setIsTranslating(false);
    }
  };
  const handleShowOriginal = () => {
    setVisible(false);
    setTimeout(() => {
      setDisplayText(comment.text);
      setIsTranslated(false);
      setVisible(true);
    }, 150);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", "data-ocid": `player.comment.item.${index}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-7 h-7 flex-shrink-0", children: [
      comment.avatarBlobId ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: comment.avatarBlobId, alt: displayName }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-accent/20 text-accent text-[10px] font-bold", children: initials })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-foreground", children: [
        displayName,
        " "
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: comment.time }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-sm text-foreground mt-0.5",
          style: {
            transition: "opacity 0.2s ease",
            opacity: visible ? 1 : 0
          },
          children: displayText
        }
      ),
      canTranslate && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: isTranslating ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground italic", children: t("comment.translating") }) : isTranslated ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleShowOriginal,
          className: "text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors",
          "data-ocid": `player.comment.toggle.${index}`,
          children: t("comment.showOriginal")
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleTranslate,
          className: "text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors",
          "data-ocid": `player.comment.toggle.${index}`,
          children: t("comment.translate")
        }
      ) })
    ] })
  ] });
}
const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "Hindi", short: "HI" },
  { code: "ar", label: "Arabic", short: "AR" },
  { code: "es", label: "Spanish", short: "ES" },
  { code: "fr", label: "French", short: "FR" },
  { code: "zh", label: "Chinese", short: "ZH" },
  { code: "de", label: "German", short: "DE" },
  { code: "pt", label: "Portuguese", short: "PT" },
  { code: "ja", label: "Japanese", short: "JA" },
  { code: "ko", label: "Korean", short: "KO" }
];
function detectLanguage(video) {
  const text = `${video.title ?? ""} ${video.description ?? ""}`.toLowerCase();
  if (/[\u0600-\u06FF]/.test(text)) return "ar";
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh";
  if (/[\u3040-\u30FF]/.test(text)) return "ja";
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko";
  if (/\b(hola|gracias|el|la|los|las|es|español)\b/.test(text)) return "es";
  if (/\b(bonjour|merci|oui|non|le|la|les|français)\b/.test(text)) return "fr";
  if (/\b(hallo|danke|ja|nein|deutsch)\b/.test(text)) return "de";
  try {
    const stored = localStorage.getItem("app_language");
    if (stored && SUPPORTED_LANGUAGES.find((l) => l.code === stored))
      return stored;
  } catch {
  }
  return "en";
}
function getLangLabel(code) {
  var _a;
  return ((_a = SUPPORTED_LANGUAGES.find((l) => l.code === code)) == null ? void 0 : _a.label) ?? code;
}
function getLangShort(code) {
  var _a;
  return ((_a = SUPPORTED_LANGUAGES.find((l) => l.code === code)) == null ? void 0 : _a.short) ?? code.toUpperCase();
}
const MILESTONES = [
  10,
  50,
  100,
  500,
  1e3,
  5e3,
  1e4,
  5e4,
  1e5,
  1e6
];
function milestoneKey(videoId, milestone) {
  return `milestone_${videoId}_${milestone}`;
}
function checkMilestone(videoId, views) {
  for (const m of [...MILESTONES].reverse()) {
    if (views >= m) {
      const key = milestoneKey(videoId, m);
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, "1");
        return m;
      }
      break;
    }
  }
  return null;
}
function formatMilestone(n) {
  if (n >= 1e6) return `${n / 1e6}M`;
  if (n >= 1e3) return `${n / 1e3}K`;
  return `${n}`;
}
function formatViews(views) {
  const n = Number(views);
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return `${n}`;
}
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function timeAgo(uploadTime) {
  const ms = Number(uploadTime) / 1e6;
  const diff = Date.now() - ms;
  const days = Math.floor(diff / 864e5);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  return "Today";
}
function formatTimestamp(nanos) {
  const ms = nanos / 1e6;
  const diffMs = Date.now() - ms;
  const diffSec = Math.floor(diffMs / 1e3);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
}
function VideoPlayerPage() {
  var _a, _b, _c, _d;
  const {
    selectedVideo,
    setPage,
    setSelectedVideo,
    setMiniPlayerActive,
    setMiniPlayerVideo,
    setNotifTick,
    setChannelCreatorId
  } = useApp();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isLoggedIn = !!identity;
  const { data: engagement } = useVideoEngagement((selectedVideo == null ? void 0 : selectedVideo.id) ?? null);
  const liked = (engagement == null ? void 0 : engagement.isLiked) ?? false;
  const likeCount = Number((engagement == null ? void 0 : engagement.likeCount) ?? 0);
  const dislikeCount = Number((engagement == null ? void 0 : engagement.dislikeCount) ?? 0);
  const userReaction = (engagement == null ? void 0 : engagement.userReaction) ?? "none";
  const disliked = userReaction === "dislike";
  const viewTimerRef = reactExports.useRef(null);
  const incrementViews = useIncrementViews();
  const recordView = useRecordView();
  const likeVideoMutation = useLikeVideo();
  const dislikeVideoMutation = useDislikeVideo();
  const postCommentMutation = usePostComment();
  const updateHistory = useUpdateWatchHistory();
  const { data: allVideos } = useListVideos();
  const hasTracked = reactExports.useRef(false);
  const { language: userLang, t } = useI18n();
  const playerRef = reactExports.useRef(null);
  const videoRef = reactExports.useRef(null);
  const videoContainerRef = reactExports.useRef(null);
  const trackRef = reactExports.useRef(null);
  const watchStartRef = reactExports.useRef(0);
  const lastSaveRef = reactExports.useRef(0);
  const captionBlobUrlRef = reactExports.useRef(null);
  const isDraggingRef = reactExports.useRef(false);
  const [dragPct, setDragPct] = reactExports.useState(null);
  const [controlsVisible, setControlsVisible] = reactExports.useState(true);
  const controlsTimerRef = reactExports.useRef(null);
  const tapTimerRef = reactExports.useRef(null);
  const tapCountRef = reactExports.useRef(0);
  const lastTapSideRef = reactExports.useRef(null);
  const [seekFeedback, setSeekFeedback] = reactExports.useState(null);
  const seekFeedbackTimerRef = reactExports.useRef(
    null
  );
  const [isSticky, setIsSticky] = reactExports.useState(false);
  const [commentText, setCommentText] = reactExports.useState("");
  const [showDesc, setShowDesc] = reactExports.useState(false);
  const [subscribed, setSubscribed] = reactExports.useState(false);
  const [saveSheetOpen, setSaveSheetOpen] = reactExports.useState(false);
  const [captionModalOpen, setCaptionModalOpen] = reactExports.useState(false);
  const [langMenuOpen, setLangMenuOpen] = reactExports.useState(false);
  const [videoDuration, setVideoDuration] = reactExports.useState(null);
  const [currentTime, setCurrentTime] = reactExports.useState(0);
  const [isPlaying, setIsPlaying] = reactExports.useState(false);
  const [autoplayCountdown, setAutoplayCountdown] = reactExports.useState(
    null
  );
  const [nextVideo, setNextVideo] = reactExports.useState(null);
  const countdownRef = reactExports.useRef(null);
  const translationTaskRef = reactExports.useRef(null);
  const [ccEnabled, setCcEnabled] = reactExports.useState(() => {
    try {
      const stored = localStorage.getItem("sp_cc");
      if (stored !== null) return stored === "1";
      return false;
    } catch {
      return false;
    }
  });
  const [selectedLang, setSelectedLang] = reactExports.useState(() => {
    try {
      const subtitlePref = localStorage.getItem("subtitle_lang");
      const captionPref = localStorage.getItem("sp_caption_lang");
      return captionPref || subtitlePref || "en";
    } catch {
      return "en";
    }
  });
  const [detectedLang, setDetectedLang] = reactExports.useState("en");
  const [translating, setTranslating] = reactExports.useState(false);
  const [isOnline, setIsOnline] = reactExports.useState(() => {
    try {
      return navigator.onLine;
    } catch {
      return true;
    }
  });
  const [suggestionBanner, setSuggestionBanner] = reactExports.useState(null);
  const [settingsOpen, setSettingsOpen] = reactExports.useState(false);
  const [liveHasTracks, setLiveHasTracks] = reactExports.useState(false);
  const [subtitleSubmenuOpen, setSubtitleSubmenuOpen] = reactExports.useState(false);
  const [playbackSpeed, setPlaybackSpeed] = reactExports.useState(1);
  const [quality, setQuality] = reactExports.useState(
    "Auto"
  );
  const { data: captionTracks = [], isError: captionTracksError } = useGetCaptionTracks((selectedVideo == null ? void 0 : selectedVideo.id) ?? "", true);
  const [captionsError, setCaptionsError] = reactExports.useState(false);
  const hasTracks = captionTracks.length > 0;
  const isCreator = (identity == null ? void 0 : identity.getPrincipal().toString()) === (selectedVideo == null ? void 0 : selectedVideo.creatorId);
  const commentList = ((engagement == null ? void 0 : engagement.comments) ?? []).map((c) => ({
    id: c.id,
    text: c.text,
    time: formatTimestamp(Number(c.timestamp)),
    username: c.username,
    avatarBlobId: c.avatarBlobId || void 0,
    userId: c.userId
  }));
  const activeTrack = captionTracks.find((t2) => t2.language === selectedLang) ?? captionTracks[0] ?? null;
  reactExports.useEffect(() => {
    if (captionBlobUrlRef.current) {
      URL.revokeObjectURL(captionBlobUrlRef.current);
      captionBlobUrlRef.current = null;
    }
    if (activeTrack == null ? void 0 : activeTrack.vtt) {
      captionBlobUrlRef.current = URL.createObjectURL(
        new Blob([activeTrack.vtt], { type: "text/vtt" })
      );
    }
  }, [activeTrack]);
  reactExports.useEffect(() => {
    return () => {
      if (captionBlobUrlRef.current) {
        URL.revokeObjectURL(captionBlobUrlRef.current);
        captionBlobUrlRef.current = null;
      }
    };
  }, []);
  reactExports.useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const tracks = vid.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      const t2 = tracks[i];
      if (ccEnabled && activeTrack && (t2.language === activeTrack.language || tracks.length === 1)) {
        t2.mode = "showing";
      } else {
        t2.mode = "hidden";
      }
    }
  }, [ccEnabled, activeTrack, selectedLang]);
  reactExports.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const checkTracks = () => {
      var _a2;
      setLiveHasTracks((((_a2 = video.textTracks) == null ? void 0 : _a2.length) ?? 0) > 0);
    };
    video.addEventListener("loadedmetadata", checkTracks);
    video.addEventListener("loadeddata", checkTracks);
    const t2 = setTimeout(checkTracks, 500);
    return () => {
      video.removeEventListener("loadedmetadata", checkTracks);
      video.removeEventListener("loadeddata", checkTracks);
      clearTimeout(t2);
    };
  }, [selectedVideo == null ? void 0 : selectedVideo.id]);
  reactExports.useEffect(() => {
    if (selectedVideo) {
      const lang = detectLanguage({
        title: selectedVideo.title,
        description: selectedVideo.description
      });
      setDetectedLang(lang);
      if (translationTaskRef.current) {
        clearTimeout(translationTaskRef.current);
        translationTaskRef.current = null;
      }
      setTranslating(false);
      setCaptionsError(false);
      setCcEnabled(false);
      try {
        localStorage.setItem("sp_cc", "0");
      } catch {
      }
      const pref = (() => {
        try {
          return localStorage.getItem("subtitlePreference") || localStorage.getItem("subtitle_lang") || null;
        } catch {
          return null;
        }
      })();
      setSuggestionBanner({ videoLang: lang, preferredLang: pref });
    }
  }, [selectedVideo == null ? void 0 : selectedVideo.id]);
  reactExports.useEffect(() => {
    if (captionTracksError) setCaptionsError(true);
  }, [captionTracksError]);
  reactExports.useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => {
      setIsOnline(false);
      ue("No internet connection");
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);
  const resetControlsTimer = () => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    setControlsVisible(true);
    controlsTimerRef.current = setTimeout(
      () => setControlsVisible(false),
      3e3
    );
  };
  const toggleCc = () => {
    const hasAnyTracks = hasTracks || liveHasTracks;
    if (!hasAnyTracks) {
      ue("No captions available");
      resetControlsTimer();
      return;
    }
    setCcEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sp_cc", next ? "1" : "0");
      } catch {
      }
      return next;
    });
    resetControlsTimer();
  };
  const handleLangSelect = (lang) => {
    setSelectedLang(lang);
    try {
      localStorage.setItem("sp_caption_lang", lang);
      localStorage.setItem("subtitle_lang", lang);
    } catch {
    }
    setLangMenuOpen(false);
    if (!ccEnabled) {
      setCcEnabled(true);
      try {
        localStorage.setItem("sp_cc", "1");
      } catch {
      }
    }
    resetControlsTimer();
  };
  const handleSettingsSubtitleSelect = (lang) => {
    if (lang === "off") {
      setCcEnabled(false);
      try {
        localStorage.setItem("sp_cc", "0");
      } catch {
      }
      setSubtitleSubmenuOpen(false);
      setSettingsOpen(false);
      resetControlsTimer();
      return;
    }
    const isLocalTrack = captionTracks.some(
      (t2) => t2.language === lang && t2.vtt
    );
    if (!isOnline && !isLocalTrack) {
      ue("No internet connection — translation unavailable");
      setSubtitleSubmenuOpen(false);
      setSettingsOpen(false);
      resetControlsTimer();
      return;
    }
    if (translationTaskRef.current) clearTimeout(translationTaskRef.current);
    setTranslating(true);
    translationTaskRef.current = setTimeout(() => {
      try {
        setSelectedLang(lang);
        try {
          localStorage.setItem("sp_caption_lang", lang);
          localStorage.setItem("subtitle_lang", lang);
          localStorage.setItem("subtitlePreference", lang);
        } catch {
        }
        setCcEnabled(true);
        try {
          localStorage.setItem("sp_cc", "1");
        } catch {
        }
        setSuggestionBanner(null);
      } catch {
        ue.error("Translation failed. Previous subtitles kept.");
      } finally {
        setTranslating(false);
      }
    }, 600);
    setSubtitleSubmenuOpen(false);
    setSettingsOpen(false);
    resetControlsTimer();
  };
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) videoRef.current.playbackRate = speed;
    setSettingsOpen(false);
    resetControlsTimer();
  };
  const handleQualityChange = (q) => {
    setQuality(q);
    setSettingsOpen(false);
    resetControlsTimer();
  };
  const trackView = async (videoId) => {
    await Promise.all([
      incrementViews.mutateAsync(videoId).catch(() => {
      }),
      updateHistory.mutateAsync(videoId).catch(() => {
      })
    ]);
    const myPrincipal = identity == null ? void 0 : identity.getPrincipal().toString();
    if (myPrincipal && (selectedVideo == null ? void 0 : selectedVideo.creatorId) === myPrincipal) {
      const cachedVideos = queryClient.getQueryData(["videos", ""]) ?? [];
      const updated = cachedVideos.find((v) => v.id === videoId);
      if (updated) {
        const milestone = checkMilestone(videoId, Number(updated.views));
        if (milestone !== null) {
          ue.success(
            `🎉 Your video hit ${formatMilestone(milestone)} views!`,
            { duration: 6e3 }
          );
        }
      }
    }
  };
  reactExports.useEffect(() => {
    if (selectedVideo && !hasTracked.current) {
      hasTracked.current = true;
      trackView(selectedVideo.id);
      trackBehavior(selectedVideo.id, "click");
      if (isLoggedIn) {
        if (viewTimerRef.current) clearTimeout(viewTimerRef.current);
        viewTimerRef.current = setTimeout(() => {
          recordView.mutate(selectedVideo.id);
        }, 3e3);
      }
      watchStartRef.current = Date.now();
      const saved = getWatchProgress(selectedVideo.id);
      if (saved > 5 && videoRef.current) {
        videoRef.current.currentTime = saved;
      }
    }
  }, [selectedVideo]);
  reactExports.useEffect(() => {
    if (!selectedVideo) return;
    hasTracked.current = false;
    setCommentText("");
    if (viewTimerRef.current) clearTimeout(viewTimerRef.current);
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
      3e3
    );
    if (countdownRef.current) clearInterval(countdownRef.current);
    window.scrollTo({ top: 0 });
    setMiniPlayerActive(false);
  }, [selectedVideo == null ? void 0 : selectedVideo.id]);
  reactExports.useEffect(() => {
    return () => {
      if (selectedVideo && watchStartRef.current > 0) {
        const elapsed = (Date.now() - watchStartRef.current) / 1e3;
        if (elapsed < 10) {
          trackBehavior(selectedVideo.id, "skip");
        }
      }
    };
  }, [selectedVideo]);
  reactExports.useEffect(() => {
    const onScroll = () => {
      var _a2, _b2;
      if (!playerRef.current) return;
      const rect = playerRef.current.getBoundingClientRect();
      const sticky = rect.bottom < 0;
      setIsSticky(sticky);
      if (sticky && selectedVideo) {
        setMiniPlayerVideo(selectedVideo);
        setMiniPlayerActive(true);
        (_a2 = videoRef.current) == null ? void 0 : _a2.pause();
      } else if (!sticky) {
        setMiniPlayerActive(false);
        (_b2 = videoRef.current) == null ? void 0 : _b2.play().catch(() => {
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [selectedVideo, setMiniPlayerActive, setMiniPlayerVideo]);
  reactExports.useEffect(() => {
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
      setAutoplayCountdown((c) => c !== null ? c - 1 : null);
    }, 1e3);
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [autoplayCountdown, nextVideo]);
  if (!selectedVideo) {
    setPage("home");
    return null;
  }
  const _scheduledAtRaw = selectedVideo == null ? void 0 : selectedVideo.scheduledAt;
  const _scheduledAtMs = _scheduledAtRaw ? Number(_scheduledAtRaw) / 1e6 : null;
  const _isHardLocked = _scheduledAtMs && _scheduledAtMs > Date.now() || (selectedVideo == null ? void 0 : selectedVideo.status) === "scheduled" || (selectedVideo == null ? void 0 : selectedVideo.status) === "SCHEDULED";
  if (_isHardLocked || isUpcoming(selectedVideo)) {
    setPage("premiere-preview");
    return null;
  }
  const videoUrl = (_b = (_a = selectedVideo.videoBlob) == null ? void 0 : _a.getDirectURL) == null ? void 0 : _b.call(_a);
  const otherVideos = (allVideos ?? []).filter(
    (v) => v.id !== selectedVideo.id
  );
  const recommendedIds = getRecommendedVideoIds(
    otherVideos.map((v) => ({ id: v.id, creatorId: v.creatorId })),
    8
  );
  const recommended = recommendedIds.map((id) => otherVideos.find((v) => v.id === id)).filter((v) => !!v);
  const duration = videoDuration ?? 0;
  const pct = duration > 0 ? currentTime / duration * 100 : 0;
  const displayPct = dragPct !== null ? dragPct : pct;
  function getPctFromPointer(e) {
    var _a2;
    const rect = (_a2 = trackRef.current) == null ? void 0 : _a2.getBoundingClientRect();
    if (!rect) return 0;
    const raw = (e.clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(1, raw)) * 100;
  }
  function handleTrackPointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    const p = getPctFromPointer(e);
    setDragPct(p);
    setCurrentTime(p / 100 * duration);
    resetControlsTimer();
  }
  function handleTrackPointerMove(e) {
    if (!isDraggingRef.current) return;
    const p = getPctFromPointer(e);
    setDragPct(p);
    setCurrentTime(p / 100 * duration);
  }
  function handleTrackPointerUp(e) {
    if (!isDraggingRef.current) return;
    const p = getPctFromPointer(e);
    isDraggingRef.current = false;
    setDragPct(null);
    if (videoRef.current) {
      videoRef.current.currentTime = p / 100 * duration;
      setCurrentTime(p / 100 * duration);
    }
    resetControlsTimer();
  }
  const handleVideoTap = (e) => {
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
          700
        );
        resetControlsTimer();
      } else {
        if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
        setControlsVisible((prev) => {
          if (prev) {
            return false;
          }
          controlsTimerRef.current = setTimeout(
            () => setControlsVisible(false),
            3e3
          );
          return true;
        });
      }
    }, 250);
  };
  const handlePrevVideo = () => {
    if (!allVideos || allVideos.length === 0) return;
    const currentIndex = allVideos.findIndex(
      (v) => v.id === selectedVideo.id
    );
    const prevIndex = (currentIndex - 1 + allVideos.length) % allVideos.length;
    handleSelectVideo(allVideos[prevIndex]);
  };
  const handleNextVideo = () => {
    if (recommended.length > 0) {
      handleSelectVideo(recommended[0]);
    } else if (allVideos && allVideos.length > 0) {
      const currentIndex = allVideos.findIndex(
        (v) => v.id === selectedVideo.id
      );
      const nextIndex = (currentIndex + 1) % allVideos.length;
      handleSelectVideo(allVideos[nextIndex]);
    }
  };
  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (selectedVideo) trackBehavior(selectedVideo.id, "watchTime", 1);
    if (recommended.length > 0) {
      setNextVideo(recommended[0]);
      setAutoplayCountdown(7);
    }
  };
  const handleTimeUpdate = (e) => {
    const vid = e.currentTarget;
    if (!selectedVideo || !vid.duration) return;
    if (!isDraggingRef.current) {
      setCurrentTime(vid.currentTime);
    }
    const now = Date.now();
    if (now - lastSaveRef.current >= 2e3) {
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
      vid.play().catch(() => {
      });
    } else {
      vid.pause();
    }
    resetControlsTimer();
  };
  const cancelAutoplay = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setAutoplayCountdown(null);
    setNextVideo(null);
  };
  const handleLike = async () => {
    if (!isLoggedIn) {
      ue.error("Please log in to like videos");
      return;
    }
    if (!selectedVideo) return;
    likeVideoMutation.mutate(selectedVideo.id);
    trackBehavior(selectedVideo.id, "like");
  };
  const handleDislike = async () => {
    if (!isLoggedIn) {
      ue.error("Please log in to react");
      return;
    }
    if (!selectedVideo) return;
    dislikeVideoMutation.mutate(selectedVideo.id);
  };
  const handleShare = async () => {
    if (!selectedVideo) return;
    const url = window.location.href;
    const title = selectedVideo.title;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {
      });
    } else {
      await navigator.clipboard.writeText(url).catch(() => {
      });
      ue.success("Link copied");
    }
  };
  const handleDownload = () => {
    if (!selectedVideo) return;
    const url = videoUrl;
    if (!url || url.startsWith("blob:")) {
      ue.error("Download not available");
      return;
    }
    ue.info("Downloading...");
    const filename = `${selectedVideo.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.mp4`;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const handleComment = async () => {
    if (!commentText.trim()) return;
    if (!isLoggedIn) {
      ue.error("Please log in to comment");
      return;
    }
    if (!selectedVideo) return;
    trackBehavior(selectedVideo.id, "comment");
    const text = commentText.trim();
    setCommentText("");
    postCommentMutation.mutate({ videoId: selectedVideo.id, text });
  };
  const handleSelectVideo = (video) => {
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
        body: `You'll be notified of new videos from ${selectedVideo.creatorName || "this creator"}`,
        videoId: selectedVideo.id
      });
      setNotifTick((t2) => t2 + 1);
      ue.success(`Subscribed to ${selectedVideo.creatorName || "creator"}`);
    } else {
      ue(`Unsubscribed from ${selectedVideo.creatorName || "creator"}`);
    }
  };
  const nextThumb = (_d = (_c = nextVideo == null ? void 0 : nextVideo.thumbnailBlob) == null ? void 0 : _c.getDirectURL) == null ? void 0 : _d.call(_c);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      "data-ocid": "player.page",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 bg-background sticky top-0 z-10 border-b border-border/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "player.back_button",
              onClick: () => setPage("home"),
              className: "p-2 rounded-full hover:bg-surface2 transition-colors text-foreground",
              "aria-label": "Go back",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold truncate flex-1 text-foreground", children: selectedVideo.title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: playerRef, className: "w-full bg-black", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: videoContainerRef,
            className: "relative w-full aspect-video",
            onClick: handleVideoTap,
            children: [
              videoUrl ? (
                // biome-ignore lint/a11y/useMediaCaption: user-uploaded content
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "video",
                  {
                    ref: videoRef,
                    "data-ocid": "player.canvas_target",
                    src: videoUrl,
                    autoPlay: true,
                    playsInline: true,
                    style: { pointerEvents: "none", zIndex: 1 },
                    className: "w-full h-full object-contain",
                    onEnded: handleVideoEnded,
                    onTimeUpdate: handleTimeUpdate,
                    onPlay: () => {
                      setIsPlaying(true);
                      resetControlsTimer();
                    },
                    onPause: () => {
                      setIsPlaying(false);
                      setControlsVisible(true);
                      if (controlsTimerRef.current)
                        clearTimeout(controlsTimerRef.current);
                    },
                    onLoadedMetadata: (e) => {
                      const d = e.currentTarget.duration;
                      if (d && Number.isFinite(d)) {
                        setVideoDuration(d);
                      }
                      setLiveHasTracks(e.currentTarget.textTracks.length > 0);
                    },
                    children: (activeTrack == null ? void 0 : activeTrack.vtt) && captionBlobUrlRef.current && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "track",
                      {
                        kind: "subtitles",
                        src: captionBlobUrlRef.current,
                        default: false,
                        label: (activeTrack == null ? void 0 : activeTrack.captionLabel) ?? "Captions",
                        srcLang: (activeTrack == null ? void 0 : activeTrack.language) ?? "en"
                      },
                      captionBlobUrlRef.current
                    )
                  }
                )
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center bg-black", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-sm", children: "Video unavailable" }) }),
              translating && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute inset-0 flex items-center justify-center pointer-events-none",
                  style: { zIndex: 25 },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/75 rounded-xl px-4 py-2.5 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "svg",
                      {
                        role: "img",
                        "aria-label": "Translating",
                        className: "animate-spin w-4 h-4 text-orange-400",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10", strokeOpacity: "0.25" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2a10 10 0 0 1 10 10", strokeLinecap: "round" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-sm font-medium", children: "Translating..." })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "absolute inset-0 pointer-events-none transition-opacity duration-300",
                  style: { opacity: controlsVisible ? 1 : 0, zIndex: 10 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "absolute inset-0 pointer-events-none",
                        style: {
                          background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.65) 100%)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "absolute inset-0 flex items-center justify-center gap-10",
                        style: {
                          pointerEvents: controlsVisible ? "auto" : "none",
                          zIndex: 20
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: (e) => {
                                e.stopPropagation();
                                handlePrevVideo();
                              },
                              className: "text-white drop-shadow-lg active:scale-90 transition-transform",
                              "aria-label": "Previous video",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipBack, { size: 32, fill: "white" })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              "data-ocid": "player.toggle",
                              onClick: (e) => {
                                e.stopPropagation();
                                handlePlayPause();
                              },
                              className: "text-white drop-shadow-lg active:scale-90 transition-transform",
                              "aria-label": isPlaying ? "Pause" : "Play",
                              children: isPlaying ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 44, fill: "white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 44, fill: "white" })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: (e) => {
                                e.stopPropagation();
                                handleNextVideo();
                              },
                              className: "text-white drop-shadow-lg active:scale-90 transition-transform",
                              "aria-label": "Next video",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipForward, { size: 32, fill: "white" })
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "absolute bottom-0 left-0 right-0 px-3 pb-3 flex flex-col gap-1",
                        style: {
                          pointerEvents: controlsVisible ? "auto" : "none",
                          zIndex: 20
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              ref: trackRef,
                              "data-ocid": "player.canvas_target",
                              role: "slider",
                              "aria-label": "Video progress",
                              "aria-valuenow": Math.round(displayPct),
                              "aria-valuemin": 0,
                              "aria-valuemax": 100,
                              tabIndex: 0,
                              className: "relative flex items-center cursor-pointer select-none",
                              style: { height: "20px" },
                              onClick: (e) => e.stopPropagation(),
                              onPointerDown: (e) => {
                                e.stopPropagation();
                                handleTrackPointerDown(e);
                              },
                              onPointerMove: handleTrackPointerMove,
                              onPointerUp: (e) => {
                                e.stopPropagation();
                                handleTrackPointerUp(e);
                              },
                              onPointerCancel: (e) => {
                                e.stopPropagation();
                                handleTrackPointerUp(e);
                              },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    className: "absolute inset-x-0 rounded-full",
                                    style: {
                                      height: "4px",
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      background: `linear-gradient(to right, #FF0000 ${displayPct}%, rgba(255,255,255,0.7) ${displayPct}%)`
                                    }
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "div",
                                  {
                                    className: "absolute rounded-full pointer-events-none",
                                    style: {
                                      width: "14px",
                                      height: "14px",
                                      background: "#FF0000",
                                      left: `calc(${displayPct}% - 7px)`,
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      boxShadow: "0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(255,0,0,0.4)"
                                    }
                                  }
                                )
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "text-white text-xs tabular-nums",
                                style: { fontVariantNumeric: "tabular-nums" },
                                children: duration > 0 ? formatDuration(
                                  dragPct !== null ? dragPct / 100 * duration : currentTime
                                ) : "0:00"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "text-white text-xs tabular-nums",
                                style: { fontVariantNumeric: "tabular-nums" },
                                children: duration > 0 ? formatDuration(duration) : "0:00"
                              }
                            )
                          ] })
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "absolute top-3 right-3 flex items-center gap-2",
                  style: { zIndex: 30, pointerEvents: "auto" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          "data-ocid": "player.toggle",
                          onClick: (e) => {
                            e.stopPropagation();
                            toggleCc();
                            setLangMenuOpen(false);
                          },
                          className: `flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${hasTracks || liveHasTracks ? ccEnabled ? "bg-orange-500/90 text-white border-orange-400/60" : "bg-black/60 text-white/70 border-white/20 hover:border-white/40" : "bg-black/40 text-white/30 border-white/10 cursor-default"}`,
                          "aria-label": "Toggle captions",
                          children: [
                            translating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "svg",
                              {
                                role: "img",
                                "aria-label": "Loading",
                                className: "animate-spin",
                                width: "13",
                                height: "13",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10", strokeOpacity: "0.25" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2a10 10 0 0 1 10 10" })
                                ]
                              }
                            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Captions, { size: 13 }),
                            translating ? "···" : ccEnabled && (hasTracks || liveHasTracks) ? `CC·${getLangShort(selectedLang)}` : "CC",
                            !translating && (hasTracks || liveHasTracks) && captionTracks.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 10, className: "ml-0.5" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: langMenuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "fixed inset-0",
                            style: { zIndex: 45 },
                            role: "presentation",
                            onClick: (e) => {
                              e.stopPropagation();
                              setLangMenuOpen(false);
                            },
                            onKeyDown: (e) => {
                              if (e.key === "Escape") {
                                e.stopPropagation();
                                setLangMenuOpen(false);
                              }
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          motion.div,
                          {
                            "data-ocid": "player.dropdown_menu",
                            initial: { opacity: 0, y: -4, scale: 0.96 },
                            animate: { opacity: 1, y: 0, scale: 1 },
                            exit: { opacity: 0, y: -4, scale: 0.96 },
                            transition: { duration: 0.12 },
                            className: "absolute top-9 right-0 bg-black/95 border border-white/20 rounded-xl shadow-lg overflow-hidden min-w-[140px]",
                            style: { zIndex: 50 },
                            onClick: (e) => e.stopPropagation(),
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => {
                                    toggleCc();
                                    setLangMenuOpen(false);
                                  },
                                  className: "w-full text-left px-3 py-2 text-xs hover:bg-white/10 flex items-center justify-between border-b border-white/10",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/80", children: "Captions" }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "span",
                                      {
                                        className: `text-[10px] font-bold ${ccEnabled ? "text-orange-400" : "text-white/40"}`,
                                        children: ccEnabled ? "ON" : "OFF"
                                      }
                                    )
                                  ]
                                }
                              ),
                              captionTracks.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => {
                                    handleLangSelect(t2.language);
                                    setLangMenuOpen(false);
                                  },
                                  className: `w-full text-left px-3 py-2 text-xs hover:bg-white/10 flex items-center justify-between ${ccEnabled && selectedLang === t2.language ? "text-orange-400 font-bold" : "text-white/80"}`,
                                  children: [
                                    t2.captionLabel || t2.language,
                                    ccEnabled && selectedLang === t2.language && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 11, className: "text-orange-400" })
                                  ]
                                },
                                t2.language
                              ))
                            ]
                          }
                        )
                      ] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: (e) => {
                          e.stopPropagation();
                          setSettingsOpen((o) => !o);
                          setSubtitleSubmenuOpen(false);
                          setLangMenuOpen(false);
                          resetControlsTimer();
                        },
                        className: `w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors ${settingsOpen ? "bg-white/20" : "bg-black/50 hover:bg-black/70"}`,
                        "aria-label": "Settings",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 16 })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: settingsOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "fixed inset-0",
                          style: { zIndex: 40 },
                          role: "presentation",
                          onClick: (e) => {
                            e.stopPropagation();
                            setSettingsOpen(false);
                            setSubtitleSubmenuOpen(false);
                          },
                          onKeyDown: (e) => {
                            if (e.key === "Escape") {
                              e.stopPropagation();
                              setSettingsOpen(false);
                              setSubtitleSubmenuOpen(false);
                            }
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        motion.div,
                        {
                          initial: { opacity: 0, y: -6, scale: 0.96 },
                          animate: { opacity: 1, y: 0, scale: 1 },
                          exit: { opacity: 0, y: -6, scale: 0.96 },
                          transition: { duration: 0.12 },
                          className: "absolute top-10 right-0 bg-black/95 border border-white/15 rounded-2xl shadow-2xl overflow-hidden w-52",
                          style: { zIndex: 50 },
                          onClick: (e) => e.stopPropagation(),
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pt-3 pb-1 border-b border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-white tracking-wide", children: "Settings" }) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pt-3 pb-1", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-2", children: "Speed" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: [0.5, 1, 1.25, 1.5, 2].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => handleSpeedChange(s),
                                  className: `px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${playbackSpeed === s ? "bg-orange-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`,
                                  children: s === 1 ? "1x" : `${s}x`
                                },
                                s
                              )) })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-white/10 mx-3 my-2" }),
                              captionsError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pb-2", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1.5", children: "Subtitles" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400/80 italic mb-2", children: "Captions unavailable" })
                              ] }) : !(hasTracks || liveHasTracks) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pb-2", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1.5", children: "Subtitles" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/30 italic mb-2", children: "Auto captions unavailable" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: (e) => {
                                      e.stopPropagation();
                                      setSettingsOpen(false);
                                      setCaptionModalOpen(true);
                                    },
                                    className: "w-full text-center text-xs text-orange-400 hover:text-orange-300 border border-orange-400/30 hover:border-orange-400/50 rounded-lg py-1.5 transition-colors",
                                    children: "+ Upload .vtt captions"
                                  }
                                )
                              ] }) : !subtitleSubmenuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "button",
                                {
                                  type: "button",
                                  onClick: (e) => {
                                    e.stopPropagation();
                                    setSubtitleSubmenuOpen(true);
                                  },
                                  className: "w-full flex items-center justify-between py-1 text-white/80 hover:text-white transition-colors",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest font-semibold text-white/40", children: "Subtitles" }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs font-semibold text-white/70", children: [
                                      ccEnabled ? selectedLang === detectedLang ? `Auto · ${getLangShort(detectedLang)}` : getLangLabel(selectedLang) : "Off",
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                        ChevronRight,
                                        {
                                          size: 12,
                                          className: "text-white/40"
                                        }
                                      )
                                    ] })
                                  ]
                                }
                              ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pb-2", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "button",
                                    {
                                      type: "button",
                                      onClick: (e) => {
                                        e.stopPropagation();
                                        setSubtitleSubmenuOpen(false);
                                      },
                                      className: "w-5 h-5 flex items-center justify-center text-white/60 hover:text-white transition-colors",
                                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 14 })
                                    }
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40 uppercase tracking-widest font-semibold", children: "Subtitles" })
                                ] }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: (() => {
                                  const pref = (() => {
                                    try {
                                      return localStorage.getItem(
                                        "subtitlePreference"
                                      ) || localStorage.getItem("subtitle_lang") || null;
                                    } catch {
                                      return null;
                                    }
                                  })();
                                  const standardLangs = [
                                    { code: "en", label: "English" },
                                    { code: "hi", label: "Hindi" },
                                    { code: "ar", label: "Arabic" },
                                    { code: "es", label: "Spanish" },
                                    { code: "fr", label: "French" },
                                    { code: "zh", label: "Chinese" }
                                  ];
                                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                      "button",
                                      {
                                        type: "button",
                                        onClick: () => handleSettingsSubtitleSelect("off"),
                                        className: `flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${!ccEnabled ? "bg-orange-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`,
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Off" }),
                                          !ccEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12 })
                                        ]
                                      }
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                      "button",
                                      {
                                        type: "button",
                                        onClick: () => handleSettingsSubtitleSelect(detectedLang),
                                        className: `flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${ccEnabled && selectedLang === detectedLang ? "bg-orange-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`,
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 truncate mr-2", children: [
                                            "Original",
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-white/50 font-normal", children: [
                                              "(",
                                              getLangLabel(detectedLang),
                                              ")"
                                            ] })
                                          ] }),
                                          ccEnabled && selectedLang === detectedLang && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12 })
                                        ]
                                      }
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-white/10 my-1" }),
                                    standardLangs.map((lang) => {
                                      const hasTrack = captionTracks.some(
                                        (t2) => t2.language === lang.code
                                      );
                                      const isActive = ccEnabled && selectedLang === lang.code;
                                      const isPreferred = pref === lang.code;
                                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                        "button",
                                        {
                                          type: "button",
                                          onClick: () => handleSettingsSubtitleSelect(
                                            lang.code
                                          ),
                                          className: `flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isActive ? "bg-orange-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`,
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                                              isPreferred && !isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" }),
                                              lang.label,
                                              hasTrack && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] bg-orange-500/30 text-orange-300 px-1 rounded", children: "VTT" })
                                            ] }),
                                            isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12 })
                                          ]
                                        },
                                        lang.code
                                      );
                                    })
                                  ] });
                                })() })
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-white/10 mx-3 my-2" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pb-3", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-2", children: "Quality" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: ["Auto", "480p", "720p", "1080p"].map(
                                (q) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => handleQualityChange(q),
                                    className: `px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${quality === q ? "bg-orange-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`,
                                    children: q
                                  },
                                  q
                                )
                              ) })
                            ] })
                          ]
                        }
                      )
                    ] }) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: seekFeedback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0.9, scale: 0.9 },
                  animate: { opacity: 0.9, scale: 1 },
                  exit: { opacity: 0 },
                  transition: { duration: 0.15 },
                  className: "absolute top-1/2 -translate-y-1/2 pointer-events-none",
                  style: {
                    [seekFeedback.side === "left" ? "left" : "right"]: "12%"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/60 rounded-full px-3 py-1.5 text-white text-xs font-bold", children: seekFeedback.side === "left" ? "−10s" : "+10s" })
                },
                seekFeedback.key
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: autoplayCountdown !== null && nextVideo && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  className: "absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3",
                  children: [
                    nextThumb && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: nextThumb,
                        alt: "",
                        className: "w-24 h-16 object-cover rounded-lg opacity-80"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-12 h-12", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "svg",
                        {
                          "aria-hidden": "true",
                          className: "w-12 h-12 -rotate-90",
                          viewBox: "0 0 48 48",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "circle",
                              {
                                cx: "24",
                                cy: "24",
                                r: "20",
                                fill: "none",
                                stroke: "rgba(255,255,255,0.2)",
                                strokeWidth: "4"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              motion.circle,
                              {
                                cx: "24",
                                cy: "24",
                                r: "20",
                                fill: "none",
                                stroke: "oklch(0.68 0.18 35)",
                                strokeWidth: "4",
                                strokeLinecap: "round",
                                strokeDasharray: 125.6,
                                strokeDashoffset: 125.6 - 125.6 * autoplayCountdown / 7
                              }
                            )
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 flex items-center justify-center text-white font-bold text-sm", children: autoplayCountdown })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/60 uppercase tracking-widest font-semibold", children: "Up Next" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-semibold text-sm text-center line-clamp-2 max-w-[220px]", children: nextVideo.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "player.cancel_button",
                        onClick: cancelAutoplay,
                        className: "flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors mt-1",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 }),
                          "Cancel autoplay"
                        ]
                      }
                    )
                  ]
                }
              ) })
            ]
          }
        ) }),
        isSticky && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-zinc-900/80 border-b border-white/5 px-4 py-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate flex-1", children: "Playing in mini-player" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
              className: "text-xs text-orange-400 font-medium ml-2 flex-shrink-0",
              children: "Scroll up"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-32", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 16px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-foreground font-bold text-base leading-snug", children: selectedVideo.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "player.link",
                  onClick: () => {
                    setChannelCreatorId(selectedVideo.creatorId);
                    setPage("channel");
                  },
                  className: "text-sm text-muted-foreground hover:text-orange transition-colors font-medium",
                  children: selectedVideo.creatorName || "Unknown"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 11 }),
                formatViews(selectedVideo.views),
                " views"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: timeAgo(selectedVideo.uploadTime) }),
              videoDuration !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 11 }),
                  formatDuration(videoDuration)
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "player.toggle",
                onClick: handleSubscribe,
                className: `mt-2 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${subscribed ? "bg-orange text-white" : "border border-border text-foreground hover:bg-surface2"}`,
                children: subscribed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12 }),
                  " Subscribed"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Subscribe" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                width: "100%",
                height: "1px",
                background: "rgba(255,255,255,0.1)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                width: "100%",
                height: "1px",
                background: "rgba(255,255,255,0.1)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "10px 16px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 overflow-x-auto no-scrollbar", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "player.like_button",
                onClick: handleLike,
                className: `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${liked ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40" : "bg-surface2 text-foreground hover:bg-surface2/80"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsUp, { size: 15 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: likeCount > 0 ? likeCount.toLocaleString() : "Like" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "player.secondary_button",
                onClick: handleDislike,
                className: `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${disliked ? "bg-surface2 text-orange-400 border border-orange-400/40" : "bg-surface2 text-foreground hover:bg-surface2/80"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsDown, { size: 15 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: dislikeCount > 0 ? dislikeCount.toLocaleString() : "Dislike" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "player.share_button",
                onClick: handleShare,
                className: "flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface2 text-foreground hover:bg-surface2/80 text-sm font-medium transition-colors flex-shrink-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 15 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Share" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "player.save_button",
                onClick: () => setSaveSheetOpen(true),
                className: "flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface2 text-foreground hover:bg-surface2/80 text-sm font-medium transition-colors flex-shrink-0",
                children: [
                  isVideoInAnyPlaylist(selectedVideo.id) ? /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkCheck, { size: 15, className: "text-orange" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { size: 15 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Save" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "player.download_button",
                onClick: handleDownload,
                className: "flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface2 text-foreground hover:bg-surface2/80 text-sm font-medium transition-colors flex-shrink-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 15 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Download" })
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                width: "100%",
                height: "1px",
                background: "rgba(255,255,255,0.1)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "12px 16px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "w-full text-left text-sm text-muted-foreground",
              onClick: () => setShowDesc((s) => !s),
              children: [
                showDesc ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "whitespace-pre-line leading-relaxed", children: selectedVideo.description || "No description provided." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-3 leading-relaxed", children: selectedVideo.description || "No description provided." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent ml-1 font-semibold text-xs", children: showDesc ? " Show less" : " Show more" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                width: "100%",
                height: "1px",
                background: "rgba(255,255,255,0.1)"
              }
            }
          ),
          suggestionBanner && !ccEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "8px 16px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              "data-ocid": "player.card",
              initial: { opacity: 0, y: -8 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -8 },
              transition: { duration: 0.2 },
              className: "flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-[#1e1e1e] border border-white/10",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/75 leading-snug flex-1", children: suggestionBanner.preferredLang && suggestionBanner.preferredLang !== suggestionBanner.videoLang ? `This video is in ${getLangLabel(suggestionBanner.videoLang)}. Watch with ${getLangLabel(suggestionBanner.preferredLang)} subtitles?` : `This video is in ${getLangLabel(suggestionBanner.videoLang)}. Enable subtitles?` }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "player.primary_button",
                      onClick: () => {
                        const lang = suggestionBanner.preferredLang && suggestionBanner.preferredLang !== suggestionBanner.videoLang ? suggestionBanner.preferredLang : suggestionBanner.videoLang;
                        setTranslating(true);
                        setTimeout(() => {
                          setSelectedLang(lang);
                          try {
                            localStorage.setItem("sp_caption_lang", lang);
                            localStorage.setItem("subtitle_lang", lang);
                            localStorage.setItem("subtitlePreference", lang);
                            localStorage.setItem("sp_cc", "1");
                          } catch {
                          }
                          setCcEnabled(true);
                          setTranslating(false);
                          setSuggestionBanner(null);
                        }, 600);
                      },
                      className: "px-2.5 py-1 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-400 transition-colors",
                      children: [
                        "Enable",
                        " ",
                        suggestionBanner.preferredLang && suggestionBanner.preferredLang !== suggestionBanner.videoLang ? getLangLabel(suggestionBanner.preferredLang) : getLangLabel(suggestionBanner.videoLang),
                        " ",
                        "Subtitles"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "player.close_button",
                      onClick: () => setSuggestionBanner(null),
                      className: "w-6 h-6 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors",
                      "aria-label": "Dismiss",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 })
                    }
                  )
                ] })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "10px 16px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Captions,
                {
                  size: 14,
                  className: "text-muted-foreground flex-shrink-0"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: hasTracks ? `Captions: ${captionTracks.map((t2) => t2.captionLabel || t2.language).join(", ")}` : "No captions yet" })
            ] }),
            isCreator && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "captions.open_modal_button",
                onClick: () => setCaptionModalOpen(true),
                className: "flex-shrink-0 px-3 py-1 rounded-lg bg-orange/10 text-orange text-xs font-semibold hover:bg-orange/20 transition-colors border border-orange/25",
                children: hasTracks ? "Manage" : "Add Captions"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                width: "100%",
                height: "1px",
                background: "rgba(255,255,255,0.1)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 16px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 15, className: "text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold", children: [
                commentList.length,
                " Comment",
                commentList.length !== 1 ? "s" : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              commentList.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: t("comment.noComments") }),
              commentList.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CommentItem, { comment: c, index: i + 1, userLang }),
                i < commentList.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: "100%",
                      height: "1px",
                      background: "rgba(255,255,255,0.07)",
                      margin: "8px 0"
                    }
                  }
                )
              ] }, c.id || i))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                width: "100%",
                height: "1px",
                background: "rgba(255,255,255,0.1)"
              }
            }
          ),
          recommended.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 16px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-3", children: "Recommended for You" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: recommended.map((video, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              VideoCard,
              {
                video,
                index: index + 1,
                onClick: () => handleSelectVideo(video)
              },
              video.id
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "player.comment_bar",
            className: "fixed left-0 right-0 z-40 flex items-center gap-2 px-3 py-2 border-t border-border/40 max-w-[430px] mx-auto",
            style: {
              bottom: "64px",
              backgroundColor: "#121212",
              paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-7 h-7 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-accent/20 text-accent text-[10px] font-bold", children: "ME" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  "data-ocid": "player.textarea",
                  type: "text",
                  value: commentText,
                  onChange: (e) => setCommentText(e.target.value),
                  onFocus: (e) => {
                    setTimeout(() => {
                      e.target.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    }, 300);
                  },
                  onKeyDown: (e) => {
                    if (e.key === "Enter" && commentText.trim()) handleComment();
                  },
                  placeholder: t("comment.placeholder"),
                  className: "flex-1 h-9 rounded-full px-4 text-sm",
                  style: {
                    backgroundColor: "#1a1a1a",
                    color: "#ffffff",
                    border: "1px solid #333",
                    outline: "none"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "player.submit_button",
                  onClick: handleComment,
                  disabled: !commentText.trim(),
                  className: "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors disabled:opacity-30",
                  style: { backgroundColor: commentText.trim() ? "#f97316" : "#333" },
                  "aria-label": "Post comment",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SendHorizontal, { size: 16, className: "text-white" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AddToPlaylistModal,
          {
            videoId: selectedVideo.id,
            open: saveSheetOpen,
            onClose: () => setSaveSheetOpen(false)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: captionModalOpen, onOpenChange: setCaptionModalOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          SheetContent,
          {
            side: "bottom",
            className: "h-auto max-h-[85vh] overflow-y-auto bg-background border-t border-border/50 rounded-t-2xl px-4 pb-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "text-left text-base font-bold", children: "Add Captions" }) }),
              selectedVideo && /* @__PURE__ */ jsxRuntimeExports.jsx(
                CaptionManager,
                {
                  videoId: selectedVideo.id,
                  onSaved: () => setCaptionModalOpen(false)
                }
              )
            ]
          }
        ) })
      ]
    }
  );
}
export {
  VideoPlayerPage
};
