import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Video } from "../backend";
import { ExternalBlob } from "../backend";
import { useActor } from "../hooks/useActor";

interface EditVideoSheetProps {
  video: Video | null;
  open: boolean;
  onClose: () => void;
}

export function EditVideoSheet({ video, open, onClose }: EditVideoSheetProps) {
  const { actor } = useActor();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setThumbFile(null);
      setThumbPreview(video.thumbnailBlob?.getDirectURL?.() ?? null);
    }
  }, [video]);

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbFile(file);
    setThumbPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!actor || !video) return;
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    setSaving(true);
    try {
      let thumbnailBlob = video.thumbnailBlob;
      if (thumbFile) {
        const bytes = new Uint8Array(await thumbFile.arrayBuffer());
        thumbnailBlob = ExternalBlob.fromBytes(bytes);
      }
      await actor.updateVideoMetadata(video.id, title.trim(), thumbnailBlob);
      await qc.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Video updated");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update video");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        data-ocid="channel.sheet"
        side="bottom"
        className="bg-[#1a1a1a] border-t border-border/40 rounded-t-2xl px-4 pb-8"
      >
        <SheetHeader className="mb-4">
          <SheetTitle className="text-white text-base font-bold">
            Edit Video
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label
              htmlFor="edit-title"
              className="text-xs text-muted-foreground"
            >
              Title
            </Label>
            <Input
              id="edit-title"
              data-ocid="channel.input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#121212] border-border/40 text-white"
              maxLength={200}
            />
          </div>

          {/* Thumbnail */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Thumbnail (optional)
            </Label>
            {thumbPreview && (
              <img
                src={thumbPreview}
                alt="Thumbnail preview"
                className="w-full aspect-video rounded-lg object-cover"
              />
            )}
            <button
              type="button"
              data-ocid="channel.upload_button"
              onClick={() => fileRef.current?.click()}
              className="w-full py-2.5 rounded-lg border border-dashed border-border/50 text-sm text-muted-foreground hover:border-orange/50 hover:text-orange transition-colors"
            >
              {thumbFile ? thumbFile.name : "Choose new thumbnail"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbChange}
            />
          </div>
        </div>

        <SheetFooter className="mt-6 flex-row gap-2">
          <Button
            data-ocid="channel.cancel_button"
            variant="outline"
            className="flex-1 border-border/40"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            data-ocid="channel.save_button"
            className="flex-1 bg-orange hover:bg-orange/90 text-white"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
            {saving ? "Saving..." : "Save"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
