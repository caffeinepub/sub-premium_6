import { CheckCircle, Upload, X, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useApp } from "../context/AppContext";
import { useUpload } from "../context/UploadContext";

export function UploadProgressBar() {
  const { setPage } = useApp();
  const upload = useUpload();

  const visible = upload.status !== "idle";

  const getLabel = () => {
    if (upload.status === "uploading") return `${upload.progress}%`;
    if (upload.status === "processing") return "Processing...";
    if (upload.status === "ready") return "Ready!";
    if (upload.status === "error") return "Failed";
    return "";
  };

  const canDismiss = upload.status === "ready" || upload.status === "error";

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
              ) : (
                <Upload size={18} className="text-orange" />
              )}
            </div>

            {/* Title + progress */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate text-foreground">
                {upload.title || "Uploading video"}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {(upload.status === "uploading" ||
                  upload.status === "processing") && (
                  <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-orange rounded-full"
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
                        : "text-orange"
                  }`}
                >
                  {getLabel()}
                </span>
              </div>
            </div>

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
