import { u as useApp, a as useWatchHistory, b as useListVideos, r as reactExports, j as jsxRuntimeExports, m as motion } from "./index-DSOyFnVG.js";
import { S as Skeleton } from "./skeleton-B_QR17Nm.js";
import { V as VideoCard, g as getWatchProgressPercent } from "./recommendations-SxJSX6Y2.js";
import { A as ArrowLeft } from "./arrow-left-FCtMkwAX.js";
import { C as Clock } from "./clock-_PitsIeG.js";
import "./playlists-BxogQr83.js";
import "./lock-QCMAnrix.js";
import "./bookmark-CXa_WCMS.js";
import "./plus-ChHCscM6.js";
const SKELETON_KEYS = ["sk0", "sk1", "sk2", "sk3", "sk4"];
const INITIAL_VISIBLE = 50;
const LOAD_MORE_STEP = 20;
const DAY = 24 * 60 * 60 * 1e3;
const WEEK = 7 * DAY;
function getBucket(ts) {
  const ms = Number(ts) / 1e6;
  const age = Date.now() - ms;
  if (age < DAY) return "today";
  if (age < WEEK) return "week";
  return "earlier";
}
const BUCKET_LABELS = {
  today: "Today",
  week: "This Week",
  earlier: "Earlier"
};
function HistoryPage() {
  const { setPage, setSelectedVideo } = useApp();
  const { data: history = [], isLoading: histLoading } = useWatchHistory();
  const { data: allVideos = [] } = useListVideos();
  const [visibleCount, setVisibleCount] = reactExports.useState(INITIAL_VISIBLE);
  const videoMap = new Map(allVideos.map((v) => [v.id, v]));
  const dedupMap = /* @__PURE__ */ new Map();
  for (const h of history) {
    const existing = dedupMap.get(h.videoId);
    if (!existing || h.timestamp > existing.timestamp) {
      dedupMap.set(h.videoId, h);
    }
  }
  const deduped = Array.from(dedupMap.values()).sort(
    (a, b) => Number(b.timestamp - a.timestamp)
  );
  const totalCount = deduped.length;
  const visibleDeduped = deduped.slice(0, visibleCount);
  const historyItems = visibleDeduped.map((h) => ({ view: h, video: videoMap.get(h.videoId) })).filter((item) => item.video !== void 0);
  const buckets = {
    today: [],
    week: [],
    earlier: []
  };
  for (const item of historyItems) {
    buckets[getBucket(item.view.timestamp)].push(item);
  }
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setPage("player");
  };
  const orderedBuckets = ["today", "week", "earlier"].filter(
    (b) => buckets[b].length > 0
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      className: "flex-1 overflow-y-auto pb-20",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-30 bg-background border-b border-border/40 px-4 py-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "history.close_button",
              onClick: () => setPage("home"),
              className: "p-1.5 rounded-full hover:bg-accent transition-colors",
              "aria-label": "Go back",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold text-base", children: "Watch History" })
        ] }),
        histLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "history.loading_state", className: "pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16 bg-surface2 rounded" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 px-3 overflow-hidden", children: SKELETON_KEYS.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 w-44 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full aspect-video rounded-lg bg-surface2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full bg-surface2 rounded" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3 bg-surface2 rounded" })
          ] }, key)) })
        ] }) : historyItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "history.empty_state",
            className: "flex flex-col items-center justify-center py-16 text-center px-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-surface2 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 28, className: "text-muted-foreground/40" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No watch history yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground/60 text-xs mt-1", children: "Videos you watch will appear here" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "history.list", className: "pt-4", children: [
          orderedBuckets.map((bucket) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground px-3 mb-2", children: BUCKET_LABELS[bucket] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex gap-3 overflow-x-auto px-3 pb-2",
                style: { scrollbarWidth: "none" },
                children: buckets[bucket].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-44", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  VideoCard,
                  {
                    video: item.video,
                    index: i + 1,
                    onClick: () => handleVideoClick(item.video),
                    progress: getWatchProgressPercent(item.view.videoId)
                  }
                ) }, item.view.videoId))
              }
            )
          ] }, bucket)),
          totalCount > visibleCount && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pb-4 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": "history.secondary_button",
              onClick: () => setVisibleCount((prev) => prev + LOAD_MORE_STEP),
              className: "px-5 py-2 rounded-full bg-surface2 hover:bg-accent/30 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border/40",
              children: [
                "Load more (",
                totalCount - visibleCount,
                " remaining)"
              ]
            }
          ) })
        ] })
      ]
    }
  );
}
export {
  HistoryPage
};
