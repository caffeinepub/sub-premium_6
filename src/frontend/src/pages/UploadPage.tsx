import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  FileVideo,
  Image,
  RefreshCw,
  RotateCcw,
  Subtitles,
  Upload,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { CaptionManager } from "../components/CaptionManager";
import { useApp } from "../context/AppContext";
import { useUpload } from "../context/UploadContext";

const MAX_BLOCK_MB = 4 * 1024; // 4 GB in MB
const MAX_WARN_MB = 500; // 500 MB

export function UploadPage() {
  const { setPage, justUploadedVideoId } = useApp();
  const upload = useUpload();

  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [hasResumeState, setHasResumeState] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const videoSizeMB = videoFile ? videoFile.size / (1024 * 1024) : 0;
  const isFileTooLarge = videoSizeMB > MAX_BLOCK_MB;
  const showFileSizeWarning = !isFileTooLarge && videoSizeMB > MAX_WARN_MB;

  const handleVideoSelect = async (file: File | undefined) => {
    if (!file) return;
    setVideoFile(file);
    setHasResumeState(false);
    // Check IndexedDB for a matching interrupted upload
    const canResume = await upload.checkResume(file);
    if (canResume) {
      setHasResumeState(true);
      // Pre-fill the title from the saved record
      if (upload.title) setTitle(upload.title);
    }
  };

  const getStatusLabel = () => {
    if (upload.status === "uploading") {
      if (upload.isResuming) return "Resuming upload...";
      return `Uploading... ${upload.progress}%`;
    }
    if (upload.status === "processing") return "Processing video...";
    if (upload.status === "ready") return "Upload complete!";
    if (upload.status === "error") return upload.errorMsg || "Upload failed";
    return "";
  };

  const handleUpload = () => {
    if (!videoFile) {
      toast.error("Please select a video file");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (isFileTooLarge) {
      toast.error(
        "File exceeds 4 GB limit. Please compress or trim your video.",
      );
      return;
    }
    upload.startUpload({
      title: title.trim(),
      videoFile,
      thumbnailFile: thumbFile,
    });
  };

  const isUploading = upload.isActive;
  const showProgress = upload.status !== "idle";
  const uploadReady = upload.status === "ready" && !!justUploadedVideoId;

  // Rich progress: "X.X / Y.Y MB · Chunk N/T"
  const mbDisplay =
    upload.totalMB > 0
      ? `${upload.uploadedMB.toFixed(1)} / ${upload.totalMB.toFixed(1)} MB`
      : null;
  const chunkDisplay =
    upload.totalChunks > 0
      ? `Chunk ${upload.chunkIndex} / ${upload.totalChunks}`
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 overflow-y-auto pb-20"
    >
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          data-ocid="upload.close_button"
          onClick={() => setPage("home")}
          className="p-1.5 rounded-full hover:bg-accent transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-base">Upload Video</h1>
        {isUploading && (
          <span
            className={`ml-auto text-xs animate-pulse ${
              upload.isResuming ? "text-sky-400" : "text-orange"
            }`}
          >
            {upload.isResuming
              ? "Resuming in background..."
              : "Uploading in background..."}
          </span>
        )}
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Video file picker */}
        <div>
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Video File *
          </Label>
          <button
            type="button"
            data-ocid="upload.upload_button"
            onClick={() => !isUploading && videoInputRef.current?.click()}
            disabled={isUploading}
            className="w-full border-2 border-dashed border-border hover:border-orange/50 rounded-xl p-6 flex flex-col items-center gap-3 transition-colors disabled:opacity-50"
          >
            {videoFile ? (
              <>
                <FileVideo size={32} className="text-orange" />
                <p className="text-sm font-medium text-foreground truncate max-w-full px-4">
                  {videoFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {videoSizeMB.toFixed(1)} MB
                </p>
              </>
            ) : (
              <>
                <Upload size={32} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Tap to select video
                </p>
                <p className="text-xs text-muted-foreground/60">
                  MP4, MOV, AVI, WebM · Max 4 GB
                </p>
              </>
            )}
          </button>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => handleVideoSelect(e.target.files?.[0])}
          />
        </div>

        {/* File too large error */}
        <AnimatePresence>
          {isFileTooLarge && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              data-ocid="upload.error_state"
              className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 flex items-start gap-3"
            >
              <XCircle
                size={16}
                className="text-destructive mt-0.5 flex-shrink-0"
              />
              <p className="text-sm text-destructive">
                File exceeds 4 GB limit. Please compress or trim your video
                before uploading.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* File size warning */}
        <AnimatePresence>
          {showFileSizeWarning && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              data-ocid="upload.toast"
              className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 flex items-start gap-3"
            >
              <AlertTriangle
                size={16}
                className="text-yellow-400 mt-0.5 flex-shrink-0"
              />
              <p className="text-sm text-yellow-400">
                Large file ({videoSizeMB.toFixed(0)} MB) — upload may take
                longer. Consider compressing for faster results.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resume detection banner */}
        <AnimatePresence>
          {hasResumeState && !isUploading && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-3 flex items-start gap-3"
            >
              <RotateCcw
                size={16}
                className="text-sky-400 mt-0.5 flex-shrink-0"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-sky-400">
                  Resuming from {upload.progress}%
                </p>
                <p className="text-xs text-sky-400/70 mt-0.5">
                  This file was uploading before. Tap Upload to continue —
                  already-uploaded chunks will be skipped automatically.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title input */}
        <div>
          <Label
            htmlFor="video-title"
            className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block"
          >
            Title *
          </Label>
          <Input
            id="video-title"
            data-ocid="upload.input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title..."
            disabled={isUploading}
            className="bg-surface2 border-border/60 text-foreground"
          />
        </div>

        {/* Thumbnail picker */}
        <div>
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Thumbnail (optional)
          </Label>
          <button
            type="button"
            data-ocid="upload.dropzone"
            onClick={() => !isUploading && thumbInputRef.current?.click()}
            disabled={isUploading}
            className="w-full border border-dashed border-border hover:border-orange/30 rounded-xl p-4 flex items-center gap-3 transition-colors disabled:opacity-50"
          >
            <Image size={20} className="text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground truncate">
              {thumbFile ? thumbFile.name : "Add custom thumbnail"}
            </span>
          </button>
          <input
            ref={thumbInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* Captions banner (before upload) */}
        {!uploadReady && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-orange/40 bg-orange/5 p-4 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-orange/15 flex items-center justify-center flex-shrink-0">
              <Subtitles size={16} className="text-orange" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-bold text-foreground">
                  Add Captions
                </p>
                <span className="px-1.5 py-0.5 rounded-full bg-orange text-white text-[9px] font-bold uppercase tracking-wide">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Captions improve reach by 40% and help viewers watching with
                sound off. Available after upload.
              </p>
            </div>
          </motion.div>
        )}

        {/* Upload progress panel */}
        <AnimatePresence>
          {showProgress && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-xl border border-border/40 bg-surface2/40 p-4 space-y-3"
            >
              {/* Status row */}
              <div className="flex items-center gap-2">
                {upload.status === "ready" ? (
                  <CheckCircle size={16} className="text-green-500" />
                ) : upload.status === "error" ? (
                  <XCircle size={16} className="text-destructive" />
                ) : upload.isResuming ? (
                  <RotateCcw size={16} className="text-sky-400 animate-spin" />
                ) : (
                  <RefreshCw size={16} className="text-orange animate-spin" />
                )}
                <span
                  className={`text-sm font-medium flex-1 ${
                    upload.status === "ready"
                      ? "text-green-500"
                      : upload.status === "error"
                        ? "text-destructive"
                        : upload.isResuming
                          ? "text-sky-400"
                          : "text-orange"
                  }`}
                >
                  {getStatusLabel()}
                </span>
                {upload.isResuming && upload.status === "uploading" && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 uppercase tracking-wide">
                    Resume
                  </span>
                )}
              </div>

              {/* Progress bar */}
              {upload.status === "uploading" && (
                <>
                  <Progress
                    value={upload.progress}
                    className={`h-2 ${
                      upload.isResuming ? "[&>div]:bg-sky-400" : ""
                    }`}
                  />

                  {/* Rich stats row */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    {mbDisplay && (
                      <div>
                        <p className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">
                          Uploaded
                        </p>
                        <p className="font-semibold text-foreground">
                          {mbDisplay}
                        </p>
                      </div>
                    )}
                    {chunkDisplay && (
                      <div>
                        <p className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">
                          Chunks
                        </p>
                        <p className="font-semibold text-foreground/70">
                          {chunkDisplay}
                        </p>
                      </div>
                    )}
                    {upload.uploadSpeed && (
                      <div>
                        <p className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">
                          Speed
                        </p>
                        <p className="font-semibold text-orange">
                          {upload.uploadSpeed}
                        </p>
                      </div>
                    )}
                    {upload.timeRemaining && (
                      <div>
                        <p className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">
                          Remaining
                        </p>
                        <p className="font-semibold text-foreground/70">
                          ~{upload.timeRemaining}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Retry button */}
              {upload.status === "error" && (
                <Button
                  type="button"
                  data-ocid="upload.secondary_button"
                  onClick={() => upload.retry()}
                  variant="outline"
                  className="w-full border-orange text-orange hover:bg-orange/10 font-semibold"
                >
                  <RefreshCw size={14} className="mr-2" />
                  Retry Upload
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload button */}
        {upload.status !== "ready" && (
          <Button
            type="button"
            data-ocid="upload.submit_button"
            onClick={handleUpload}
            disabled={
              isUploading || !videoFile || !title.trim() || isFileTooLarge
            }
            className="w-full bg-orange hover:bg-orange/90 text-white border-none font-semibold"
          >
            {isUploading ? (
              <>
                <RefreshCw size={16} className="animate-spin mr-2" />
                {upload.isResuming ? "Resuming..." : "Uploading..."}
              </>
            ) : hasResumeState ? (
              <>
                <RotateCcw size={16} className="mr-2" />
                Resume Upload
              </>
            ) : (
              <>
                <Upload size={16} className="mr-2" />
                Upload Video
              </>
            )}
          </Button>
        )}

        {/* Captions section — after upload */}
        <AnimatePresence>
          {uploadReady && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="rounded-xl border-2 border-orange/50 bg-orange/8 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Subtitles size={18} className="text-orange" />
                  <h2 className="text-sm font-bold text-foreground">
                    Add Captions
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-orange text-white text-[10px] font-bold">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Captions improve reach by 40% and make your video accessible
                  to viewers watching with sound off.
                </p>
              </div>
              <CaptionManager videoId={justUploadedVideoId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
