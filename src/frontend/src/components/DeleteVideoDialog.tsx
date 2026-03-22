import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { Video } from "../backend";
import { useActor } from "../hooks/useActor";
import { getPlaylists, removeVideoFromPlaylist } from "../utils/playlists";

interface DeleteVideoDialogProps {
  video: Video | null;
  open: boolean;
  onClose: () => void;
}

export function DeleteVideoDialog({
  video,
  open,
  onClose,
}: DeleteVideoDialogProps) {
  const { actor } = useActor();
  const qc = useQueryClient();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!actor || !video) return;
    setDeleting(true);
    try {
      await actor.deleteVideo(video.id);

      // Remove from all playlists
      const playlists = getPlaylists();
      for (const pl of playlists) {
        removeVideoFromPlaylist(pl.id, video.id);
      }

      // Remove from watch history in localStorage
      try {
        const hist = JSON.parse(
          localStorage.getItem("sub_watch_history") ?? "[]",
        ) as Array<{ videoId: string }>;
        const filtered = hist.filter((h) => h.videoId !== video.id);
        localStorage.setItem("sub_watch_history", JSON.stringify(filtered));
      } catch {
        // ignore
      }

      await qc.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Video deleted");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete video");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent
        data-ocid="channel.dialog"
        className="bg-[#1a1a1a] border-border/40 mx-4 rounded-2xl"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Delete Video?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm">
            Delete &ldquo;{video?.title}&rdquo;? This will remove it from your
            channel, playlists, and history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-2">
          <AlertDialogCancel
            data-ocid="channel.cancel_button"
            className="flex-1 border-border/40 bg-transparent text-white"
            disabled={deleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="channel.confirm_button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 bg-destructive hover:bg-destructive/90 text-white"
          >
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
