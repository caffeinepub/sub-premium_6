import { Maximize2, Pause, Play, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { isUpcoming } from "../utils/premiereUtils";

export function FloatingMiniPlayer() {
  const {
    miniPlayerActive,
    miniPlayerVideo,
    setMiniPlayerActive,
    setMiniPlayerVideo,
    setPage,
  } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{
    x: number;
    y: number;
    px: number;
    py: number;
  } | null>(null);

  const videoUrl = miniPlayerVideo?.videoBlob?.getDirectURL?.();
  const thumbnailUrl = miniPlayerVideo?.thumbnailBlob?.getDirectURL?.();

  // Auto-play when activated
  useEffect(() => {
    if (miniPlayerActive && videoUrl && videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [miniPlayerActive, videoUrl]);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    videoRef.current?.pause();
    setMiniPlayerActive(false);
    setMiniPlayerVideo(null);
  };

  const handleExpand = () => {
    setMiniPlayerActive(false);
    setPage("player");
  };

  // Touch drag handlers
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!containerRef.current?.getBoundingClientRect()) return;
    dragStart.current = {
      x: t.clientX,
      y: t.clientY,
      px: position.x,
      py: position.y,
    };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - dragStart.current.x;
    const dy = t.clientY - dragStart.current.y;
    setPosition({ x: dragStart.current.px + dx, y: dragStart.current.py + dy });
  };

  const onTouchEnd = () => {
    dragStart.current = null;
  };

  // Don't show mini player for upcoming locked videos
  if (miniPlayerVideo && isUpcoming(miniPlayerVideo)) {
    return null;
  }

  if (!miniPlayerActive || !miniPlayerVideo) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        data-ocid="mini_player.panel"
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed z-50 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-zinc-900"
        style={{
          width: 240,
          height: 135,
          bottom: `calc(80px + ${-position.y}px)`,
          right: `calc(12px + ${-position.x}px)`,
          cursor: "grab",
          touchAction: "none",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={handleExpand}
      >
        {/* Video */}
        {videoUrl ? (
          // biome-ignore lint/a11y/useMediaCaption: user-uploaded content
          <video
            ref={videoRef}
            src={videoUrl}
            playsInline
            className="w-full h-full object-contain bg-black"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={miniPlayerVideo.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Play size={14} className="text-orange-400 ml-0.5" />
            </div>
          </div>
        )}

        {/* Overlay controls */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {/* Top row: close + expand */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: touch-primary UI */}
          <div
            className="flex justify-between items-center px-1.5 pt-1.5 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              data-ocid="mini_player.close_button"
              onClick={handleClose}
              className="w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black/90 transition-colors"
            >
              <X size={12} />
            </button>
            <button
              type="button"
              data-ocid="mini_player.open_modal_button"
              onClick={handleExpand}
              className="w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black/90 transition-colors"
            >
              <Maximize2 size={11} />
            </button>
          </div>

          {/* Bottom row: play/pause + title */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: touch-primary UI */}
          <div
            className="flex items-center gap-1.5 px-1.5 pb-1.5 bg-gradient-to-t from-black/80 to-transparent pt-4 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              data-ocid="mini_player.toggle"
              onClick={handlePlayPause}
              className="w-7 h-7 rounded-full bg-orange-500/90 flex items-center justify-center text-black flex-shrink-0 hover:bg-orange-400 transition-colors"
            >
              {isPlaying ? (
                <Pause size={13} />
              ) : (
                <Play size={13} className="ml-0.5" />
              )}
            </button>
            <p className="text-white text-[10px] font-medium truncate leading-tight">
              {miniPlayerVideo.title}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
