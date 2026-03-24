import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { type UploadJob, useUploadQueue } from "../context/UploadQueueContext";

interface UploadingVideoCardProps {
  job: UploadJob;
}

function BlockProgressBar({ progress }: { progress: number }) {
  const total = 13;
  const filled = Math.round((progress / 100) * total);
  return (
    <div className="font-mono text-[11px] tracking-tight select-none">
      <span className="text-orange">{"█".repeat(filled)}</span>
      <span className="text-white/20">{"░".repeat(total - filled)}</span>
    </div>
  );
}

export function UploadingVideoCard({ job }: UploadingVideoCardProps) {
  const { retryJob } = useUploadQueue();
  const [showReady, setShowReady] = useState(false);

  // Show "Ready" briefly when completed before it auto-disappears from feed
  useEffect(() => {
    if (job.status === "completed") {
      setShowReady(true);
    }
  }, [job.status]);

  const isUploading =
    job.status === "uploading" ||
    job.status === "queued" ||
    job.status === "paused";
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

  return (
    <div className="bg-surface2/60 border border-white/8 rounded-xl overflow-hidden mb-3 mx-3 animate-fade-up">
      <div className="flex gap-3 p-3">
        {/* Thumbnail */}
        <div className="w-20 h-14 rounded-lg overflow-hidden bg-black/40 flex-shrink-0 flex items-center justify-center">
          {job.thumbnailUrl ? (
            <img
              src={job.thumbnailUrl}
              alt={job.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              aria-hidden="true"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M5 4L19 12L5 20V4Z" fill="oklch(0.68 0.18 35 / 0.4)" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* Title */}
          <p className="text-[13px] font-semibold text-foreground line-clamp-1 leading-snug mb-1">
            🎬 {job.title}
          </p>

          {/* Status text */}
          <p className={`text-[11px] font-semibold ${statusColor} mb-1.5`}>
            {statusText}
          </p>

          {/* Progress bar */}
          {(isUploading || isProcessing) && (
            <>
              {isUploading && <BlockProgressBar progress={job.progress} />}
              {isProcessing && (
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-400 rounded-full animate-pulse"
                    style={{ width: "60%" }}
                  />
                </div>
              )}
            </>
          )}

          {/* Smooth progress bar for uploading */}
          {isUploading && job.progress > 0 && (
            <div className="mt-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange rounded-full transition-all duration-300"
                style={{ width: `${job.progress}%` }}
              />
            </div>
          )}

          {/* Retry button */}
          {isFailed && (
            <button
              type="button"
              onClick={() => retryJob(job.id)}
              className="mt-1.5 flex items-center gap-1.5 text-[11px] text-orange font-semibold hover:text-orange/80 transition-colors"
            >
              <RefreshCw size={11} />
              Retry upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
