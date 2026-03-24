import { d as createLucideIcon, u as useApp, g as useInternetIdentity, w as getPublishTimeMs, r as reactExports, x as formatPremiereCountdown, y as isSubscribed, z as hasReminder, C as isUpcoming, j as jsxRuntimeExports, m as motion, D as formatPremiereDate, E as formatPremiereDaysLabel, F as Avatar, G as AvatarImage, H as AvatarFallback, p as Button, B as Bell, e as ue, J as markReminderNotified, K as toggleSubscription, M as removeReminder, N as setReminder } from "./index-DSOyFnVG.js";
import { A as ArrowLeft } from "./arrow-left-FCtMkwAX.js";
import { L as Lock } from "./lock-QCMAnrix.js";
import { C as Clock } from "./clock-_PitsIeG.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode);
function PremierePreviewPage({ video }) {
  var _a, _b;
  const { setPage, setSelectedVideo } = useApp();
  const { identity } = useInternetIdentity();
  const myPrincipal = identity == null ? void 0 : identity.getPrincipal().toString();
  const userId = myPrincipal ?? "anon";
  const thumbUrl = (_b = (_a = video.thumbnailBlob) == null ? void 0 : _a.getDirectURL) == null ? void 0 : _b.call(_a);
  const publishTimeMs = getPublishTimeMs(video);
  const [countdown, setCountdown] = reactExports.useState(
    publishTimeMs ? formatPremiereCountdown(publishTimeMs) : "Premieres soon"
  );
  const [isLive, setIsLive] = reactExports.useState(
    publishTimeMs ? publishTimeMs <= Date.now() : false
  );
  const [subscribed, setSubscribed] = reactExports.useState(
    () => isSubscribed(video.creatorId)
  );
  const [reminderSet, setReminderSet] = reactExports.useState(
    () => publishTimeMs ? hasReminder(userId, video.id) : false
  );
  reactExports.useEffect(() => {
    if (!publishTimeMs) return;
    const tick = () => {
      const now = Date.now();
      if (publishTimeMs <= now) {
        if (userId !== "anon" && hasReminder(userId, video.id)) {
          ue.success(`🔔 "${video.title}" is now live!`, { duration: 6e3 });
          markReminderNotified(userId, video.id);
        }
        setIsLive(true);
        setReminderSet(false);
        setCountdown("Premiering now");
        clearInterval(id);
        window.dispatchEvent(
          new CustomEvent("videoPublished", { detail: { videoId: video.id } })
        );
        ue.success(`🎬 "${video.title}" is now premiering!`);
      } else {
        setCountdown(formatPremiereCountdown(publishTimeMs));
      }
    };
    tick();
    const id = setInterval(tick, 1e3);
    return () => clearInterval(id);
  }, [publishTimeMs, video.id, video.title, userId]);
  reactExports.useEffect(() => {
    const handler = (e) => {
      const detail = e.detail;
      if (detail.videoId === video.id) {
        setIsLive(true);
        setCountdown("Premiering now");
        setTimeout(() => {
          setSelectedVideo(video);
          setPage("player");
        }, 1500);
      }
    };
    window.addEventListener("videoPublished", handler);
    return () => window.removeEventListener("videoPublished", handler);
  }, [video, setPage, setSelectedVideo]);
  reactExports.useEffect(() => {
    if (isLive && !isUpcoming(video)) {
      setTimeout(() => {
        setSelectedVideo(video);
        setPage("player");
      }, 1500);
    }
  }, [isLive, video, setPage, setSelectedVideo]);
  const handleSubscribe = () => {
    toggleSubscription(video.creatorId);
    setSubscribed((v) => !v);
  };
  const handleReminderToggle = () => {
    if (!identity) {
      ue.error("Please log in to set a reminder");
      return;
    }
    if (reminderSet) {
      removeReminder(userId, video.id);
      setReminderSet(false);
      ue.success("Reminder removed");
    } else if (publishTimeMs) {
      setReminder(userId, video.id, video.title, publishTimeMs);
      setReminderSet(true);
      ue.success(
        "🔔 Reminder set! We'll notify you when this video goes live."
      );
    }
  };
  const isOwnVideo = myPrincipal && myPrincipal === video.creatorId;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      className: "flex flex-col min-h-screen bg-background",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border/30 px-4 py-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "premiere.close_button",
              onClick: () => setPage("home"),
              className: "p-1.5 rounded-full hover:bg-white/10 transition-colors",
              "aria-label": "Go back",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold text-base truncate flex-1", children: video.title }),
          publishTimeMs && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-orange/20 text-orange", children: "Upcoming" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full aspect-video bg-[#0A0A0A] overflow-hidden", children: [
            thumbUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: thumbUrl,
                alt: video.title,
                className: "w-full h-full object-cover opacity-50"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 left-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                "data-ocid": "premiere.modal",
                className: "px-3 py-1 rounded-full bg-orange text-white text-[11px] font-black uppercase tracking-widest shadow-lg",
                children: "Upcoming"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center", children: isLive ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { scale: 0.8, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  className: "w-14 h-14 rounded-full bg-orange/20 border-2 border-orange flex items-center justify-center mb-2",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "🎬" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-black text-xl", children: "It's Live!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-xs", children: "Opening player…" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 20, className: "text-white/70" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  "data-ocid": "premiere.loading_state",
                  className: "text-white font-bold text-lg leading-tight",
                  children: countdown
                }
              ),
              publishTimeMs && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-white/60 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 11 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPremiereDate(publishTimeMs) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-white/40 text-[11px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 11 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPremiereDaysLabel(publishTimeMs) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/30 text-[10px] mt-2", children: "Video unlocks at premiere time" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground leading-snug", children: video.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-9 h-9 flex-shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: void 0 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-orange/20 text-orange text-xs font-bold", children: (video.creatorName || "U").slice(0, 2).toUpperCase() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: video.creatorName || "Unknown" }) }),
              !isOwnVideo && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  "data-ocid": "premiere.primary_button",
                  onClick: handleSubscribe,
                  className: `text-xs px-4 h-7 rounded-full font-semibold border-none ${subscribed ? "bg-white/10 text-white hover:bg-white/20" : "bg-orange hover:bg-orange/90 text-white"}`,
                  children: subscribed ? "Subscribed" : "Subscribe"
                }
              )
            ] }),
            publishTimeMs && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-orange/20 bg-orange/5 p-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-orange animate-pulse" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-orange", children: isLive ? "Now Premiering" : countdown })
              ] }),
              !isLive && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 13, className: "text-orange/60" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPremiereDate(publishTimeMs) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 13, className: "text-orange/60" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPremiereDaysLabel(publishTimeMs) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground/60", children: "The video will automatically unlock at premiere time. Come back then to watch!" })
              ] })
            ] }),
            publishTimeMs && !isLive && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "premiere.set_reminder_button",
                onClick: handleReminderToggle,
                className: `w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${reminderSet ? "bg-orange/20 text-orange border border-orange/40 hover:bg-orange/30" : "bg-white/[0.08] text-white/80 border border-white/15 hover:bg-white/[0.15]"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bell,
                    {
                      size: 16,
                      className: reminderSet ? "fill-orange text-orange" : ""
                    }
                  ),
                  reminderSet ? "Reminder Set" : "Set Reminder"
                ]
              }
            ),
            video.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: video.description })
          ] })
        ] })
      ]
    }
  );
}
export {
  PremierePreviewPage
};
