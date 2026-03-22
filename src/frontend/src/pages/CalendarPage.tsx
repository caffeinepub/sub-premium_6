import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Edit2,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type ScheduledVideoInfo,
  formatAppDateTime,
  getScheduledVideos,
  loadDateTimePrefs,
  markScheduledVideoNotified,
  nanosToDate,
  removeScheduledVideo,
  saveScheduledVideo,
} from "../utils/dateTimePrefs";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScheduledEntry extends ScheduledVideoInfo {
  thumbnailUrl?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
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
  "December",
];
const DAY_ABBRS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// ─── Component ────────────────────────────────────────────────────────────────

export function CalendarPage() {
  const { setPage } = useApp();
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const prefs = loadDateTimePrefs();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [entries, setEntries] = useState<ScheduledEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);

  // Load entries from localStorage (+ optionally backend)
  const loadEntries = async () => {
    setLoading(true);
    try {
      const local = getScheduledVideos();
      // If actor is available, try to sync with backend scheduled videos
      if (actor && identity) {
        try {
          // Try backend listScheduledVideos if available
          const backendFn = (actor as unknown as Record<string, unknown>)
            .listScheduledVideos;
          if (typeof backendFn === "function") {
            const backendVideos = await (
              backendFn as () => Promise<
                Array<{
                  id: string;
                  title: string;
                  scheduledPublishTime?: bigint[];
                }>
              >
            ).call(actor);
            for (const v of backendVideos) {
              const rawTime = v.scheduledPublishTime?.[0];
              if (rawTime) {
                const publishTime = nanosToDate(rawTime).getTime();
                const existing = local.find((l) => l.videoId === v.id);
                if (!existing) {
                  saveScheduledVideo({
                    videoId: v.id,
                    title: v.title,
                    publishTime,
                    notified: false,
                  });
                }
              }
            }
          }
        } catch {
          // Backend method may not exist yet — ignore
        }
      }
      setEntries(getScheduledVideos());
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-publish check: mark past entries as notified
  useEffect(() => {
    const now = Date.now();
    for (const e of entries) {
      if (!e.notified && e.publishTime <= now) {
        markScheduledVideoNotified(e.videoId);
        // Try to set status on backend
        if (actor) {
          actor.updateVideoStatus(e.videoId, "ready").catch(() => {});
        }
      }
    }
  }, [entries, actor]);

  // Calendar helpers
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const scheduledByDay = useMemo(() => {
    const map: Record<number, ScheduledEntry[]> = {};
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

  const selectedEntries = selectedDay
    ? (scheduledByDay[selectedDay] ?? [])
    : [];

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

  function handleDayClick(day: number) {
    setSelectedDay((prev) => (prev === day ? null : day));
    setEditingId(null);
  }

  function startEdit(entry: ScheduledEntry) {
    const d = new Date(entry.publishTime);
    const pad = (n: number) => String(n).padStart(2, "0");
    const local = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    setEditValue(local);
    setEditError("");
    setEditingId(entry.videoId);
  }

  async function handleSaveEdit(entry: ScheduledEntry) {
    if (!editValue) {
      setEditError("Please select a date and time.");
      return;
    }
    const newDate = new Date(editValue);
    if (newDate <= new Date()) {
      setEditError("Schedule must be in the future.");
      return;
    }
    setSaving(true);
    try {
      // Try backend
      if (actor) {
        try {
          const updateFn = (actor as unknown as Record<string, unknown>)
            .updateSchedule;
          if (typeof updateFn === "function") {
            await (updateFn as (id: string, t: bigint) => Promise<void>).call(
              actor,
              entry.videoId,
              BigInt(newDate.getTime()) * 1_000_000n,
            );
          }
        } catch {
          // Backend method may not exist — ignore
        }
      }
      saveScheduledVideo({ ...entry, publishTime: newDate.getTime() });
      setEntries(getScheduledVideos());
      setEditingId(null);
      toast.success("Schedule updated!");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancelSchedule(entry: ScheduledEntry) {
    try {
      if (actor) {
        try {
          const cancelFn = (actor as unknown as Record<string, unknown>)
            .cancelSchedule;
          if (typeof cancelFn === "function") {
            await (cancelFn as (id: string) => Promise<void>).call(
              actor,
              entry.videoId,
            );
          } else {
            await actor.updateVideoStatus(entry.videoId, "ready");
          }
        } catch {
          // ignore
        }
      }
      removeScheduledVideo(entry.videoId);
      setEntries(getScheduledVideos());
      if (selectedDay && !(scheduledByDay[selectedDay]?.length > 1)) {
        setSelectedDay(null);
      }
      toast.success("Schedule cancelled");
    } catch {
      toast.error("Failed to cancel schedule");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 overflow-y-auto pb-20"
    >
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-[#121212]/95 backdrop-blur border-b border-white/10">
        <button
          type="button"
          data-ocid="calendar.close_button"
          onClick={() => setPage("menu")}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <CalendarDays className="h-5 w-5 text-orange-400" />
        <h1 className="text-base font-semibold tracking-tight">
          Scheduled Videos
        </h1>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Not logged in */}
        {!identity && (
          <div
            data-ocid="calendar.empty_state"
            className="flex flex-col items-center gap-3 py-16 text-center"
          >
            <CalendarDays className="h-12 w-12 text-white/20" />
            <p className="text-sm text-white/50">
              Sign in to see your scheduled videos.
            </p>
          </div>
        )}

        {identity && (
          <>
            {/* Month navigation */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                data-ocid="calendar.pagination_prev"
                onClick={prevMonth}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm transition-colors"
              >
                ‹
              </button>
              <span className="font-semibold text-sm">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                data-ocid="calendar.pagination_next"
                onClick={nextMonth}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm transition-colors"
              >
                ›
              </button>
            </div>

            {/* Day-of-week labels */}
            <div className="grid grid-cols-7 text-center">
              {DAY_ABBRS.map((d) => (
                <div
                  key={d}
                  className="py-1 text-[10px] font-semibold text-white/40 uppercase tracking-wider"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            {loading ? (
              <div
                data-ocid="calendar.loading_state"
                className="flex justify-center py-8"
              >
                <Loader2 className="h-6 w-6 animate-spin text-orange-400" />
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable calendar padding
                  <div key={`pad-${viewYear}-${viewMonth}-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (day) => {
                    const hasEntries = !!scheduledByDay[day]?.length;
                    const isToday =
                      today.getFullYear() === viewYear &&
                      today.getMonth() === viewMonth &&
                      today.getDate() === day;
                    const isSelected = selectedDay === day;

                    return (
                      <button
                        key={day}
                        type="button"
                        data-ocid="calendar.canvas_target"
                        onClick={() => handleDayClick(day)}
                        className={`
                        relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-colors
                        ${isSelected ? "bg-orange-500 text-white font-bold" : isToday ? "bg-orange-500/20 text-orange-400 font-semibold" : "hover:bg-white/10 text-white"}
                      `}
                      >
                        {day}
                        {hasEntries && (
                          <span
                            className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-orange-400"}`}
                          />
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            )}

            {/* Selected day panel */}
            <AnimatePresence>
              {selectedDay && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="rounded-2xl bg-[#1A1A1A] border border-white/10 overflow-hidden"
                  data-ocid="calendar.panel"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <span className="text-sm font-semibold text-white/80">
                      {MONTH_NAMES[viewMonth]} {selectedDay}, {viewYear}
                    </span>
                    <button
                      type="button"
                      data-ocid="calendar.close_button"
                      onClick={() => setSelectedDay(null)}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4 text-white/50" />
                    </button>
                  </div>

                  {selectedEntries.length === 0 ? (
                    <div
                      data-ocid="calendar.empty_state"
                      className="px-4 py-8 text-center text-sm text-white/40"
                    >
                      No videos scheduled for this day.
                    </div>
                  ) : (
                    <div className="divide-y divide-white/10">
                      {selectedEntries.map((entry, idx) => (
                        <div
                          key={entry.videoId}
                          data-ocid={`calendar.item.${idx + 1}`}
                          className="px-4 py-4 space-y-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white line-clamp-2">
                                {entry.title}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Clock className="h-3 w-3 text-orange-400" />
                                <span className="text-xs text-orange-400">
                                  {formatAppDateTime(
                                    new Date(entry.publishTime),
                                    prefs,
                                  )}
                                </span>
                              </div>
                              {entry.publishTime > Date.now() ? (
                                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                  SCHEDULED
                                </span>
                              ) : (
                                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                                  PUBLISHED
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Edit form */}
                          <AnimatePresence>
                            {editingId === entry.videoId && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2"
                              >
                                <input
                                  type="datetime-local"
                                  value={editValue}
                                  min={new Date().toISOString().slice(0, 16)}
                                  onChange={(e) => {
                                    setEditValue(e.target.value);
                                    setEditError("");
                                  }}
                                  className="w-full bg-[#242424] text-white border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/60"
                                  data-ocid="calendar.input"
                                />
                                {editError && (
                                  <p
                                    className="text-xs text-red-400"
                                    data-ocid="calendar.error_state"
                                  >
                                    {editError}
                                  </p>
                                )}
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs"
                                    onClick={() => handleSaveEdit(entry)}
                                    disabled={saving}
                                    data-ocid="calendar.save_button"
                                  >
                                    {saving ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                                    ) : null}
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 border-white/20 text-white/70 text-xs hover:bg-white/10"
                                    onClick={() => setEditingId(null)}
                                    data-ocid="calendar.cancel_button"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Actions */}
                          {editingId !== entry.videoId && (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                data-ocid={`calendar.edit_button.${idx + 1}`}
                                onClick={() => startEdit(entry)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white/70 transition-colors"
                              >
                                <Edit2 className="h-3 w-3" /> Edit Schedule
                              </button>
                              <button
                                type="button"
                                data-ocid={`calendar.delete_button.${idx + 1}`}
                                onClick={() => handleCancelSchedule(entry)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" /> Cancel Schedule
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty overall state */}
            {entries.length === 0 && !loading && (
              <div
                data-ocid="calendar.empty_state"
                className="flex flex-col items-center gap-3 py-10 text-center"
              >
                <CalendarDays className="h-10 w-10 text-white/20" />
                <p className="text-sm text-white/50">No scheduled videos.</p>
                <p className="text-xs text-white/30">
                  Schedule a video from the Upload page.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
