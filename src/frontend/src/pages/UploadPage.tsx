import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  ArrowLeft,
  FileVideo,
  Image,
  Info,
  Plus,
  Subtitles,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CaptionManager } from "../components/CaptionManager";
import { UploadLimitsPanel } from "../components/UploadLimitsPanel";
import { useApp } from "../context/AppContext";
import { useUploadQueue } from "../context/UploadQueueContext";
import { getFileFingerprint } from "../utils/uploadDB";

const MAX_BLOCK_MB = 2048; // 2 GB
const MAX_WARN_MB = 500; // 500 MB
const MAX_DURATION_SECONDS = 7200; // 2 hours

const RECENT_FINGERPRINTS_KEY = "recentUploadFingerprints";
const MAX_RECENT = 5;

function getRecentFingerprints(): Set<string> {
  try {
    const raw = localStorage.getItem(RECENT_FINGERPRINTS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function addRecentFingerprint(fp: string) {
  try {
    const arr = Array.from(getRecentFingerprints());
    const updated = [fp, ...arr.filter((x) => x !== fp)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_FINGERPRINTS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

function formatDuration(seconds: number): string {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function UploadPage() {
  const { setPage } = useApp();
  const { addJob, hasActive, activeCount, queuedCount } = useUploadQueue();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewDuration, setPreviewDuration] = useState<number | null>(null);
  const [durationError, setDurationError] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const prevPreviewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (prevPreviewUrlRef.current) {
        URL.revokeObjectURL(prevPreviewUrlRef.current);
      }
    };
  }, []);

  const videoSizeMB = videoFile ? videoFile.size / (1024 * 1024) : 0;
  const isFileTooLarge = videoSizeMB > MAX_BLOCK_MB;
  const showFileSizeWarning = !isFileTooLarge && videoSizeMB > MAX_WARN_MB;

  const handleVideoSelect = (file: File | undefined) => {
    if (!file) return;
    if (prevPreviewUrlRef.current) {
      URL.revokeObjectURL(prevPreviewUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    prevPreviewUrlRef.current = url;
    setPreviewUrl(url);
    setPreviewDuration(null);
    setDurationError("");
    setVideoFile(file);

    // Duplicate detection
    const fp = getFileFingerprint(file);
    const recents = getRecentFingerprints();
    setIsDuplicate(recents.has(fp));
  };

  const handleDurationLoaded = (duration: number) => {
    setPreviewDuration(duration);
    if (duration > MAX_DURATION_SECONDS) {
      setDurationError(
        "Video too long — please shorten or compress (max 2 hours)",
      );
    } else {
      setDurationError("");
    }
  };

  const handleUpload = () => {
    if (!videoFile) {
      toast.error("Please select a video file.");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title.");
      return;
    }
    if (isFileTooLarge) {
      toast.error(
        "File exceeds 2 GB limit. Please compress or trim your video.",
      );
      return;
    }
    if (durationError) {
      toast.error(durationError);
      return;
    }

    const fp = getFileFingerprint(videoFile);
    addRecentFingerprint(fp);
    setIsDuplicate(false);

    addJob({
      title: title.trim(),
      videoFile,
      thumbnailFile: thumbFile,
      description: description.trim() || undefined,
    });

    toast.success("Added to upload queue!");

    // Reset form for next upload
    setTitle("");
    setDescription("");
    setVideoFile(null);
    setThumbFile(null);
    setDurationError("");
    if (prevPreviewUrlRef.current) {
      URL.revokeObjectURL(prevPreviewUrlRef.current);
      prevPreviewUrlRef.current = null;
    }
    setPreviewUrl(null);
    setPreviewDuration(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  // Step indicator: 1 = no file, 2 = file selected, 3 = has active uploads
  const currentStep = hasActive ? 3 : videoFile ? 2 : 1;

  const canUpload =
    !!videoFile && !!title.trim() && !isFileTooLarge && !durationError;

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
        {hasActive && (
          <span className="ml-auto text-xs text-orange animate-pulse">
            {activeCount} uploading
            {queuedCount > 0 ? ` · ${queuedCount} queued` : ""}
          </span>
        )}
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Leave page banner */}
        <AnimatePresence>
          {hasActive && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3"
            >
              <Info size={15} className="text-sky-400 flex-shrink-0" />
              <p className="text-xs text-sky-300 leading-relaxed">
                Uploading… You can leave this page — your uploads continue in
                the background
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step indicator */}
        {videoFile && (
          <div className="flex items-center justify-center gap-1 text-xs">
            <span
              className={`flex items-center gap-1 ${
                currentStep >= 1
                  ? "text-orange font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep >= 1
                    ? "bg-orange text-white"
                    : "bg-border text-muted-foreground"
                }`}
              >
                ①
              </span>
              Select
            </span>
            <span className="text-muted-foreground/40 mx-1">→</span>
            <span
              className={`flex items-center gap-1 ${
                currentStep >= 2
                  ? "text-orange font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep >= 2
                    ? "bg-orange text-white"
                    : "bg-border text-muted-foreground"
                }`}
              >
                ②
              </span>
              Preview &amp; Details
            </span>
            <span className="text-muted-foreground/40 mx-1">→</span>
            <span
              className={`flex items-center gap-1 ${
                currentStep >= 3
                  ? "text-orange font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep >= 3
                    ? "bg-orange text-white"
                    : "bg-border text-muted-foreground"
                }`}
              >
                ③
              </span>
              Upload
            </span>
          </div>
        )}

        {/* Video file picker */}
        <div>
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Video File *
          </Label>
          <button
            type="button"
            data-ocid="upload.upload_button"
            onClick={() => videoInputRef.current?.click()}
            className="w-full border-2 border-dashed border-border hover:border-orange/50 rounded-xl p-6 flex flex-col items-center gap-3 transition-colors"
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
                  MP4, MOV, AVI, WebM · Max 2 GB · Max 2 hours
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
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3"
            >
              <AlertTriangle
                size={15}
                className="text-destructive flex-shrink-0"
              />
              <p className="text-xs text-destructive">
                File exceeds 2 GB limit. Please compress or trim your video.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Duration error */}
        <AnimatePresence>
          {durationError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              data-ocid="upload.error_state"
              className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3"
            >
              <AlertTriangle
                size={15}
                className="text-destructive flex-shrink-0"
              />
              <p className="text-xs text-destructive">{durationError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* File size warning */}
        <AnimatePresence>
          {showFileSizeWarning && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-xl border border-orange/30 bg-orange/10 px-4 py-3"
            >
              <AlertTriangle size={15} className="text-orange flex-shrink-0" />
              <p className="text-xs text-orange">
                Large file ({videoSizeMB.toFixed(0)} MB) — upload may take
                longer. Consider compressing for faster results.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Duplicate warning */}
        <AnimatePresence>
          {isDuplicate && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3"
            >
              <AlertTriangle
                size={15}
                className="text-amber-400 flex-shrink-0"
              />
              <p className="text-xs text-amber-400">
                This file was recently uploaded. Continue to upload again?
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video preview */}
        <AnimatePresence>
          {previewUrl && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-2"
            >
              <div className="rounded-xl overflow-hidden bg-black border border-border/30">
                {/* biome-ignore lint/a11y/useMediaCaption: preview only */}
                <video
                  src={previewUrl}
                  controls
                  playsInline
                  className="w-full aspect-video bg-black"
                  onLoadedMetadata={(e) =>
                    handleDurationLoaded(e.currentTarget.duration)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {previewDuration !== null
                    ? `Duration: ${formatDuration(previewDuration)}`
                    : "Loading..."}
                </span>
                <button
                  type="button"
                  data-ocid="upload.secondary_button"
                  onClick={() => videoInputRef.current?.click()}
                  className="text-xs text-orange hover:underline"
                >
                  Replace video
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title */}
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
            className="bg-[#1A1A1A] border-[#333] text-white placeholder:text-[#AAAAAA] focus:ring-1 focus:ring-orange/60 focus:border-orange/60"
          />
        </div>

        {/* Description */}
        <div>
          <Label
            htmlFor="video-description"
            className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block"
          >
            Description
            <span className="ml-1.5 text-[10px] normal-case tracking-normal font-normal px-1.5 py-0.5 rounded-full bg-surface2 text-muted-foreground/60">
              optional
            </span>
          </Label>
          <textarea
            id="video-description"
            data-ocid="upload.textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell viewers about your video..."
            maxLength={2000}
            rows={4}
            className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#AAAAAA] focus:outline-none focus:ring-1 focus:ring-orange/60 resize-none min-h-[100px]"
          />
          <p className="text-right text-[11px] text-muted-foreground/50 mt-1">
            {description.length}/2000
          </p>
        </div>

        {/* Thumbnail */}
        <div>
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Thumbnail (optional)
          </Label>
          <button
            type="button"
            data-ocid="upload.dropzone"
            onClick={() => thumbInputRef.current?.click()}
            className="w-full border border-dashed border-border hover:border-orange/30 rounded-xl p-4 flex items-center gap-3 transition-colors"
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

        {/* Upload limits panel */}
        <UploadLimitsPanel />

        {/* Captions banner */}
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
              <p className="text-sm font-bold text-foreground">Add Captions</p>
              <span className="px-1.5 py-0.5 rounded-full bg-orange text-white text-[9px] font-bold uppercase tracking-wide">
                Recommended
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Captions improve reach by 40% and help viewers watching with sound
              off. Available after upload.
            </p>
          </div>
        </motion.div>

        {/* Add to queue button */}
        <Button
          type="button"
          data-ocid="upload.submit_button"
          onClick={handleUpload}
          disabled={!canUpload}
          className="w-full bg-orange hover:bg-orange/90 text-white border-none font-semibold"
        >
          <Plus size={16} className="mr-2" />
          Add to Upload Queue
        </Button>

        {/* Caption Manager (shown after upload would have been triggered — always visible for creation) */}
        <CaptionManager videoId="" />
      </div>
    </motion.div>
  );
}
