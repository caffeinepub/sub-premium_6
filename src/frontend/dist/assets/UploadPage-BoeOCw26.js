import { d as createLucideIcon, k as useActor, g as useInternetIdentity, Z as useQuery, r as reactExports, j as jsxRuntimeExports, ad as HardDrive, u as useApp, f as useUploadQueue, l as loadDateTimePrefs, m as motion, A as AnimatePresence, ae as Info, U as Label, af as Upload, ag as TriangleAlert, I as Input, ah as Image, o as formatAppDateTime, p as Button, ai as getFileFingerprint, e as ue, aj as dateToNanos, t as saveScheduledVideo } from "./index-DSOyFnVG.js";
import { C as Captions, a as CaptionManager } from "./CaptionManager-C4JFh2rg.js";
import { I as Infinity } from "./infinity-ClZeehc0.js";
import { A as ArrowLeft } from "./arrow-left-FCtMkwAX.js";
import { P as Plus } from "./plus-ChHCscM6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5", key: "1osxxc" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M3 10h5", key: "r794hk" }],
  ["path", { d: "M17.5 17.5 16 16.3V14", key: "akvzfd" }],
  ["circle", { cx: "16", cy: "16", r: "6", key: "qoo3c4" }]
];
const CalendarClock = createLucideIcon("calendar-clock", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m10 11 5 3-5 3v-6Z", key: "7ntvm4" }]
];
const FileVideo = createLucideIcon("file-video", __iconNode$2);
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
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
  ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
  ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
];
const Timer = createLucideIcon("timer", __iconNode);
function useUploadStats() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const query = useQuery({
    queryKey: ["uploadStats"],
    queryFn: async () => {
      if (!actor) return void 0;
      try {
        return await actor.getUploadStats();
      } catch {
        return void 0;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    refetchInterval: 3e4,
    staleTime: 1e4
  });
  return { stats: query.data, isLoading: query.isLoading };
}
function formatBytes(bytes) {
  const n = Number(bytes);
  if (n >= 1024 * 1024 * 1024)
    return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${n} B`;
}
function formatSeconds(sec) {
  const s = Number(sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m > 0) return `${m}m ${r}s`;
  return `${r}s`;
}
function UploadLimitsPanel() {
  const { identity } = useInternetIdentity();
  const { stats, isLoading } = useUploadStats();
  const [cooldownDisplay, setCooldownDisplay] = reactExports.useState(0n);
  const [blockDisplay, setBlockDisplay] = reactExports.useState(0n);
  reactExports.useEffect(() => {
    if (!stats) return;
    setCooldownDisplay(stats.cooldownRemaining);
    setBlockDisplay(stats.tempBlockRemaining);
  }, [stats]);
  reactExports.useEffect(() => {
    if (cooldownDisplay <= 0n && blockDisplay <= 0n) return;
    const id = setInterval(() => {
      setCooldownDisplay((prev) => prev > 0n ? prev - 1n : 0n);
      setBlockDisplay((prev) => prev > 0n ? prev - 1n : 0n);
    }, 1e3);
    return () => clearInterval(id);
  }, [cooldownDisplay, blockDisplay]);
  if (!identity || isLoading || !stats) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "upload.panel",
      className: "bg-[#1A1A1A] border border-[#333] rounded-xl p-4 space-y-3",
      children: [
        blockDisplay > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "upload.error_state",
            className: "flex items-start gap-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 15, className: "text-red-400 mt-0.5 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-red-400", children: [
                "Uploads paused due to rapid activity. Resumes in",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: formatSeconds(blockDisplay) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Infinity, { size: 15, className: "text-orange flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-white", children: "Unlimited uploads" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { size: 13, className: "text-muted-foreground flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Storage used:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold", children: formatBytes(stats.storageUsedBytes) })
          ] })
        ] }),
        cooldownDisplay > 0n && blockDisplay <= 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "upload.loading_state",
            className: "flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { size: 13, className: "text-orange flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-orange font-medium", children: [
                "Almost ready — uploading in",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold tabular-nums", children: formatSeconds(cooldownDisplay) })
              ] })
            ]
          }
        )
      ]
    }
  );
}
const MAX_BLOCK_MB = 2048;
const MAX_DURATION_SECONDS = 3600;
const RECENT_FINGERPRINTS_KEY = "recentUploadFingerprints";
const MAX_RECENT = 5;
function getRecentFingerprints() {
  try {
    const raw = localStorage.getItem(RECENT_FINGERPRINTS_KEY);
    if (!raw) return /* @__PURE__ */ new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function addRecentFingerprint(fp) {
  try {
    const arr = Array.from(getRecentFingerprints());
    const updated = [fp, ...arr.filter((x) => x !== fp)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_FINGERPRINTS_KEY, JSON.stringify(updated));
  } catch {
  }
}
function formatDuration(seconds) {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m2 = Math.floor(seconds % 3600 / 60);
    const s2 = Math.floor(seconds % 60);
    return `${h}:${m2.toString().padStart(2, "0")}:${s2.toString().padStart(2, "0")}`;
  }
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
function UploadPage() {
  const { setPage } = useApp();
  const { addJob, hasActive, activeCount, queuedCount } = useUploadQueue();
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [videoFile, setVideoFile] = reactExports.useState(null);
  const [thumbFile, setThumbFile] = reactExports.useState(null);
  const [previewUrl, setPreviewUrl] = reactExports.useState(null);
  const [previewDuration, setPreviewDuration] = reactExports.useState(null);
  const [durationError, setDurationError] = reactExports.useState("");
  const [isDuplicate, setIsDuplicate] = reactExports.useState(false);
  const [scheduleEnabled, setScheduleEnabled] = reactExports.useState(false);
  const [scheduledAt, setScheduledAt] = reactExports.useState(null);
  const [scheduleError, setScheduleError] = reactExports.useState("");
  const [_confirmedSchedule, setConfirmedSchedule] = reactExports.useState(null);
  const { actor } = useActor();
  const prefs = loadDateTimePrefs();
  const videoInputRef = reactExports.useRef(null);
  const thumbInputRef = reactExports.useRef(null);
  const prevPreviewUrlRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    return () => {
      if (prevPreviewUrlRef.current) {
        URL.revokeObjectURL(prevPreviewUrlRef.current);
      }
    };
  }, []);
  const videoSizeMB = videoFile ? videoFile.size / (1024 * 1024) : 0;
  const isFileTooLarge = videoSizeMB > MAX_BLOCK_MB;
  const handleVideoSelect = (file) => {
    if (!file) return;
    if (prevPreviewUrlRef.current) {
      URL.revokeObjectURL(prevPreviewUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    prevPreviewUrlRef.current = url;
    setPreviewUrl(url);
    setPreviewDuration(null);
    setDurationError("");
    setVideoFile(file);
    const fp = getFileFingerprint(file);
    const recents = getRecentFingerprints();
    setIsDuplicate(recents.has(fp));
  };
  const handleDurationLoaded = (duration) => {
    setPreviewDuration(duration);
    if (duration > MAX_DURATION_SECONDS) {
      setDurationError("Video too long — maximum duration is 1 hour");
    } else {
      setDurationError("");
    }
  };
  const handleUpload = () => {
    if (!videoFile) {
      ue.error("Please select a video file.");
      return;
    }
    if (!title.trim()) {
      ue.error("Please enter a title.");
      return;
    }
    if (isFileTooLarge) {
      ue.error(
        "File exceeds 2 GB limit. Please compress or trim your video."
      );
      return;
    }
    if (durationError) {
      ue.error(durationError);
      return;
    }
    if (scheduleEnabled && scheduledAt && scheduledAt <= /* @__PURE__ */ new Date()) {
      ue.error("Scheduled time must be in the future.");
      return;
    }
    const fp = getFileFingerprint(videoFile);
    addRecentFingerprint(fp);
    setIsDuplicate(false);
    const jobDescription = description.trim() || void 0;
    addJob({
      title: title.trim(),
      videoFile,
      thumbnailFile: thumbFile,
      description: jobDescription
    });
    if (scheduleEnabled && scheduledAt) {
      const videoId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      if (actor) {
        try {
          const scheduleFn = actor.scheduleVideo;
          if (typeof scheduleFn === "function") {
            scheduleFn.call(actor, videoId, dateToNanos(scheduledAt)).catch(() => {
              actor.updateVideoStatus(videoId, "scheduled").catch(() => {
              });
            });
          }
        } catch {
        }
      }
      saveScheduledVideo({
        videoId,
        title: title.trim(),
        publishTime: scheduledAt.getTime(),
        notified: false
      });
      ue.success(
        `Premiere scheduled for ${formatAppDateTime(scheduledAt, prefs)}!`
      );
    } else {
      ue.success("Added to upload queue!");
    }
    setTitle("");
    setDescription("");
    setVideoFile(null);
    setThumbFile(null);
    setDurationError("");
    if (prevPreviewUrlRef.current) {
      URL.revokeObjectURL(prevPreviewUrlRef.current);
      prevPreviewUrlRef.current = null;
    }
    setPreviewUrl(null);
    setPreviewDuration(null);
    setScheduleEnabled(false);
    setScheduledAt(null);
    setScheduleError("");
    setConfirmedSchedule(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (thumbInputRef.current) thumbInputRef.current.value = "";
    setPage("home");
  };
  const currentStep = hasActive ? 3 : videoFile ? 2 : 1;
  const canUpload = !!videoFile && !!title.trim() && !isFileTooLarge && !durationError;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      className: "flex-1 overflow-y-auto pb-20",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-30 bg-background border-b border-border/40 px-4 py-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "upload.close_button",
              onClick: () => setPage("home"),
              className: "p-1.5 rounded-full hover:bg-accent transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold text-base", children: "Upload Video" }),
          hasActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-orange animate-pulse", children: [
            activeCount,
            " uploading",
            queuedCount > 0 ? ` · ${queuedCount} queued` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-5 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: hasActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -6 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -6 },
              className: "flex items-center gap-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 15, className: "text-sky-400 flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-sky-300 leading-relaxed", children: "Uploading… You can leave this page — your uploads continue in the background" })
              ]
            }
          ) }),
          videoFile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `flex items-center gap-1 ${currentStep >= 1 ? "text-orange font-semibold" : "text-muted-foreground"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep >= 1 ? "bg-orange text-white" : "bg-border text-muted-foreground"}`,
                      children: "①"
                    }
                  ),
                  "Select"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 mx-1", children: "→" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `flex items-center gap-1 ${currentStep >= 2 ? "text-orange font-semibold" : "text-muted-foreground"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep >= 2 ? "bg-orange text-white" : "bg-border text-muted-foreground"}`,
                      children: "②"
                    }
                  ),
                  "Preview & Details"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 mx-1", children: "→" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `flex items-center gap-1 ${currentStep >= 3 ? "text-orange font-semibold" : "text-muted-foreground"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep >= 3 ? "bg-orange text-white" : "bg-border text-muted-foreground"}`,
                      children: "③"
                    }
                  ),
                  "Upload"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block", children: "Video File *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "upload.upload_button",
                onClick: () => {
                  var _a;
                  return (_a = videoInputRef.current) == null ? void 0 : _a.click();
                },
                className: "w-full border-2 border-dashed border-border hover:border-orange/50 rounded-xl p-6 flex flex-col items-center gap-3 transition-colors",
                children: videoFile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileVideo, { size: 32, className: "text-orange" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate max-w-full px-4", children: videoFile.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    videoSizeMB.toFixed(1),
                    " MB"
                  ] })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 32, className: "text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Tap to select video" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60", children: "MP4, MOV, AVI, WebM · Max 2 GB · Max 1 hour" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: videoInputRef,
                type: "file",
                accept: "video/*",
                className: "hidden",
                onChange: (e) => {
                  var _a;
                  return handleVideoSelect((_a = e.target.files) == null ? void 0 : _a[0]);
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isFileTooLarge && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -4 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0 },
              className: "flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TriangleAlert,
                  {
                    size: 15,
                    className: "text-destructive flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: "File exceeds 2 GB limit. Please compress or trim your video." })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: durationError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -4 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0 },
              "data-ocid": "upload.error_state",
              className: "flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TriangleAlert,
                  {
                    size: 15,
                    className: "text-destructive flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: durationError })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isDuplicate && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -4 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0 },
              className: "flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TriangleAlert,
                  {
                    size: 15,
                    className: "text-amber-400 flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-400", children: "This file was recently uploaded. Continue to upload again?" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: previewUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -8 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -8 },
              className: "space-y-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl overflow-hidden bg-black border border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "video",
                  {
                    src: previewUrl,
                    controls: true,
                    playsInline: true,
                    className: "w-full aspect-video bg-black",
                    onLoadedMetadata: (e) => handleDurationLoaded(e.currentTarget.duration)
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: previewDuration !== null ? `Duration: ${formatDuration(previewDuration)}` : "Loading..." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "upload.secondary_button",
                      onClick: () => {
                        var _a;
                        return (_a = videoInputRef.current) == null ? void 0 : _a.click();
                      },
                      className: "text-xs text-orange hover:underline",
                      children: "Replace video"
                    }
                  )
                ] })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "video-title",
                className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block",
                children: "Title *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "video-title",
                "data-ocid": "upload.input",
                value: title,
                onChange: (e) => setTitle(e.target.value),
                placeholder: "Enter video title...",
                className: "bg-[#1A1A1A] border-[#333] text-white placeholder:text-[#AAAAAA] focus:ring-1 focus:ring-orange/60 focus:border-orange/60"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "video-description",
                className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block",
                children: [
                  "Description",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-[10px] normal-case tracking-normal font-normal px-1.5 py-0.5 rounded-full bg-surface2 text-muted-foreground/60", children: "optional" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                id: "video-description",
                "data-ocid": "upload.textarea",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                placeholder: "Tell viewers about your video...",
                maxLength: 2e3,
                rows: 4,
                className: "w-full bg-[#1A1A1A] border border-[#333] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#AAAAAA] focus:outline-none focus:ring-1 focus:ring-orange/60 resize-none min-h-[100px]"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-right text-[11px] text-muted-foreground/50 mt-1", children: [
              description.length,
              "/2000"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block", children: "Thumbnail (optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "upload.dropzone",
                onClick: () => {
                  var _a;
                  return (_a = thumbInputRef.current) == null ? void 0 : _a.click();
                },
                className: "w-full border border-dashed border-border hover:border-orange/30 rounded-xl p-4 flex items-center gap-3 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 20, className: "text-muted-foreground flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground truncate", children: thumbFile ? thumbFile.name : "Add custom thumbnail" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: thumbInputRef,
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: (e) => {
                  var _a;
                  return setThumbFile(((_a = e.target.files) == null ? void 0 : _a[0]) ?? null);
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(UploadLimitsPanel, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              className: "rounded-xl border border-orange/40 bg-orange/5 p-4 flex items-start gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-orange/15 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Captions, { size: 16, className: "text-orange" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "Add Captions" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 rounded-full bg-orange text-white text-[9px] font-bold uppercase tracking-wide", children: "Recommended" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Captions improve reach by 40% and help viewers watching with sound off. Available after upload." })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/10 bg-[#1A1A1A] overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "upload.schedule.toggle",
                className: "w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/5 transition-colors",
                onClick: () => {
                  setScheduleEnabled((v) => !v);
                  setScheduleError("");
                  if (scheduleEnabled) setScheduledAt(null);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { size: 16, className: "text-orange flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-white", children: "Schedule for later" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Video stays hidden until publish time" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${scheduleEnabled ? "bg-orange" : "bg-white/20"}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `w-4 h-4 rounded-full bg-white shadow transition-transform ${scheduleEnabled ? "translate-x-5" : "translate-x-0"}`
                        }
                      )
                    }
                  )
                ]
              }
            ),
            scheduleEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 space-y-3 border-t border-white/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground pt-3", children: "Pick a future date and time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "datetime-local",
                  min: new Date(Date.now() + 6e4).toISOString().slice(0, 16),
                  value: scheduledAt ? new Date(
                    scheduledAt.getTime() - scheduledAt.getTimezoneOffset() * 6e4
                  ).toISOString().slice(0, 16) : "",
                  onChange: (e) => {
                    const val = e.target.value;
                    if (!val) {
                      setScheduledAt(null);
                      setScheduleError("");
                      return;
                    }
                    const d = new Date(val);
                    if (d <= /* @__PURE__ */ new Date()) {
                      setScheduleError("Please pick a future date and time.");
                      setScheduledAt(null);
                    } else {
                      setScheduleError("");
                      setScheduledAt(d);
                    }
                  },
                  className: "w-full bg-[#242424] text-white border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange/60",
                  "data-ocid": "upload.schedule.input"
                }
              ),
              scheduleError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-red-400",
                  "data-ocid": "upload.schedule.error_state",
                  children: scheduleError
                }
              ),
              scheduledAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg bg-orange/10 border border-orange/20 px-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CalendarClock,
                  {
                    size: 13,
                    className: "text-orange flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-orange", children: [
                  "Will publish: ",
                  formatAppDateTime(scheduledAt, prefs)
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              "data-ocid": "upload.submit_button",
              onClick: handleUpload,
              disabled: !canUpload,
              className: "w-full bg-orange hover:bg-orange/90 text-white border-none font-semibold",
              children: scheduleEnabled ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { size: 16, className: "mr-2" }),
                "Schedule Premiere"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: "mr-2" }),
                "Publish Now"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CaptionManager, { videoId: "" })
        ] })
      ]
    }
  );
}
export {
  UploadPage
};
