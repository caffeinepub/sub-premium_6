import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Pause,
  Play,
  RefreshCw,
  Upload,
  Video,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { type JobStatus, useUploadQueue } from "../context/UploadQueueContext";

const STATUS_COLORS: Record<JobStatus, string> = {
  queued: "bg-zinc-500/20 text-zinc-400",
  uploading: "bg-orange/20 text-orange",
  paused: "bg-sky-500/20 text-sky-400",
  processing: "bg-purple-500/20 text-purple-400",
  completed: "bg-green-500/20 text-green-400",
  failed: "bg-red-500/20 text-red-400",
};

const STATUS_LABELS: Record<JobStatus, string> = {
  queued: "Queued",
  uploading: "Uploading",
  paused: "Paused",
  processing: "Processing",
  completed: "Done",
  failed: "Failed",
};

function SummaryText({
  activeCount,
  queuedCount,
}: {
  activeCount: number;
  queuedCount: number;
}) {
  const parts: string[] = [];
  if (activeCount > 0) parts.push(`${activeCount} uploading`);
  if (queuedCount > 0) parts.push(`${queuedCount} in queue`);
  if (parts.length === 0) return <>All done</>;
  return <>{parts.join(" • ")}</>;
}

export function GlobalUploadManager() {
  const {
    jobs,
    activeCount,
    queuedCount,
    pauseJob,
    resumeJob,
    cancelJob,
    retryJob,
    dismissJob,
  } = useUploadQueue();

  const [isOpen, setIsOpen] = useState(false);

  const hasAny = jobs.length > 0;
  if (!hasAny) return null;

  const hasActive = activeCount > 0 || queuedCount > 0;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            data-ocid="upload_manager.open_modal_button"
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-[88px] right-4 z-50 flex items-center gap-2 bg-orange text-white rounded-full shadow-lg shadow-orange/30 px-3.5 py-2.5 hover:bg-orange/90 active:scale-95 transition-transform"
          >
            <Upload
              size={16}
              className={activeCount > 0 ? "animate-bounce" : ""}
            />
            {activeCount > 0 && (
              <span className="text-xs font-bold w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
            <span className="text-xs font-semibold max-w-[120px] truncate">
              <SummaryText
                activeCount={activeCount}
                queuedCount={queuedCount}
              />
            </span>
            <ChevronUp size={14} className="opacity-70" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            data-ocid="upload_manager.panel"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed bottom-[72px] right-0 left-0 mx-auto w-full max-w-[430px] z-50 px-3"
          >
            <div className="bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                <Upload size={16} className="text-orange flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">Uploads</p>
                  <p className="text-[11px] text-zinc-400">
                    <SummaryText
                      activeCount={activeCount}
                      queuedCount={queuedCount}
                    />
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid="upload_manager.close_button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/8 transition-colors text-zinc-400"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              {/* Leave page notice */}
              <AnimatePresence>
                {hasActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 px-4 py-2 bg-sky-500/10 border-b border-sky-500/20">
                      <Info size={13} className="text-sky-400 flex-shrink-0" />
                      <p className="text-[11px] text-sky-300">
                        Uploading… You can leave this page safely
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Job list */}
              <div className="overflow-y-auto max-h-[50vh]">
                <AnimatePresence initial={false}>
                  {jobs.map((job, idx) => (
                    <motion.div
                      key={job.id}
                      layout
                      data-ocid={`upload_manager.item.${idx + 1}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-white/6 last:border-0"
                    >
                      <div className="px-4 py-3 space-y-2">
                        {/* Row 1: thumb + title + status */}
                        <div className="flex items-start gap-3">
                          {/* Thumbnail */}
                          <div className="w-11 h-8 rounded-md overflow-hidden bg-white/8 flex-shrink-0 flex items-center justify-center">
                            {job.thumbnailUrl ? (
                              <img
                                src={job.thumbnailUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Video size={16} className="text-zinc-500" />
                            )}
                          </div>

                          {/* Title + status */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate leading-tight">
                              {job.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${STATUS_COLORS[job.status]}`}
                              >
                                {STATUS_LABELS[job.status]}
                              </span>
                              {job.status === "uploading" && (
                                <span className="text-[10px] text-orange font-semibold">
                                  {job.progress}%
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {job.status === "uploading" && (
                              <button
                                type="button"
                                data-ocid={`upload_manager.toggle.${idx + 1}`}
                                onClick={() => pauseJob(job.id)}
                                className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-zinc-400"
                                title="Pause"
                              >
                                <Pause size={13} />
                              </button>
                            )}
                            {job.status === "paused" && (
                              <button
                                type="button"
                                data-ocid={`upload_manager.toggle.${idx + 1}`}
                                onClick={() => resumeJob(job.id)}
                                className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-sky-400"
                                title="Resume"
                              >
                                <Play size={13} />
                              </button>
                            )}
                            {job.status === "failed" && (
                              <button
                                type="button"
                                data-ocid={`upload_manager.secondary_button.${idx + 1}`}
                                onClick={() => retryJob(job.id)}
                                className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-orange"
                                title="Retry"
                              >
                                <RefreshCw size={13} />
                              </button>
                            )}
                            {(job.status === "completed" ||
                              job.status === "failed") && (
                              <button
                                type="button"
                                data-ocid={`upload_manager.close_button.${idx + 1}`}
                                onClick={() =>
                                  job.status === "completed"
                                    ? dismissJob(job.id)
                                    : cancelJob(job.id)
                                }
                                className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-zinc-500"
                                title="Dismiss"
                              >
                                <X size={13} />
                              </button>
                            )}
                            {(job.status === "queued" ||
                              job.status === "uploading") && (
                              <button
                                type="button"
                                data-ocid={`upload_manager.delete_button.${idx + 1}`}
                                onClick={() => cancelJob(job.id)}
                                className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-zinc-500"
                                title="Cancel"
                              >
                                <X size={13} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Progress bar */}
                        {(job.status === "uploading" ||
                          job.status === "processing") && (
                          <div className="space-y-1">
                            <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-orange"
                                style={{ width: `${job.progress}%` }}
                                transition={{
                                  type: "tween",
                                  ease: "linear",
                                  duration: 0.3,
                                }}
                              />
                            </div>
                            {job.status === "uploading" && job.totalMB > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-zinc-500">
                                  {job.uploadedMB.toFixed(1)} /{" "}
                                  {job.totalMB.toFixed(1)} MB
                                  {job.uploadSpeed && (
                                    <>
                                      {" "}
                                      ·{" "}
                                      <span className="text-orange/70">
                                        {job.uploadSpeed}
                                      </span>
                                    </>
                                  )}
                                </span>
                                {job.timeRemaining && (
                                  <span className="text-[10px] text-zinc-600">
                                    ~{job.timeRemaining} left
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Status icons for completed/failed */}
                        {job.status === "completed" && (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle size={13} className="text-green-400" />
                            <span className="text-[11px] text-green-400 font-medium">
                              Upload complete — now processing
                            </span>
                          </div>
                        )}
                        {job.status === "failed" && job.errorMsg && (
                          <div className="flex items-center gap-1.5">
                            <XCircle size={13} className="text-red-400" />
                            <span className="text-[10px] text-red-400 leading-snug">
                              {job.errorMsg}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
