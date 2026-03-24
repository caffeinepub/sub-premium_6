import { d as createLucideIcon, u as useApp, g as useInternetIdentity, k as useActor, l as loadDateTimePrefs, r as reactExports, n as markScheduledVideoNotified, j as jsxRuntimeExports, m as motion, L as LoaderCircle, A as AnimatePresence, X, o as formatAppDateTime, p as Button, T as Trash2, q as getScheduledVideos, s as nanosToDate, t as saveScheduledVideo, e as ue, v as removeScheduledVideo } from "./index-DSOyFnVG.js";
import { A as ArrowLeft } from "./arrow-left-FCtMkwAX.js";
import { C as CalendarDays } from "./calendar-days-D3ElAG3s.js";
import { C as Clock } from "./clock-_PitsIeG.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode);
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const DAY_ABBRS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
function CalendarPage() {
  const { setPage } = useApp();
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const prefs = loadDateTimePrefs();
  const today = /* @__PURE__ */ new Date();
  const [viewYear, setViewYear] = reactExports.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = reactExports.useState(today.getMonth());
  const [selectedDay, setSelectedDay] = reactExports.useState(null);
  const [entries, setEntries] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editValue, setEditValue] = reactExports.useState("");
  const [editError, setEditError] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const loadEntries = async () => {
    var _a;
    setLoading(true);
    try {
      const local = getScheduledVideos();
      if (actor && identity) {
        try {
          const backendFn = actor.listScheduledVideos;
          if (typeof backendFn === "function") {
            const backendVideos = await backendFn.call(actor);
            for (const v of backendVideos) {
              const rawTime = (_a = v.scheduledPublishTime) == null ? void 0 : _a[0];
              if (rawTime) {
                const publishTime = nanosToDate(rawTime).getTime();
                const existing = local.find((l) => l.videoId === v.id);
                if (!existing) {
                  saveScheduledVideo({
                    videoId: v.id,
                    title: v.title,
                    publishTime,
                    notified: false
                  });
                }
              }
            }
          }
        } catch {
        }
      }
      setEntries(getScheduledVideos());
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    loadEntries();
  }, []);
  reactExports.useEffect(() => {
    const now = Date.now();
    for (const e of entries) {
      if (!e.notified && e.publishTime <= now) {
        markScheduledVideoNotified(e.videoId);
        if (actor) {
          actor.updateVideoStatus(e.videoId, "ready").catch(() => {
          });
        }
      }
    }
  }, [entries, actor]);
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const scheduledByDay = reactExports.useMemo(() => {
    const map = {};
    for (const entry of entries) {
      const d = new Date(entry.publishTime);
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(entry);
      }
    }
    return map;
  }, [entries, viewYear, viewMonth]);
  const selectedEntries = selectedDay ? scheduledByDay[selectedDay] ?? [] : [];
  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
    setSelectedDay(null);
  }
  function handleDayClick(day) {
    setSelectedDay((prev) => prev === day ? null : day);
    setEditingId(null);
  }
  function startEdit(entry) {
    const d = new Date(entry.publishTime);
    const pad = (n) => String(n).padStart(2, "0");
    const local = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    setEditValue(local);
    setEditError("");
    setEditingId(entry.videoId);
  }
  async function handleSaveEdit(entry) {
    if (!editValue) {
      setEditError("Please select a date and time.");
      return;
    }
    const newDate = new Date(editValue);
    if (newDate <= /* @__PURE__ */ new Date()) {
      setEditError("Schedule must be in the future.");
      return;
    }
    setSaving(true);
    try {
      if (actor) {
        try {
          const updateFn = actor.updateSchedule;
          if (typeof updateFn === "function") {
            await updateFn.call(
              actor,
              entry.videoId,
              BigInt(newDate.getTime()) * 1000000n
            );
          }
        } catch {
        }
      }
      saveScheduledVideo({ ...entry, publishTime: newDate.getTime() });
      setEntries(getScheduledVideos());
      setEditingId(null);
      ue.success("Schedule updated!");
    } finally {
      setSaving(false);
    }
  }
  async function handleCancelSchedule(entry) {
    var _a;
    try {
      if (actor) {
        try {
          const cancelFn = actor.cancelSchedule;
          if (typeof cancelFn === "function") {
            await cancelFn.call(
              actor,
              entry.videoId
            );
          } else {
            await actor.updateVideoStatus(entry.videoId, "ready");
          }
        } catch {
        }
      }
      removeScheduledVideo(entry.videoId);
      setEntries(getScheduledVideos());
      if (selectedDay && !(((_a = scheduledByDay[selectedDay]) == null ? void 0 : _a.length) > 1)) {
        setSelectedDay(null);
      }
      ue.success("Schedule cancelled");
    } catch {
      ue.error("Failed to cancel schedule");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      className: "flex-1 overflow-y-auto pb-20",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-[#121212]/95 backdrop-blur border-b border-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "calendar.close_button",
              onClick: () => setPage("menu"),
              className: "p-1.5 rounded-full hover:bg-white/10 transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-5 w-5 text-orange-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-base font-semibold tracking-tight", children: "Scheduled Videos" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-5 space-y-5", children: [
          !identity && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "calendar.empty_state",
              className: "flex flex-col items-center gap-3 py-16 text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-12 w-12 text-white/20" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/50", children: "Sign in to see your scheduled videos." })
              ]
            }
          ),
          identity && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "calendar.pagination_prev",
                  onClick: prevMonth,
                  className: "px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm transition-colors",
                  children: "‹"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-sm", children: [
                MONTH_NAMES[viewMonth],
                " ",
                viewYear
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "calendar.pagination_next",
                  onClick: nextMonth,
                  className: "px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm transition-colors",
                  children: "›"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 text-center", children: DAY_ABBRS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "py-1 text-[10px] font-semibold text-white/40 uppercase tracking-wider",
                children: d
              },
              d
            )) }),
            loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "data-ocid": "calendar.loading_state",
                className: "flex justify-center py-8",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-orange-400" })
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-1", children: [
              Array.from({ length: firstDay }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: stable calendar padding
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}, `pad-${viewYear}-${viewMonth}-${i}`)
              )),
              Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                (day) => {
                  var _a;
                  const hasEntries = !!((_a = scheduledByDay[day]) == null ? void 0 : _a.length);
                  const isToday = today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;
                  const isSelected = selectedDay === day;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "calendar.canvas_target",
                      onClick: () => handleDayClick(day),
                      className: `
                        relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-colors
                        ${isSelected ? "bg-orange-500 text-white font-bold" : isToday ? "bg-orange-500/20 text-orange-400 font-semibold" : "hover:bg-white/10 text-white"}
                      `,
                      children: [
                        day,
                        hasEntries && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-orange-400"}`
                          }
                        )
                      ]
                    },
                    day
                  );
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: selectedDay && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 8 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 8 },
                className: "rounded-2xl bg-[#1A1A1A] border border-white/10 overflow-hidden",
                "data-ocid": "calendar.panel",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-white/10", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-white/80", children: [
                      MONTH_NAMES[viewMonth],
                      " ",
                      selectedDay,
                      ", ",
                      viewYear
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "calendar.close_button",
                        onClick: () => setSelectedDay(null),
                        className: "p-1 hover:bg-white/10 rounded-lg transition-colors",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-white/50" })
                      }
                    )
                  ] }),
                  selectedEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      "data-ocid": "calendar.empty_state",
                      className: "px-4 py-8 text-center text-sm text-white/40",
                      children: "No videos scheduled for this day."
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-white/10", children: selectedEntries.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": `calendar.item.${idx + 1}`,
                      className: "px-4 py-4 space-y-3",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-white line-clamp-2", children: entry.title }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 text-orange-400" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-orange-400", children: formatAppDateTime(
                              new Date(entry.publishTime),
                              prefs
                            ) })
                          ] }),
                          entry.publishTime > Date.now() ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30", children: "SCHEDULED" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30", children: "PUBLISHED" })
                        ] }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: editingId === entry.videoId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          motion.div,
                          {
                            initial: { opacity: 0, height: 0 },
                            animate: { opacity: 1, height: "auto" },
                            exit: { opacity: 0, height: 0 },
                            className: "space-y-2",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "input",
                                {
                                  type: "datetime-local",
                                  value: editValue,
                                  min: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16),
                                  onChange: (e) => {
                                    setEditValue(e.target.value);
                                    setEditError("");
                                  },
                                  className: "w-full bg-[#242424] text-white border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/60",
                                  "data-ocid": "calendar.input"
                                }
                              ),
                              editError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "p",
                                {
                                  className: "text-xs text-red-400",
                                  "data-ocid": "calendar.error_state",
                                  children: editError
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  Button,
                                  {
                                    size: "sm",
                                    className: "flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs",
                                    onClick: () => handleSaveEdit(entry),
                                    disabled: saving,
                                    "data-ocid": "calendar.save_button",
                                    children: [
                                      saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin mr-1" }) : null,
                                      "Save"
                                    ]
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  Button,
                                  {
                                    size: "sm",
                                    variant: "outline",
                                    className: "flex-1 border-white/20 text-white/70 text-xs hover:bg-white/10",
                                    onClick: () => setEditingId(null),
                                    "data-ocid": "calendar.cancel_button",
                                    children: "Cancel"
                                  }
                                )
                              ] })
                            ]
                          }
                        ) }),
                        editingId !== entry.videoId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "button",
                            {
                              type: "button",
                              "data-ocid": `calendar.edit_button.${idx + 1}`,
                              onClick: () => startEdit(entry),
                              className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white/70 transition-colors",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3 w-3" }),
                                " Edit Schedule"
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "button",
                            {
                              type: "button",
                              "data-ocid": `calendar.delete_button.${idx + 1}`,
                              onClick: () => handleCancelSchedule(entry),
                              className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 transition-colors",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }),
                                " Cancel Schedule"
                              ]
                            }
                          )
                        ] })
                      ]
                    },
                    entry.videoId
                  )) })
                ]
              }
            ) }),
            entries.length === 0 && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "calendar.empty_state",
                className: "flex flex-col items-center gap-3 py-10 text-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-10 w-10 text-white/20" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/50", children: "No scheduled videos." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/30", children: "Schedule a video from the Upload page." })
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  CalendarPage
};
