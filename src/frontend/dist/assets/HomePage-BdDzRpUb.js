import { f as useUploadQueue, r as reactExports, j as jsxRuntimeExports, R as RefreshCw, u as useApp, g as useInternetIdentity, h as useT, b as useListVideos, i as useSubscriptions, B as Bell, P as Play, I as Input } from "./index-DSOyFnVG.js";
import { S as Skeleton } from "./skeleton-B_QR17Nm.js";
import { a as getContinueWatchingVideoIds, b as getContinueWatchingCount, c as getRecommendedVideoIds, V as VideoCard, g as getWatchProgressPercent, A as AddToPlaylistModal } from "./recommendations-SxJSX6Y2.js";
import { g as getPlaylists, c as createPlaylist } from "./playlists-BxogQr83.js";
import { L as ListVideo } from "./list-video-DbPyzDI5.js";
import { P as Plus } from "./plus-ChHCscM6.js";
import "./lock-QCMAnrix.js";
import "./bookmark-CXa_WCMS.js";
import "./clock-_PitsIeG.js";
function BlockProgressBar({ progress }) {
  const total = 13;
  const filled = Math.round(progress / 100 * total);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[11px] tracking-tight select-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange", children: "█".repeat(filled) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/20", children: "░".repeat(total - filled) })
  ] });
}
function UploadingVideoCard({ job }) {
  const { retryJob } = useUploadQueue();
  const [showReady, setShowReady] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (job.status === "completed") {
      setShowReady(true);
    }
  }, [job.status]);
  const isUploading = job.status === "uploading" || job.status === "queued" || job.status === "paused";
  const isProcessing = job.status === "processing";
  const isCompleted = job.status === "completed";
  const isFailed = job.status === "failed";
  let statusText = "";
  let statusColor = "text-orange";
  if (job.status === "queued") {
    statusText = "Queued...";
    statusColor = "text-zinc-400";
  } else if (job.status === "uploading") {
    statusText = `Uploading... ${job.progress}%`;
    statusColor = "text-orange";
  } else if (job.status === "paused") {
    statusText = `Paused at ${job.progress}%`;
    statusColor = "text-sky-400";
  } else if (isProcessing) {
    statusText = "Processing...";
    statusColor = "text-purple-400";
  } else if (isCompleted || showReady) {
    statusText = "Ready";
    statusColor = "text-green-400";
  } else if (isFailed) {
    statusText = "Upload failed";
    statusColor = "text-red-400";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-surface2/60 border border-white/8 rounded-xl overflow-hidden mb-3 mx-3 animate-fade-up", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-14 rounded-lg overflow-hidden bg-black/40 flex-shrink-0 flex items-center justify-center", children: job.thumbnailUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: job.thumbnailUrl,
        alt: job.title,
        className: "w-full h-full object-cover"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "svg",
      {
        "aria-hidden": "true",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 4L19 12L5 20V4Z", fill: "oklch(0.68 0.18 35 / 0.4)" })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[13px] font-semibold text-foreground line-clamp-1 leading-snug mb-1", children: [
        "🎬 ",
        job.title
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[11px] font-semibold ${statusColor} mb-1.5`, children: statusText }),
      (isUploading || isProcessing) && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        isUploading && /* @__PURE__ */ jsxRuntimeExports.jsx(BlockProgressBar, { progress: job.progress }),
        isProcessing && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 bg-white/10 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-purple-400 rounded-full animate-pulse",
            style: { width: "60%" }
          }
        ) })
      ] }),
      isUploading && job.progress > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-0.5 bg-white/10 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full bg-orange rounded-full transition-all duration-300",
          style: { width: `${job.progress}%` }
        }
      ) }),
      isFailed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => retryJob(job.id),
          className: "mt-1.5 flex items-center gap-1.5 text-[11px] text-orange font-semibold hover:text-orange/80 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 11 }),
            "Retry upload"
          ]
        }
      )
    ] })
  ] }) });
}
let debounceTimer;
const SKELETON_KEYS = ["sk0", "sk1", "sk2", "sk3", "sk4", "sk5"];
const NOW_MS = Date.now();
const HOURS_48 = 48 * 60 * 60 * 1e3;
function isNewUpload(uploadTime) {
  const ms = Number(uploadTime) / 1e6;
  return NOW_MS - ms < HOURS_48;
}
function HorizontalRow({
  title,
  videos,
  onVideoClick,
  showProgress,
  onViewMore
}) {
  const t = useT();
  if (videos.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground px-3 mb-2", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 overflow-x-auto px-3 pb-2 no-scrollbar", children: [
      videos.map((video, i) => {
        const pct = showProgress ? getWatchProgressPercent(video.id) : void 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-44", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          VideoCard,
          {
            video,
            index: i + 1,
            onClick: () => onVideoClick(video),
            progress: pct
          }
        ) }, video.id);
      }),
      onViewMore && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: onViewMore,
          "data-ocid": "home.history.button",
          className: "flex-shrink-0 w-20 h-full min-h-[120px] flex flex-col items-center justify-center gap-1 text-orange text-xs font-semibold bg-surface2/60 rounded-xl border border-border/30",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "⋯" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("home.viewMore") })
          ]
        }
      )
    ] })
  ] });
}
function GridSection({
  title,
  videos,
  onVideoClick,
  showNewBadge
}) {
  const t = useT();
  if (videos.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-5 px-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground mb-3", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: videos.map((video, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      showNewBadge && isNewUpload(video.uploadTime) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 left-1 z-10 bg-orange text-white text-[9px] font-bold px-1.5 py-0.5 rounded", children: t("home.new") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        VideoCard,
        {
          video,
          index: i + 1,
          onClick: () => onVideoClick(video)
        }
      )
    ] }, video.id)) })
  ] });
}
function PlaylistsRow() {
  const { setPage, setSelectedPlaylistId } = useApp();
  const [playlists, setPlaylists] = reactExports.useState(() => getPlaylists());
  const { data: allVideos = [] } = useListVideos();
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [newTitle, setNewTitle] = reactExports.useState("");
  const [newPrivacy, setNewPrivacy] = reactExports.useState("public");
  const [addModalVideoId, setAddModalVideoId] = reactExports.useState(null);
  const t = useT();
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ListVideo, { size: 14, className: "text-orange" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("home.playlists") })
      ] }),
      hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "home.primary_button",
          onClick: () => setPage("menu"),
          className: "text-xs text-orange font-medium hover:text-orange/80 transition-colors",
          children: t("home.viewMore")
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 overflow-x-auto px-3 pb-2 no-scrollbar", children: [
      preview.map((pl, i) => {
        var _a, _b;
        const firstVideoId = pl.videoIds[0];
        const firstVideo = firstVideoId ? videoMap.get(firstVideoId) : null;
        const thumbUrl = (_b = (_a = firstVideo == null ? void 0 : firstVideo.thumbnailBlob) == null ? void 0 : _a.getDirectURL) == null ? void 0 : _b.call(_a);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": `home.item.${i + 1}`,
            onClick: () => {
              setSelectedPlaylistId(pl.id);
              setPage("playlist");
            },
            className: "flex-shrink-0 w-32 text-left group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-32 h-20 rounded-xl overflow-hidden bg-surface2 mb-1.5", children: [
                thumbUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: thumbUrl,
                    alt: pl.title,
                    className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gradient-to-br from-surface2 to-orange/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 18, className: "text-orange/40" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded", children: [
                  pl.videoIds.length,
                  " video",
                  pl.videoIds.length !== 1 ? "s" : ""
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground truncate leading-snug", children: pl.title })
            ]
          },
          pl.id
        );
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "home.open_modal_button",
          onClick: () => setCreateOpen(true),
          className: "flex-shrink-0 w-32 flex flex-col items-center justify-center gap-2 h-20 rounded-xl border-2 border-dashed border-border/40 hover:border-orange/40 transition-colors text-muted-foreground hover:text-orange",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium", children: "New playlist" })
          ]
        }
      ),
      hasMore && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setPage("menu"),
          "data-ocid": "home.secondary_button",
          className: "flex-shrink-0 w-20 h-20 flex flex-col items-center justify-center gap-1 text-orange text-xs font-semibold bg-surface2/60 rounded-xl border border-border/30",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "⋯" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("home.viewMore") })
          ]
        }
      )
    ] }),
    createOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "aria-label": "Close",
          className: "fixed inset-0 z-50 bg-black/60 w-full h-full cursor-default",
          onClick: () => setCreateOpen(false)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "home.modal",
          className: "fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] rounded-t-2xl px-4 py-5 max-w-[430px] mx-auto border-t border-white/10",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-white mb-4", children: t("playlist.create") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "home.input",
                autoFocus: true,
                value: newTitle,
                onChange: (e) => setNewTitle(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && handleCreatePlaylist(),
                placeholder: "Playlist name...",
                className: "bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-orange h-9 text-sm mb-3"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/50", children: "Privacy:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "home.toggle",
                  onClick: () => setNewPrivacy("public"),
                  className: `px-3 py-1 rounded-full text-xs font-medium transition-colors ${newPrivacy === "public" ? "bg-orange text-white" : "bg-white/10 text-white/60 hover:bg-white/15"}`,
                  children: "Public"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "home.toggle",
                  onClick: () => setNewPrivacy("private"),
                  className: `px-3 py-1 rounded-full text-xs font-medium transition-colors ${newPrivacy === "private" ? "bg-orange text-white" : "bg-white/10 text-white/60 hover:bg-white/15"}`,
                  children: "Private"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "home.cancel_button",
                  onClick: () => {
                    setCreateOpen(false);
                    setNewTitle("");
                  },
                  className: "flex-1 py-2 rounded-xl bg-white/10 text-white/70 text-sm font-medium hover:bg-white/15 transition-colors",
                  children: t("common.cancel")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "home.confirm_button",
                  onClick: handleCreatePlaylist,
                  disabled: !newTitle.trim(),
                  className: "flex-1 py-2 rounded-xl bg-orange text-white text-sm font-semibold disabled:opacity-40 transition-colors",
                  children: t("playlist.create")
                }
              )
            ] })
          ]
        }
      )
    ] }),
    addModalVideoId && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddToPlaylistModal,
      {
        videoId: addModalVideoId,
        open: true,
        onClose: () => setAddModalVideoId(null)
      }
    )
  ] });
}
function HomePage({ searchTerm }) {
  const {
    setPage,
    setSelectedVideo,
    justUploadedVideoId,
    setJustUploadedVideoId
  } = useApp();
  const { identity } = useInternetIdentity();
  const [activeTab, setActiveTab] = reactExports.useState("forYou");
  const [debouncedSearch, setDebouncedSearch] = reactExports.useState("");
  const [recTick, setRecTick] = reactExports.useState(0);
  const tickRef = reactExports.useRef(recTick);
  tickRef.current = recTick;
  const t = useT();
  const { jobs, dismissJob } = useUploadQueue();
  reactExports.useEffect(() => {
    const completedJobs = jobs.filter((j) => j.status === "completed");
    if (completedJobs.length === 0) return;
    const timers = completedJobs.map(
      (j) => setTimeout(() => dismissJob(j.id), 4e3)
    );
    return () => timers.forEach(clearTimeout);
  }, [jobs, dismissJob]);
  const TABS = [
    { id: "forYou", label: t("home.forYou") },
    { id: "trending", label: t("home.trending") },
    { id: "new", label: t("home.new") },
    { id: "subscriptions", label: t("home.subscriptions") }
  ];
  reactExports.useEffect(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);
  reactExports.useEffect(() => {
    const onFocus = () => setRecTick((tick) => tick + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);
  const { data: videos = [], isLoading } = useListVideos(
    debouncedSearch || void 0
  );
  reactExports.useEffect(() => {
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
    setPage
  ]);
  const handleVideoClick = reactExports.useCallback(
    (video) => {
      setSelectedVideo(video);
      setPage("player");
    },
    [setSelectedVideo, setPage]
  );
  const videoMap = new Map(videos.map((v) => [v.id, v]));
  const continueWatchingIds = getContinueWatchingVideoIds(10);
  const continueWatchingVideos = continueWatchingIds.map((id) => videoMap.get(id)).filter((v) => !!v);
  const totalContinueWatching = getContinueWatchingCount();
  const recommendedIds = getRecommendedVideoIds(
    videos.map((v) => ({ id: v.id, creatorId: v.creatorId })),
    6
  );
  const recommendedVideos = recommendedIds.map((id) => videoMap.get(id)).filter((v) => !!v);
  const trendingVideos = [...videos].sort((a, b) => Number(b.views - a.views)).slice(0, 4);
  const discoverVideos = videos.filter(
    (v) => !continueWatchingIds.includes(v.id) && !recommendedIds.slice(0, 4).includes(v.id)
  ).slice(0, 4);
  const newVideos = [...videos].sort(
    (a, b) => Number(b.uploadTime - a.uploadTime)
  );
  const { data: subscriptions = [] } = useSubscriptions();
  const subscribedVideos = videos.filter(
    (v) => subscriptions.includes(v.creatorId)
  );
  const userPrincipal = identity == null ? void 0 : identity.getPrincipal().toString();
  const yourVideos = userPrincipal ? videos.filter((v) => v.creatorId === userPrincipal).slice(0, 5) : [];
  const likedVideoIds = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("sub_liked_videos") ?? "[]"
      );
    } catch {
      return [];
    }
  })();
  const likedVideos = likedVideoIds.map((id) => videoMap.get(id)).filter((v) => !!v).slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 overflow-y-auto pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-30 bg-background border-b border-border/40 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 overflow-x-auto py-2 no-scrollbar", children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": `home.${tab.id}.tab`,
        onClick: () => setActiveTab(tab.id),
        className: `flex-shrink-0 px-3 py-1.5 text-[11px] font-semibold tracking-wider transition-colors rounded-sm ${activeTab === tab.id ? "text-orange border-b-2 border-orange" : "text-muted-foreground hover:text-foreground"}`,
        children: tab.label
      },
      tab.id
    )) }) }),
    jobs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-3 pb-0", children: jobs.map((job) => /* @__PURE__ */ jsxRuntimeExports.jsx(UploadingVideoCard, { job }, job.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "home.loading_state",
        className: "grid grid-cols-2 gap-3 px-3",
        children: SKELETON_KEYS.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-video w-full rounded-lg bg-surface2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-4/5 bg-surface2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/5 bg-surface2" })
        ] }, key))
      }
    ) : debouncedSearch ? (
      // ── Search results ──────────────────────────────────────────────────────────
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-3", children: [
          videos.length,
          " result",
          videos.length !== 1 ? "s" : "",
          " for “",
          debouncedSearch,
          "”"
        ] }),
        videos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "home.empty_state",
            className: "flex flex-col items-center justify-center py-16 text-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
              "No videos found for “",
              debouncedSearch,
              "”"
            ] })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "home.list", className: "grid grid-cols-2 gap-3", children: videos.map((video, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          VideoCard,
          {
            video,
            index: i + 1,
            onClick: () => handleVideoClick(video)
          },
          video.id
        )) })
      ] })
    ) : videos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "home.empty_state",
        className: "flex flex-col items-center justify-center py-16 text-center px-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-surface2 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "svg",
            {
              "aria-hidden": "true",
              width: "28",
              height: "28",
              viewBox: "0 0 28 28",
              fill: "none",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 5L22 14L7 23V5Z", fill: "oklch(0.68 0.18 35 / 0.3)" })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
            t("video.noVideos"),
            ". Be the first to upload!"
          ] })
        ]
      }
    ) : activeTab === "forYou" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "home.list", children: [
      continueWatchingVideos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        HorizontalRow,
        {
          title: t("home.continueWatching"),
          videos: continueWatchingVideos,
          onVideoClick: handleVideoClick,
          showProgress: true,
          onViewMore: totalContinueWatching > 10 ? () => setPage("history") : void 0
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PlaylistsRow, {}),
      identity && subscribedVideos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        HorizontalRow,
        {
          title: t("home.subscriptions"),
          videos: subscribedVideos.slice(0, 10),
          onVideoClick: handleVideoClick
        }
      ),
      yourVideos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("home.yourVideos") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "home.secondary_button",
              onClick: () => setPage("menu"),
              className: "text-xs text-orange font-medium hover:text-orange/80 transition-colors",
              children: t("home.viewMore")
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 overflow-x-auto px-3 pb-2 no-scrollbar", children: yourVideos.map((video, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-44", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          VideoCard,
          {
            video,
            index: i + 1,
            onClick: () => handleVideoClick(video)
          }
        ) }, video.id)) })
      ] }),
      likedVideos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        HorizontalRow,
        {
          title: t("home.likedVideos"),
          videos: likedVideos,
          onVideoClick: handleVideoClick
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        GridSection,
        {
          title: t("home.recommended"),
          videos: recommendedVideos,
          onVideoClick: handleVideoClick
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HorizontalRow,
        {
          title: t("home.trending"),
          videos: trendingVideos,
          onVideoClick: handleVideoClick
        }
      ),
      discoverVideos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        GridSection,
        {
          title: t("home.new"),
          videos: discoverVideos,
          onVideoClick: handleVideoClick
        }
      ),
      recommendedVideos.length === 0 && trendingVideos.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 px-3", children: videos.map((video, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        VideoCard,
        {
          video,
          index: i + 1,
          onClick: () => handleVideoClick(video)
        },
        video.id
      )) })
    ] }) : activeTab === "trending" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "home.list", className: "grid grid-cols-2 gap-3 px-3", children: [...videos].sort((a, b) => Number(b.views - a.views)).map((video, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      VideoCard,
      {
        video,
        index: i + 1,
        onClick: () => handleVideoClick(video)
      },
      video.id
    )) }) : activeTab === "new" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "home.list", className: "grid grid-cols-2 gap-3 px-3", children: newVideos.map((video, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      VideoCard,
      {
        video,
        index: i + 1,
        onClick: () => handleVideoClick(video)
      },
      video.id
    )) }) : (
      // ── SUBSCRIPTIONS ────────────────────────────────────────────────────────────
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3", children: subscriptions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "home.empty_state",
          className: "flex flex-col items-center justify-center py-16 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-10 h-10 text-muted-foreground/40 mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-medium", children: "Subscribe to creators" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground/60 text-xs mt-1", children: "Their videos will appear here" })
          ]
        }
      ) : subscribedVideos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "home.empty_state",
          className: "flex flex-col items-center justify-center py-16 text-center",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No new videos from your subscriptions" })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        GridSection,
        {
          title: t("home.subscriptions"),
          videos: subscribedVideos,
          onVideoClick: handleVideoClick,
          showNewBadge: true
        }
      ) })
    ) })
  ] });
}
export {
  HomePage
};
