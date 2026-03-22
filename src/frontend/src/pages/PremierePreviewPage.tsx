import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Calendar, Clock, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Video } from "../backend";
import { useApp } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  formatPremiereCountdown,
  formatPremiereDate,
  formatPremiereDaysLabel,
  getPublishTimeMs,
  isUpcoming,
} from "../utils/premiereUtils";
import {
  hasReminder,
  markReminderNotified,
  removeReminder,
  setReminder,
} from "../utils/reminderUtils";
import { isSubscribed, toggleSubscription } from "../utils/subscriptions";

interface Props {
  video: Video;
}

export function PremierePreviewPage({ video }: Props) {
  const { setPage, setSelectedVideo } = useApp();
  const { identity } = useInternetIdentity();
  const myPrincipal = identity?.getPrincipal().toString();
  const userId = myPrincipal ?? "anon";

  const thumbUrl = video.thumbnailBlob?.getDirectURL?.();
  const publishTimeMs = getPublishTimeMs(video);

  const [countdown, setCountdown] = useState<string>(
    publishTimeMs ? formatPremiereCountdown(publishTimeMs) : "Premieres soon",
  );
  const [isLive, setIsLive] = useState(
    publishTimeMs ? publishTimeMs <= Date.now() : false,
  );

  const [subscribed, setSubscribed] = useState(() =>
    isSubscribed(video.creatorId),
  );

  const [reminderSet, setReminderSet] = useState(() =>
    publishTimeMs ? hasReminder(userId, video.id) : false,
  );

  // Real-time countdown
  useEffect(() => {
    if (!publishTimeMs) return;

    const tick = () => {
      const now = Date.now();
      if (publishTimeMs <= now) {
        // Fire reminder notification if user had one set
        if (userId !== "anon" && hasReminder(userId, video.id)) {
          toast.success(`🔔 "${video.title}" is now live!`, { duration: 6000 });
          markReminderNotified(userId, video.id);
        }
        setIsLive(true);
        setReminderSet(false);
        setCountdown("Premiering now");
        clearInterval(id);
        window.dispatchEvent(
          new CustomEvent("videoPublished", { detail: { videoId: video.id } }),
        );
        toast.success(`🎬 "${video.title}" is now premiering!`);
      } else {
        setCountdown(formatPremiereCountdown(publishTimeMs));
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [publishTimeMs, video.id, video.title, userId]);

  // Listen for videoPublished (from App.tsx scheduler)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { videoId: string };
      if (detail.videoId === video.id) {
        setIsLive(true);
        setCountdown("Premiering now");
        setTimeout(() => {
          setSelectedVideo(video);
          setPage("player");
        }, 1500);
      }
    };
    window.addEventListener("videoPublished", handler);
    return () => window.removeEventListener("videoPublished", handler);
  }, [video, setPage, setSelectedVideo]);

  // Auto-transition if already live
  useEffect(() => {
    if (isLive && !isUpcoming(video)) {
      setTimeout(() => {
        setSelectedVideo(video);
        setPage("player");
      }, 1500);
    }
  }, [isLive, video, setPage, setSelectedVideo]);

  const handleSubscribe = () => {
    toggleSubscription(video.creatorId);
    setSubscribed((v) => !v);
  };

  const handleReminderToggle = () => {
    if (!identity) {
      toast.error("Please log in to set a reminder");
      return;
    }
    if (reminderSet) {
      removeReminder(userId, video.id);
      setReminderSet(false);
      toast.success("Reminder removed");
    } else if (publishTimeMs) {
      setReminder(userId, video.id, video.title, publishTimeMs);
      setReminderSet(true);
      toast.success(
        "🔔 Reminder set! We'll notify you when this video goes live.",
      );
    }
  };

  const isOwnVideo = myPrincipal && myPrincipal === video.creatorId;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen bg-background"
    >
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border/30 px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          data-ocid="premiere.close_button"
          onClick={() => setPage("home")}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-base truncate flex-1">{video.title}</h1>
        {publishTimeMs && (
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-orange/20 text-orange">
            Upcoming
          </span>
        )}
      </div>

      <div className="pb-20">
        {/* Thumbnail area with locked player overlay */}
        <div className="relative w-full aspect-video bg-[#0A0A0A] overflow-hidden">
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt={video.title}
              className="w-full h-full object-cover opacity-50"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]" />
          )}
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute top-3 left-3">
            <span
              data-ocid="premiere.modal"
              className="px-3 py-1 rounded-full bg-orange text-white text-[11px] font-black uppercase tracking-widest shadow-lg"
            >
              Upcoming
            </span>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            {isLive ? (
              <>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-14 h-14 rounded-full bg-orange/20 border-2 border-orange flex items-center justify-center mb-2"
                >
                  <span className="text-2xl">🎬</span>
                </motion.div>
                <p className="text-white font-black text-xl">It's Live!</p>
                <p className="text-white/60 text-xs">Opening player…</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center mb-2">
                  <Lock size={20} className="text-white/70" />
                </div>
                <p
                  data-ocid="premiere.loading_state"
                  className="text-white font-bold text-lg leading-tight"
                >
                  {countdown}
                </p>
                {publishTimeMs && (
                  <div className="flex flex-col items-center gap-1 mt-1">
                    <div className="flex items-center gap-1.5 text-white/60 text-xs">
                      <Calendar size={11} />
                      <span>{formatPremiereDate(publishTimeMs)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/40 text-[11px]">
                      <Clock size={11} />
                      <span>{formatPremiereDaysLabel(publishTimeMs)}</span>
                    </div>
                  </div>
                )}
                <p className="text-white/30 text-[10px] mt-2">
                  Video unlocks at premiere time
                </p>
              </>
            )}
          </div>
        </div>

        {/* Video info below */}
        <div className="px-4 py-4 space-y-4">
          <h2 className="text-base font-bold text-foreground leading-snug">
            {video.title}
          </h2>

          {/* Channel info + subscribe */}
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9 flex-shrink-0">
              <AvatarImage src={undefined} />
              <AvatarFallback className="bg-orange/20 text-orange text-xs font-bold">
                {(video.creatorName || "U").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {video.creatorName || "Unknown"}
              </p>
            </div>
            {!isOwnVideo && (
              <Button
                size="sm"
                data-ocid="premiere.primary_button"
                onClick={handleSubscribe}
                className={`text-xs px-4 h-7 rounded-full font-semibold border-none ${
                  subscribed
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-orange hover:bg-orange/90 text-white"
                }`}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </Button>
            )}
          </div>

          {/* Premiere info card */}
          {publishTimeMs && (
            <div className="rounded-xl border border-orange/20 bg-orange/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
                <p className="text-sm font-bold text-orange">
                  {isLive ? "Now Premiering" : countdown}
                </p>
              </div>
              {!isLive && (
                <>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={13} className="text-orange/60" />
                    <span>{formatPremiereDate(publishTimeMs)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={13} className="text-orange/60" />
                    <span>{formatPremiereDaysLabel(publishTimeMs)}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground/60">
                    The video will automatically unlock at premiere time. Come
                    back then to watch!
                  </p>
                </>
              )}
            </div>
          )}

          {/* Set Reminder button — only for upcoming (not yet live) videos */}
          {publishTimeMs && !isLive && (
            <button
              type="button"
              data-ocid="premiere.set_reminder_button"
              onClick={handleReminderToggle}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                reminderSet
                  ? "bg-orange/20 text-orange border border-orange/40 hover:bg-orange/30"
                  : "bg-white/[0.08] text-white/80 border border-white/15 hover:bg-white/[0.15]"
              }`}
            >
              <Bell
                size={16}
                className={reminderSet ? "fill-orange text-orange" : ""}
              />
              {reminderSet ? "Reminder Set" : "Set Reminder"}
            </button>
          )}

          {/* Description if any */}
          {video.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
