import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Video } from "../backend";
import { ExternalBlob } from "../backend";
import { useActor } from "../hooks/useActor";

const MAX_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
const MAX_DURATION = 2 * 60 * 60; // 2h

interface ReuploadSheetProps {
  video: Video | null;
  open: boolean;
  onClose: () => void;
}

export function ReuploadSheet({ video, open, onClose }: ReuploadSheetProps) {
  const { actor } = useActor();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);

    if (f.size > MAX_SIZE) {
      setError("File too large — max 2GB");
      return;
    }

    // Check duration
    const dur = await new Promise<number>((resolve) => {
      const el = document.createElement("video");
      el.preload = "metadata";
      el.onloadedmetadata = () => resolve(el.duration);
      el.onerror = () => resolve(0);
      el.src = URL.createObjectURL(f);
    });
    if (dur > MAX_DURATION) {
      setError("Video too long — max 2 hours");
      return;
    }
    setFile(f);
  };

  const handleReupload = async () => {
    if (!actor || !video || !file) return;
    setUploading(true);
    setProgress(0);
    setError(null);
    try {
      const videoBytes = new Uint8Array(await file.arrayBuffer());
      const videoBlob = ExternalBlob.fromBytes(videoBytes).withUploadProgress(
        (pct) => {
          setProgress(Math.round(pct * 0.9));
        },
      );

      await actor.uploadVideo(
        video.id,
        video.title,
        videoBlob,
        video.thumbnailBlob,
        video.description,
      );

      setProgress(95);

      const qualities = ["480p", "720p", "1080p"];
      for (const q of qualities) {
        await actor.updateVideoQuality(video.id, q);
        await new Promise((r) => setTimeout(r, 3000));
      }

      setProgress(100);
      await qc.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Video replaced successfully");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Upload failed — please try again");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (uploading) return;
    setFile(null);
    setProgress(0);
    setError(null);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && handleClose()}>
      <SheetContent
        data-ocid="channel.sheet"
        side="bottom"
        className="bg-[#1a1a1a] border-t border-border/40 rounded-t-2xl px-4 pb-8"
      >
        <SheetHeader className="mb-4">
          <SheetTitle className="text-white text-base font-bold flex items-center gap-2">
            <RefreshCw size={16} className="text-orange" />
            Re-upload Video
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Replace the video file for &ldquo;
            <span className="text-white font-medium">{video?.title}</span>
            &rdquo;. Title and metadata will be kept.
          </p>

          {/* File picker */}
          <button
            type="button"
            data-ocid="channel.upload_button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full py-6 rounded-xl border-2 border-dashed border-border/40 hover:border-orange/50 transition-colors flex flex-col items-center gap-2 text-muted-foreground hover:text-orange disabled:opacity-50"
          >
            <RefreshCw size={22} />
            <span className="text-sm">
              {file ? file.name : "Choose video file"}
            </span>
            <span className="text-xs">MP4, WebM, MOV — max 2GB, 2 hours</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Error */}
          {error && (
            <p
              data-ocid="channel.error_state"
              className="text-sm text-destructive"
            >
              {error}
            </p>
          )}

          {/* Progress */}
          {uploading && (
            <div data-ocid="channel.loading_state" className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {progress < 90
                    ? "Uploading..."
                    : progress < 100
                      ? "Processing quality levels..."
                      : "Complete!"}
                </span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-2">
            <Button
              data-ocid="channel.cancel_button"
              variant="outline"
              className="flex-1 border-border/40"
              onClick={handleClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              data-ocid="channel.confirm_button"
              className="flex-1 bg-orange hover:bg-orange/90 text-white"
              onClick={handleReupload}
              disabled={!file || uploading}
            >
              {uploading ? `${progress}%` : "Start Re-upload"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
