import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  CheckCircle,
  FileVideo,
  Image,
  RefreshCw,
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

export function UploadPage() {
  const { setPage, justUploadedVideoId } = useApp();
  const upload = useUpload();

  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const getStatusLabel = () => {
    if (upload.status === "uploading")
      return `Uploading... ${upload.progress}%`;
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
    upload.startUpload({
      title: title.trim(),
      videoFile,
      thumbnailFile: thumbFile,
    });
  };

  const isUploading = upload.isActive;
  const showProgress = upload.status !== "idle";
  const uploadReady = upload.status === "ready" && !!justUploadedVideoId;

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
          <span className="ml-auto text-xs text-orange animate-pulse">
            Uploading in background...
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
                  {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </>
            ) : (
              <>
                <Upload size={32} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Tap to select video
                </p>
                <p className="text-xs text-muted-foreground/60">
                  MP4, MOV, AVI, WebM
                </p>
              </>
            )}
          </button>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
          />
        </div>

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

        {/* Captions recommended banner — always visible before upload */}
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

        {/* Upload progress */}
        <AnimatePresence>
          {showProgress && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-xl border border-border/40 bg-surface2/40 p-4 space-y-2"
            >
              <div className="flex items-center gap-2">
                {upload.status === "ready" ? (
                  <CheckCircle size={16} className="text-green-500" />
                ) : upload.status === "error" ? (
                  <XCircle size={16} className="text-destructive" />
                ) : (
                  <RefreshCw size={16} className="text-orange animate-spin" />
                )}
                <span
                  className={`text-sm font-medium ${
                    upload.status === "ready"
                      ? "text-green-500"
                      : upload.status === "error"
                        ? "text-destructive"
                        : "text-orange"
                  }`}
                >
                  {getStatusLabel()}
                </span>
              </div>
              {upload.status === "uploading" && (
                <Progress value={upload.progress} className="h-1.5" />
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
            disabled={isUploading || !videoFile || !title.trim()}
            className="w-full bg-orange hover:bg-orange/90 text-white border-none font-semibold"
          >
            {isUploading ? (
              <>
                <RefreshCw size={16} className="animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} className="mr-2" />
                Upload Video
              </>
            )}
          </Button>
        )}

        {/* Captions section — appears after successful upload */}
        <AnimatePresence>
          {uploadReady && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* Prominent caption call-to-action */}
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
                  to viewers watching with sound off. Add in any language below.
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
