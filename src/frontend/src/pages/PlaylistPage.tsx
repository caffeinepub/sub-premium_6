import { ArrowLeft, Play, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Video } from "../backend";
import { useApp } from "../context/AppContext";
import { useListVideos } from "../hooks/useQueries";
import { getPlaylists, removeVideoFromPlaylist } from "../utils/playlists";

export function PlaylistPage() {
  const { selectedPlaylistId, setPage, setSelectedVideo } = useApp();
  const { data: allVideos = [] } = useListVideos();
  const [playlists, setPlaylists] = useState(() => getPlaylists());

  const playlist = playlists.find((p) => p.id === selectedPlaylistId);

  const refresh = () => setPlaylists(getPlaylists());

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-muted-foreground">Playlist not found</p>
        <button
          type="button"
          onClick={() => setPage("home")}
          className="text-orange text-sm font-medium"
        >
          Go Home
        </button>
      </div>
    );
  }

  const videoMap = new Map(allVideos.map((v) => [v.id, v]));
  // Newest first order is already stored (prepend)
  const playlistVideos = playlist.videoIds
    .map((id) => videoMap.get(id))
    .filter((v): v is Video => !!v);

  const firstThumb = playlistVideos[0]?.thumbnailBlob?.getDirectURL?.();

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setPage("player");
  };

  const handleRemove = (videoId: string, _title: string) => {
    removeVideoFromPlaylist(playlist.id, videoId);
    refresh();
    toast.success(`Removed from "${playlist.title}"`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col pb-20"
    >
      {/* Sticky header */}
      <div
        data-ocid="playlist.page"
        className="sticky top-0 z-30 bg-background border-b border-border/40 px-4 py-3 flex items-center gap-3"
      >
        <button
          type="button"
          data-ocid="playlist.close_button"
          onClick={() => setPage("home")}
          className="p-1.5 rounded-full hover:bg-accent transition-colors flex-shrink-0"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-base truncate">{playlist.title}</h1>
          <p className="text-xs text-muted-foreground">
            {playlist.videoIds.length} video
            {playlist.videoIds.length !== 1 ? "s" : ""}
            {playlist.privacy === "private" ? " · Private" : ""}
          </p>
        </div>
      </div>

      {/* Hero thumbnail */}
      <div className="relative w-full aspect-video bg-surface2 flex-shrink-0">
        {firstThumb ? (
          <img
            src={firstThumb}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface2 to-orange/20 flex items-center justify-center">
            <Play size={40} className="text-orange/50" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {/* Count badge */}
        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {playlist.videoIds.length} video
          {playlist.videoIds.length !== 1 ? "s" : ""}
        </div>
        {/* Title overlay */}
        <div className="absolute bottom-3 left-3">
          <h2 className="text-white font-bold text-lg drop-shadow-lg">
            {playlist.title}
          </h2>
        </div>
      </div>

      {/* Video list */}
      <div className="flex flex-col">
        {playlistVideos.length === 0 ? (
          <div
            data-ocid="playlist.empty_state"
            className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6"
          >
            <div className="w-14 h-14 rounded-full bg-surface2 flex items-center justify-center">
              <Play size={22} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              No videos in this playlist yet
            </p>
            <p className="text-muted-foreground/50 text-xs">
              Add videos using the bookmark button
            </p>
          </div>
        ) : (
          <div data-ocid="playlist.list" className="divide-y divide-border/20">
            {playlistVideos.map((video, i) => (
              <div
                key={video.id}
                data-ocid={`playlist.item.${i + 1}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-surface2/40 transition-colors"
              >
                {/* Order number */}
                <span className="text-xs text-muted-foreground/50 w-5 flex-shrink-0 text-center">
                  {i + 1}
                </span>

                {/* Thumbnail */}
                <button
                  type="button"
                  onClick={() => handleVideoClick(video)}
                  className="relative w-24 h-14 rounded-lg overflow-hidden bg-surface2 flex-shrink-0"
                  aria-label={`Play ${video.title}`}
                >
                  {video.thumbnailBlob?.getDirectURL?.() ? (
                    <img
                      src={video.thumbnailBlob.getDirectURL()}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface2 to-orange/10">
                      <Play size={14} className="text-orange/50" />
                    </div>
                  )}
                </button>

                {/* Info */}
                <button
                  type="button"
                  onClick={() => handleVideoClick(video)}
                  className="flex-1 min-w-0 text-left"
                >
                  <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                    {video.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {video.creatorName || "Unknown"}
                  </p>
                </button>

                {/* Remove button */}
                <button
                  type="button"
                  data-ocid={`playlist.delete_button.${i + 1}`}
                  onClick={() => handleRemove(video.id, video.title)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  aria-label="Remove from playlist"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
