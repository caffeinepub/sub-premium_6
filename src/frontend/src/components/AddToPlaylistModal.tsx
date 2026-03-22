import { Input } from "@/components/ui/input";
import {
  Bookmark,
  BookmarkCheck,
  Check,
  ListPlus,
  Lock,
  Plus,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type PlaylistPrivacy,
  addVideoToPlaylist,
  createPlaylist,
  getPlaylists,
  isVideoInPlaylist,
} from "../utils/playlists";

interface AddToPlaylistModalProps {
  videoId: string;
  open: boolean;
  onClose: () => void;
}

export function AddToPlaylistModal({
  videoId,
  open,
  onClose,
}: AddToPlaylistModalProps) {
  const [playlists, setPlaylists] = useState(() => getPlaylists());
  const [newTitle, setNewTitle] = useState("");
  const [newPrivacy, setNewPrivacy] = useState<PlaylistPrivacy>("public");
  const [creating, setCreating] = useState(false);

  const refresh = () => setPlaylists(getPlaylists());

  const handleSelectPlaylist = (plId: string, plTitle: string) => {
    const inList = isVideoInPlaylist(plId, videoId);
    if (inList) {
      toast.info(`Already in "${plTitle}"`);
    } else {
      addVideoToPlaylist(plId, videoId);
      refresh();
      toast.success(`Added to "${plTitle}"`);
    }
  };

  const handleCreateAndAdd = () => {
    if (!newTitle.trim()) return;
    const pl = createPlaylist(newTitle.trim(), newPrivacy);
    addVideoToPlaylist(pl.id, videoId);
    refresh();
    toast.success(`Added to "${pl.title}"`);
    setNewTitle("");
    setNewPrivacy("public");
    setCreating(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70"
            onClick={onClose}
          />
          <motion.div
            data-ocid="playlist.modal"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] rounded-t-2xl max-h-[80vh] flex flex-col max-w-[430px] mx-auto border-t border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <BookmarkCheck size={16} className="text-orange" />
                <span className="text-sm font-semibold text-white">
                  Save to playlist
                </span>
              </div>
              <button
                type="button"
                data-ocid="playlist.close_button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={18} className="text-white/70" />
              </button>
            </div>

            {/* Playlist list */}
            <div className="flex-1 overflow-y-auto">
              {playlists.map((pl) => {
                const inList = isVideoInPlaylist(pl.id, videoId);
                return (
                  <button
                    key={pl.id}
                    type="button"
                    data-ocid="playlist.toggle"
                    onClick={() => handleSelectPlaylist(pl.id, pl.title)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      {pl.privacy === "private" ? (
                        <Lock size={15} className="text-muted-foreground" />
                      ) : (
                        <Bookmark
                          size={15}
                          className={
                            inList ? "text-orange" : "text-muted-foreground"
                          }
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-white truncate">
                        {pl.title}
                      </p>
                      <p className="text-xs text-white/40">
                        {pl.videoIds.length} video
                        {pl.videoIds.length !== 1 ? "s" : ""}
                        {pl.privacy === "private" ? " · Private" : ""}
                      </p>
                    </div>
                    {inList && (
                      <Check size={16} className="text-orange flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Create new playlist */}
            <div className="border-t border-white/10 flex-shrink-0">
              {!creating ? (
                <button
                  type="button"
                  data-ocid="playlist.open_modal_button"
                  onClick={() => setCreating(true)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-orange/20 flex items-center justify-center flex-shrink-0">
                    <ListPlus size={15} className="text-orange" />
                  </div>
                  <span className="text-sm font-medium text-orange">
                    Create new playlist
                  </span>
                </button>
              ) : (
                <div className="px-4 py-3 space-y-3">
                  <Input
                    data-ocid="playlist.input"
                    autoFocus
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateAndAdd()}
                    placeholder="Playlist name..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-orange h-9 text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50">Privacy:</span>
                    <button
                      type="button"
                      data-ocid="playlist.toggle"
                      onClick={() => setNewPrivacy("public")}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        newPrivacy === "public"
                          ? "bg-orange text-white"
                          : "bg-white/10 text-white/60 hover:bg-white/15"
                      }`}
                    >
                      Public
                    </button>
                    <button
                      type="button"
                      data-ocid="playlist.toggle"
                      onClick={() => setNewPrivacy("private")}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        newPrivacy === "private"
                          ? "bg-orange text-white"
                          : "bg-white/10 text-white/60 hover:bg-white/15"
                      }`}
                    >
                      Private
                    </button>
                    <div className="flex-1" />
                    <button
                      type="button"
                      data-ocid="playlist.cancel_button"
                      onClick={() => {
                        setCreating(false);
                        setNewTitle("");
                      }}
                      className="text-xs text-white/40 hover:text-white/60 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      data-ocid="playlist.confirm_button"
                      onClick={handleCreateAndAdd}
                      disabled={!newTitle.trim()}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange text-white text-xs font-semibold disabled:opacity-40 transition-colors"
                    >
                      <Plus size={12} /> Create &amp; Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
