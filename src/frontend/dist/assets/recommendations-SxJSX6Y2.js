import { d as createLucideIcon, r as reactExports, j as jsxRuntimeExports, A as AnimatePresence, m as motion, X, ac as Check, I as Input, e as ue, u as useApp, C as isUpcoming, w as getPublishTimeMs, F as Avatar, H as AvatarFallback, x as formatPremiereCountdown } from "./index-DSOyFnVG.js";
import { g as getPlaylists, i as isVideoInPlaylist, a as addVideoToPlaylist, c as createPlaylist, b as isVideoInAnyPlaylist } from "./playlists-BxogQr83.js";
import { L as Lock } from "./lock-QCMAnrix.js";
import { B as Bookmark } from "./bookmark-CXa_WCMS.js";
import { P as Plus } from "./plus-ChHCscM6.js";
import { C as Clock } from "./clock-_PitsIeG.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z", key: "169p4p" }],
  ["path", { d: "m9 10 2 2 4-4", key: "1gnqz4" }]
];
const BookmarkCheck = createLucideIcon("bookmark-check", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M11 12H3", key: "51ecnj" }],
  ["path", { d: "M16 6H3", key: "1wxfjs" }],
  ["path", { d: "M16 18H3", key: "12xzn7" }],
  ["path", { d: "M18 9v6", key: "1twb98" }],
  ["path", { d: "M21 12h-6", key: "bt1uis" }]
];
const ListPlus = createLucideIcon("list-plus", __iconNode);
function AddToPlaylistModal({
  videoId,
  open,
  onClose
}) {
  const [playlists, setPlaylists] = reactExports.useState(() => getPlaylists());
  const [newTitle, setNewTitle] = reactExports.useState("");
  const [newPrivacy, setNewPrivacy] = reactExports.useState("public");
  const [creating, setCreating] = reactExports.useState(false);
  const refresh = () => setPlaylists(getPlaylists());
  const handleSelectPlaylist = (plId, plTitle) => {
    const inList = isVideoInPlaylist(plId, videoId);
    if (inList) {
      ue.info(`Already in "${plTitle}"`);
    } else {
      addVideoToPlaylist(plId, videoId);
      refresh();
      ue.success(`Added to "${plTitle}"`);
    }
  };
  const handleCreateAndAdd = () => {
    if (!newTitle.trim()) return;
    const pl = createPlaylist(newTitle.trim(), newPrivacy);
    addVideoToPlaylist(pl.id, videoId);
    refresh();
    ue.success(`Added to "${pl.title}"`);
    setNewTitle("");
    setNewPrivacy("public");
    setCreating(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-50 bg-black/70",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        "data-ocid": "playlist.modal",
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
        transition: { type: "spring", damping: 30, stiffness: 300 },
        className: "fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] rounded-t-2xl max-h-[80vh] flex flex-col max-w-[430px] mx-auto border-t border-white/10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3.5 border-b border-white/10 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkCheck, { size: 16, className: "text-orange" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-white", children: "Save to playlist" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "playlist.close_button",
                onClick: onClose,
                className: "p-1.5 rounded-full hover:bg-white/10 transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18, className: "text-white/70" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: playlists.map((pl) => {
            const inList = isVideoInPlaylist(pl.id, videoId);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "playlist.toggle",
                onClick: () => handleSelectPlaylist(pl.id, pl.title),
                className: "w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0", children: pl.privacy === "private" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 15, className: "text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bookmark,
                    {
                      size: 15,
                      className: inList ? "text-orange" : "text-muted-foreground"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 text-left", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-white truncate", children: pl.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-white/40", children: [
                      pl.videoIds.length,
                      " video",
                      pl.videoIds.length !== 1 ? "s" : "",
                      pl.privacy === "private" ? " · Private" : ""
                    ] })
                  ] }),
                  inList && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16, className: "text-orange flex-shrink-0" })
                ]
              },
              pl.id
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-white/10 flex-shrink-0", children: !creating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": "playlist.open_modal_button",
              onClick: () => setCreating(true),
              className: "w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-orange/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListPlus, { size: 15, className: "text-orange" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-orange", children: "Create new playlist" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "playlist.input",
                autoFocus: true,
                value: newTitle,
                onChange: (e) => setNewTitle(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && handleCreateAndAdd(),
                placeholder: "Playlist name...",
                className: "bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-orange h-9 text-sm"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/50", children: "Privacy:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "playlist.toggle",
                  onClick: () => setNewPrivacy("public"),
                  className: `px-3 py-1 rounded-full text-xs font-medium transition-colors ${newPrivacy === "public" ? "bg-orange text-white" : "bg-white/10 text-white/60 hover:bg-white/15"}`,
                  children: "Public"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "playlist.toggle",
                  onClick: () => setNewPrivacy("private"),
                  className: `px-3 py-1 rounded-full text-xs font-medium transition-colors ${newPrivacy === "private" ? "bg-orange text-white" : "bg-white/10 text-white/60 hover:bg-white/15"}`,
                  children: "Private"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "playlist.cancel_button",
                  onClick: () => {
                    setCreating(false);
                    setNewTitle("");
                  },
                  className: "text-xs text-white/40 hover:text-white/60 transition-colors",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "playlist.confirm_button",
                  onClick: handleCreateAndAdd,
                  disabled: !newTitle.trim(),
                  className: "flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange text-white text-xs font-semibold disabled:opacity-40 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
                    " Create & Add"
                  ]
                }
              )
            ] })
          ] }) })
        ]
      }
    )
  ] }) });
}
function formatViews(views) {
  const n = Number(views);
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return `${n}`;
}
function timeAgo(uploadTime) {
  const ms = Number(uploadTime) / 1e6;
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 6e4);
  const hours = Math.floor(diff / 36e5);
  const days = Math.floor(diff / 864e5);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function useDuration(url) {
  const [duration, setDuration] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!url) return;
    const videoEl = document.createElement("video");
    videoEl.preload = "metadata";
    videoEl.muted = true;
    const onLoaded = () => {
      const d = videoEl.duration;
      if (d && Number.isFinite(d)) {
        setDuration(d);
      } else {
        setDuration(null);
      }
      cleanup();
    };
    const onError = () => {
      setDuration(null);
      cleanup();
    };
    const cleanup = () => {
      videoEl.removeEventListener("loadedmetadata", onLoaded);
      videoEl.removeEventListener("error", onError);
      videoEl.src = "";
      videoEl.load();
    };
    videoEl.addEventListener("loadedmetadata", onLoaded);
    videoEl.addEventListener("error", onError);
    videoEl.src = url;
    return cleanup;
  }, [url]);
  return duration;
}
function usePremiereCountdown(publishTimeMs) {
  const [countdown, setCountdown] = reactExports.useState(
    () => publishTimeMs ? formatPremiereCountdown(publishTimeMs) : ""
  );
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!publishTimeMs) return;
    const tick = () => setCountdown(formatPremiereCountdown(publishTimeMs));
    tick();
    timerRef.current = setInterval(tick, 1e3);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [publishTimeMs]);
  return countdown;
}
function VideoCard({ video, index, onClick, progress }) {
  var _a, _b, _c, _d;
  const { setPage, setSelectedVideo } = useApp();
  const thumbUrl = (_b = (_a = video.thumbnailBlob) == null ? void 0 : _a.getDirectURL) == null ? void 0 : _b.call(_a);
  const videoUrl = (_d = (_c = video.videoBlob) == null ? void 0 : _c.getDirectURL) == null ? void 0 : _d.call(_c);
  const isProcessing = video.status === "processing" || video.status === "uploading";
  const isScheduled = video.status === "scheduled";
  const upcoming = isUpcoming(video);
  const publishTimeMs = upcoming ? getPublishTimeMs(video) : null;
  const qualityLevel = video.qualityLevel || "";
  const duration = useDuration(videoUrl);
  const premiereCountdown = usePremiereCountdown(publishTimeMs);
  const [saveModalOpen, setSaveModalOpen] = reactExports.useState(false);
  const [inPlaylist, setInPlaylist] = reactExports.useState(
    () => isVideoInAnyPlaylist(video.id)
  );
  const handleModalClose = () => {
    setSaveModalOpen(false);
    setInPlaylist(isVideoInAnyPlaylist(video.id));
  };
  const handleClick = () => {
    if (upcoming) {
      setSelectedVideo(video);
      setPage("premiere-preview");
    } else {
      onClick();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `video.item.${index}`,
      className: "group animate-fade-up",
      style: { animationDelay: `${index * 50}ms` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-lg overflow-hidden aspect-video bg-surface2 mb-2 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "absolute inset-0 w-full h-full",
              onClick: handleClick,
              "aria-label": upcoming ? `Upcoming premiere: ${video.title}` : `Play ${video.title}`,
              children: thumbUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: thumbUrl,
                  alt: video.title,
                  className: `w-full h-full object-cover transition-transform duration-300 ${upcoming ? "opacity-60" : "group-hover:scale-105"}`
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-surface2 to-accent/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "svg",
                {
                  "aria-hidden": "true",
                  width: "32",
                  height: "32",
                  viewBox: "0 0 32 32",
                  fill: "none",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "path",
                    {
                      d: "M10 7L25 16L10 25V7Z",
                      fill: "oklch(0.68 0.18 35 / 0.5)"
                    }
                  )
                }
              ) })
            }
          ),
          duration !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono pointer-events-none", children: formatDuration(duration) }),
          upcoming && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50 pointer-events-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1.5 left-1.5 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full bg-orange text-white text-[9px] font-black uppercase tracking-widest", children: "Upcoming" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 14, className: "text-white/80" }) }),
              premiereCountdown && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-[10px] font-semibold bg-black/70 px-2 py-0.5 rounded-full", children: premiereCountdown })
            ] })
          ] }),
          isProcessing && !upcoming && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-black/80 text-white text-[10px] px-2 py-1 rounded-full font-medium animate-pulse", children: "Processing..." }) }),
          isScheduled && !upcoming && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1.5 left-1.5 bg-orange-500/90 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide pointer-events-none", children: "Scheduled" }),
          !isProcessing && !isScheduled && qualityLevel && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1 left-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold pointer-events-none", children: qualityLevel }),
          progress !== void 0 && progress > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-white/20 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-orange-500",
              style: { width: `${Math.min(progress, 100)}%` }
            }
          ) }),
          !upcoming && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `video.edit_button.${index}`,
              onClick: (e) => {
                e.stopPropagation();
                setSaveModalOpen(true);
              },
              className: "absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors",
              "aria-label": "Save to playlist",
              children: inPlaylist ? /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkCheck, { size: 13, className: "text-orange" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { size: 13, className: "text-white" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-7 h-7 flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-orange/20 text-orange text-[10px] font-bold", children: (video.creatorName || "U").slice(0, 2).toUpperCase() }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "flex-1 min-w-0 text-left",
              onClick: handleClick,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground line-clamp-2 leading-snug mb-1", children: video.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: video.creatorName || "Unknown" }),
                upcoming ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-orange", children: premiereCountdown }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[11px] text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 10 }),
                    " ",
                    formatViews(video.views)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 text-[10px]", children: "•" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[11px] text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
                    " ",
                    timeAgo(video.uploadTime)
                  ] })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AddToPlaylistModal,
          {
            videoId: video.id,
            open: saveModalOpen,
            onClose: handleModalClose
          }
        )
      ]
    }
  );
}
const PROGRESS_KEY = "sp_watch_progress";
const BEHAVIOR_KEY = "sp_behavior";
function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}");
  } catch {
    return {};
  }
}
function writeProgress(data) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}
function readBehavior() {
  try {
    return JSON.parse(localStorage.getItem(BEHAVIOR_KEY) ?? "{}");
  } catch {
    return {};
  }
}
function writeBehavior(data) {
  localStorage.setItem(BEHAVIOR_KEY, JSON.stringify(data));
}
function defaultBehavior() {
  return {
    watchTime: 0,
    completionRate: 0,
    liked: false,
    commented: false,
    skipped: false,
    clicks: 0
  };
}
let _lastSaveTime = 0;
function saveWatchProgress(videoId, currentTime, duration) {
  const now = Date.now();
  if (now - _lastSaveTime < 2e3) return;
  _lastSaveTime = now;
  if (!videoId || duration <= 0) return;
  const store = readProgress();
  store[videoId] = { progress: currentTime, duration, timestamp: now };
  writeProgress(store);
}
function getWatchProgress(videoId) {
  var _a;
  const store = readProgress();
  return ((_a = store[videoId]) == null ? void 0 : _a.progress) ?? 0;
}
function trackBehavior(videoId, event, value) {
  if (!videoId) return;
  const store = readBehavior();
  const entry = store[videoId] ?? defaultBehavior();
  switch (event) {
    case "click":
      entry.clicks = (entry.clicks ?? 0) + 1;
      break;
    case "skip":
      entry.skipped = true;
      break;
    case "like":
      entry.liked = true;
      break;
    case "comment":
      entry.commented = true;
      break;
    case "watchTime":
      if (value !== void 0) {
        entry.completionRate = Math.max(entry.completionRate, value);
        entry.watchTime = value;
      }
      break;
  }
  store[videoId] = entry;
  writeBehavior(store);
}
function scoreVideo(videoId, _creatorId, allVideoIds) {
  const store = readBehavior();
  const entry = store[videoId];
  if (!entry) {
    return 5;
  }
  let score = 0;
  score += (entry.completionRate ?? 0) * 40;
  if (entry.liked) score += 30;
  if (entry.commented) score += 10;
  score += Math.min((entry.clicks ?? 0) * 2, 20);
  if (entry.skipped) score -= 50;
  const seen = new Set(allVideoIds.filter((id) => store[id]));
  if (!seen.has(videoId)) score += 5;
  return score;
}
function getRecommendedVideoIds(videos, limit = 20) {
  const allIds = videos.map((v) => v.id);
  const scored = videos.map((v) => ({
    id: v.id,
    score: scoreVideo(v.id, v.creatorId, allIds)
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.id);
}
function getContinueWatchingVideoIds(limit = 10) {
  const store = readProgress();
  return Object.entries(store).filter(([, entry]) => {
    if (!entry.duration || entry.duration <= 0) return false;
    const pct = entry.progress / entry.duration;
    return pct > 0.05 && pct < 0.95;
  }).sort(([, a], [, b]) => b.timestamp - a.timestamp).slice(0, limit).map(([id]) => id);
}
function getContinueWatchingCount() {
  const store = readProgress();
  return Object.entries(store).filter(([, entry]) => {
    if (!entry.duration || entry.duration <= 0) return false;
    const pct = entry.progress / entry.duration;
    return pct > 0.05 && pct < 0.95;
  }).length;
}
function getWatchProgressPercent(videoId) {
  const store = readProgress();
  const entry = store[videoId];
  if (!entry || !entry.duration) return 0;
  return Math.round(entry.progress / entry.duration * 100);
}
export {
  AddToPlaylistModal as A,
  BookmarkCheck as B,
  Eye as E,
  VideoCard as V,
  getContinueWatchingVideoIds as a,
  getContinueWatchingCount as b,
  getRecommendedVideoIds as c,
  getWatchProgress as d,
  getWatchProgressPercent as g,
  saveWatchProgress as s,
  trackBehavior as t
};
