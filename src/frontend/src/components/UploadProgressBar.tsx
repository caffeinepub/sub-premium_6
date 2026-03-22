import {
  CheckCircle,
  RefreshCw,
  RotateCcw,
  Upload,
  WifiOff,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useApp } from "../context/AppContext";
import { useUpload } from "../context/UploadContext";

export function UploadProgressBar() {
  const { setPage } = useApp();
  const upload = useUpload();

  const visible = upload.status !== "idle";
  const showOffline = upload.isOffline && upload.isActive;

  const getLabel = () => {
    if (showOffline) return "Offline";
    if (upload.status === "uploading") {
      if (upload.isResuming) return `Resuming from ${upload.progress}%`;
      return `${upload.progress}%`;
    }
    if (upload.status === "processing") return "Processing...";
    if (upload.status === "ready") return "Ready!";
    if (upload.status === "error") return "Failed";
    return "";
  };

  const canDismiss = upload.status === "ready" || upload.status === "error";

  // "X.X / Y.Y MB" display
  const mbLabel =
    upload.status === "uploading" && upload.totalMB > 0 && !showOffline
      ? `${upload.uploadedMB.toFixed(1)} / ${upload.totalMB.toFixed(1)} MB`
      : null;

  // "Chunk N/T" display
  const chunkLabel =
    upload.status === "uploading" && upload.totalChunks > 0 && !showOffline
      ? `Chunk ${upload.chunkIndex}/${upload.totalChunks}`
      : null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-[72px] left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 px-3"
        >
          <button
            type="button"
            data-ocid="upload.toast"
            onClick={() => setPage("upload")}
            className="w-full bg-surface2 border border-border rounded-xl px-3 py-2.5 flex items-center gap-3 shadow-lg"
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              {upload.status === "ready" ? (
                <CheckCircle size={18} className="text-green-online" />
              ) : upload.status === "error" ? (
                <XCircle size={18} className="text-destructive" />
              ) : showOffline ? (
                <WifiOff size={18} className="text-amber-400" />
              ) : upload.isResuming ? (
                <RotateCcw size={18} className="text-sky-400 animate-spin" />
              ) : (
                <Upload size={18} className="text-orange" />
              )}
            </div>

            {/* Title + progress */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium truncate text-foreground">
                  {upload.title || "Uploading video"}
                </p>
                {upload.isResuming &&
                  upload.status === "uploading" &&
                  !showOffline && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 uppercase tracking-wide flex-shrink-0">
                      Resuming
                    </span>
                  )}
                {showOffline && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 uppercase tracking-wide flex-shrink-0">
                    Paused
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-2 mt-0.5">
                {(upload.status === "uploading" ||
                  upload.status === "processing") && (
                  <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        showOffline
                          ? "bg-amber-400/50"
                          : upload.isResuming
                            ? "bg-sky-400"
                            : "bg-orange"
                      }`}
                      style={{ width: `${upload.progress}%` }}
                      transition={{ type: "tween", ease: "linear" }}
                    />
                  </div>
                )}
                <span
                  className={`text-[11px] font-semibold flex-shrink-0 ${
                    upload.status === "ready"
                      ? "text-green-online"
                      : upload.status === "error"
                        ? "text-destructive"
                        : showOffline
                          ? "text-amber-400"
                          : upload.isResuming
                            ? "text-sky-400"
                            : "text-orange"
                  }`}
                >
                  {getLabel()}
                </span>
              </div>

              {/* Offline sub-label */}
              {showOffline && (
                <p className="text-[10px] text-amber-400/70 mt-0.5">
                  Waiting for network...
                </p>
              )}

              {/* MB + Chunk + Speed row */}
              {upload.status === "uploading" && !showOffline && (
                <p className="text-[10px] text-muted-foreground mt-0.5 flex gap-2 flex-wrap">
                  {mbLabel && (
                    <span className="font-medium text-foreground/60">
                      {mbLabel}
                    </span>
                  )}
                  {chunkLabel && (
                    <span className="opacity-50">{chunkLabel}</span>
                  )}
                  {upload.uploadSpeed && (
                    <span className="text-orange/70">{upload.uploadSpeed}</span>
                  )}
                  {upload.timeRemaining && (
                    <span className="opacity-50">
                      ~{upload.timeRemaining} left
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Retry button when error */}
            {upload.status === "error" && (
              <button
                type="button"
                data-ocid="upload.secondary_button"
                onClick={(e) => {
                  e.stopPropagation();
                  upload.retry();
                }}
                className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-orange text-orange text-[11px] font-bold hover:bg-orange/10 transition-colors"
                aria-label="Retry upload"
              >
                <RefreshCw size={11} />
                Retry
              </button>
            )}

            {/* Dismiss button */}
            {canDismiss && (
              <button
                type="button"
                data-ocid="upload.close_button"
                onClick={(e) => {
                  e.stopPropagation();
                  upload.reset();
                }}
                className="flex-shrink-0 p-1 rounded-full hover:bg-accent transition-colors"
                aria-label="Dismiss"
              >
                <X size={14} className="text-muted-foreground" />
              </button>
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
