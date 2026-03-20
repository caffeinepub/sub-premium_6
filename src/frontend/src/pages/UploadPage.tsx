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
  Upload,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import { useUpload } from "../context/UploadContext";

export function UploadPage() {
  const { setPage } = useApp();
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

        {/* Title */}
        <div>
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Title *
          </Label>
          <Input
            data-ocid="upload.input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            className="bg-surface2 border-border focus-visible:ring-orange"
            disabled={isUploading}
            maxLength={120}
          />
        </div>

        {/* Progress */}
        <AnimatePresence>
          {showProgress && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span
                  data-ocid="upload.loading_state"
                  className={`text-sm font-medium ${
                    upload.status === "ready"
                      ? "text-green-online"
                      : upload.status === "error"
                        ? "text-destructive"
                        : "text-orange"
                  }`}
                >
                  {upload.status === "ready" && (
                    <CheckCircle size={14} className="inline mr-1" />
                  )}
                  {upload.status === "error" && (
                    <XCircle size={14} className="inline mr-1" />
                  )}
                  {getStatusLabel()}
                </span>
                {upload.status === "uploading" && (
                  <span className="text-sm text-muted-foreground">
                    {upload.progress}%
                  </span>
                )}
              </div>
              {(upload.status === "uploading" ||
                upload.status === "processing") && (
                <Progress
                  value={upload.progress}
                  className="h-2 bg-surface2 [&>div]:bg-orange"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          {upload.status === "error" ? (
            <Button
              data-ocid="upload.secondary_button"
              className="w-full bg-orange hover:bg-orange/90 text-white font-semibold"
              onClick={() => upload.retry()}
            >
              <RefreshCw size={16} className="mr-2" /> Retry Upload
            </Button>
          ) : (
            <Button
              data-ocid="upload.submit_button"
              className="w-full bg-orange hover:bg-orange/90 text-white font-semibold"
              onClick={handleUpload}
              disabled={isUploading || upload.status === "ready" || !videoFile}
            >
              {isUploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />{" "}
                  Uploading...
                </>
              ) : upload.status === "ready" ? (
                <>
                  <CheckCircle size={16} className="mr-2" /> Uploaded!
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" /> Upload Video
                </>
              )}
            </Button>
          )}

          {/* Cancel always enabled — upload continues in background */}
          <Button
            data-ocid="upload.cancel_button"
            variant="ghost"
            className="w-full"
            onClick={() => setPage("home")}
          >
            {isUploading ? "Continue Browsing" : "Cancel"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
