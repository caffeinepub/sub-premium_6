import { Bell, Heart, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Video } from "../backend";
import { useApp } from "../context/AppContext";
import {
  type Notification,
  getNotifications,
  markAllRead,
} from "../utils/notifications";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

function NotifIcon({ type }: { type: Notification["type"] }) {
  if (type === "comment_like")
    return <Heart size={14} className="text-red-400" />;
  if (type === "comment_reply")
    return <MessageCircle size={14} className="text-blue-400" />;
  return <Bell size={14} className="text-orange" />;
}

interface NotificationPanelProps {
  videos?: Video[];
  open: boolean;
}

export function NotificationPanel({
  videos = [],
  open,
}: NotificationPanelProps) {
  const { setNotificationPanelOpen, setNotifTick, setSelectedVideo, setPage } =
    useApp();

  const handleMarkAllRead = () => {
    markAllRead();
    setNotifTick((t) => t + 1);
  };

  const handleNotifClick = (notif: Notification) => {
    if (notif.videoId) {
      const video = videos.find((v) => v.id === notif.videoId);
      if (video) {
        setSelectedVideo(video);
        setPage("player");
        setNotificationPanelOpen(false);
      }
    }
  };

  const notifications = getNotifications();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-ocid="notifications.panel"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="absolute top-full left-0 right-0 z-50 bg-surface1 border-b border-border/60 shadow-lg max-h-[70vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 sticky top-0 bg-surface1">
            <span className="text-sm font-semibold text-foreground">
              Notifications
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-ocid="notifications.secondary_button"
                onClick={handleMarkAllRead}
                className="text-xs text-orange hover:underline"
              >
                Mark all read
              </button>
              <button
                type="button"
                data-ocid="notifications.close_button"
                onClick={() => setNotificationPanelOpen(false)}
                className="p-1 rounded-full hover:bg-surface2 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Content */}
          {notifications.length === 0 ? (
            <div
              data-ocid="notifications.empty_state"
              className="py-10 text-center text-muted-foreground text-sm"
            >
              No notifications yet
            </div>
          ) : (
            <ul>
              {notifications.map((notif, i) => (
                <li
                  key={notif.id}
                  data-ocid={`notifications.item.${i + 1}`}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-border/20 transition-colors ${
                    notif.videoId ? "cursor-pointer hover:bg-surface2/50" : ""
                  } ${!notif.read ? "bg-surface2/30" : ""}`}
                  onClick={() => handleNotifClick(notif)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      handleNotifClick(notif);
                  }}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <NotifIcon type={notif.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground leading-snug">
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                      {notif.body}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {timeAgo(notif.timestamp)}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-orange flex-shrink-0 mt-1" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
