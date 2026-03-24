import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { Suspense, lazy, useEffect, useState } from "react";
import { toast } from "sonner";
import { IntroScreen } from "./IntroScreen";
import type { Video } from "./backend";
import { BottomNav } from "./components/BottomNav";
import { ErrorBoundary, PageLoadingFallback } from "./components/ErrorBoundary";
import { FloatingMiniPlayer } from "./components/FloatingMiniPlayer";
import { GlobalUploadManager } from "./components/GlobalUploadManager";
import { Header } from "./components/Header";
import { LoginModal } from "./components/LoginModal";
import { ManageStorageSheet } from "./components/ManageStorageSheet";
import { SettingsSheet } from "./components/SettingsSheet";
import { AppProvider, useApp } from "./context/AppContext";
import { UploadQueueProvider } from "./context/UploadQueueContext";
import { useActivityKeepAlive } from "./hooks/useActivityKeepAlive";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { I18nProvider, useI18n } from "./i18n";
import {
  getScheduledVideos,
  markScheduledVideoNotified,
} from "./utils/dateTimePrefs";
import { isUpcoming } from "./utils/premiereUtils";
import {
  getPendingReminders,
  markReminderNotified,
} from "./utils/reminderUtils";
import {
  autoCleanupOldEntries,
  getTotalStorageEstimate,
  isStorageHigh,
} from "./utils/storageManager";

// ── Lazy-loaded page components ──────────────────────────────────────────────
const HomePage = lazy(() =>
  import("./pages/HomePage").then((m) => ({ default: m.HomePage })),
);
const VideoPlayerPage = lazy(() =>
  import("./pages/VideoPlayerPage").then((m) => ({
    default: m.VideoPlayerPage,
  })),
);
const UploadPage = lazy(() =>
  import("./pages/UploadPage").then((m) => ({ default: m.UploadPage })),
);
const HistoryPage = lazy(() =>
  import("./pages/HistoryPage").then((m) => ({ default: m.HistoryPage })),
);
const MenuPage = lazy(() =>
  import("./pages/MenuPage").then((m) => ({ default: m.MenuPage })),
);
const PlaylistPage = lazy(() =>
  import("./pages/PlaylistPage").then((m) => ({ default: m.PlaylistPage })),
);
const SettingsPage = lazy(() =>
  import("./pages/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);
const ChannelPage = lazy(() =>
  import("./pages/ChannelPage").then((m) => ({ default: m.ChannelPage })),
);
const CalendarPage = lazy(() =>
  import("./pages/CalendarPage").then((m) => ({ default: m.CalendarPage })),
);
const PremierePreviewPage = lazy(() =>
  import("./pages/PremierePreviewPage").then((m) => ({
    default: m.PremierePreviewPage,
  })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    },
  },
});

function AppContent() {
  const { page, selectedVideo, setSelectedVideo, setPage } = useApp();
  const { dir, t } = useI18n();
  const { identity } = useInternetIdentity();
  const [searchTerm, setSearchTerm] = useState("");
  const [storageBannerVisible, setStorageBannerVisible] = useState(false);
  const [manageStorageOpen, setManageStorageOpen] = useState(false);

  // Background activity keepalive — prevents inactivity expiration
  useActivityKeepAlive();

  useEffect(() => {
    autoCleanupOldEntries();
  }, []);

  useEffect(() => {
    getTotalStorageEstimate().then((breakdown) => {
      if (isStorageHigh(breakdown.total)) {
        setStorageBannerVisible(true);
      }
    });
  }, []);

  // Check for scheduled videos that have gone live
  useEffect(() => {
    const checkScheduled = () => {
      const now = Date.now();
      const scheduled = getScheduledVideos();
      for (const s of scheduled) {
        if (!s.notified && s.publishTime <= now) {
          markScheduledVideoNotified(s.videoId);
          window.dispatchEvent(
            new CustomEvent("videoPublished", {
              detail: { videoId: s.videoId },
            }),
          );
          const userId = identity?.getPrincipal().toString();
          if (userId) {
            const reminders = getPendingReminders(userId);
            const match = reminders.find((r) => r.videoId === s.videoId);
            if (match) {
              toast.success(`🔔 "${s.title}" is now live!`, { duration: 6000 });
              markReminderNotified(userId, s.videoId);
            } else {
              toast.success(`🎉 "${s.title}" is now live!`);
            }
          } else {
            toast.success(`🎉 "${s.title}" is now live!`);
          }
        }
      }
    };

    checkScheduled();
    const interval = setInterval(checkScheduled, 60_000);
    return () => clearInterval(interval);
  }, [identity]);

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    if (isUpcoming(video)) {
      setPage("premiere-preview");
    } else {
      setPage("player");
    }
  };

  return (
    <div
      dir={dir}
      className="flex flex-col h-[100dvh] max-w-[430px] mx-auto relative bg-background"
    >
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onVideoSelect={handleVideoSelect}
      />

      {storageBannerVisible && (
        <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/15 border-b border-orange-500/25 flex-shrink-0">
          <span className="text-xs text-orange-300 flex-1">
            {t("storage.gettingFull")}
          </span>
          <button
            type="button"
            onClick={() => setManageStorageOpen(true)}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 underline underline-offset-2 flex-shrink-0"
            data-ocid="home.primary_button"
          >
            {t("storage.manage")}
          </button>
          <button
            type="button"
            onClick={() => setStorageBannerVisible(false)}
            className="text-orange-400/60 hover:text-orange-300 ml-1"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-16">
        <ErrorBoundary>
          <Suspense fallback={<PageLoadingFallback />}>
            <AnimatePresence mode="wait">
              {page === "home" && (
                <div key="home">
                  <HomePage searchTerm={searchTerm} />
                </div>
              )}
              {page === "player" && (
                <div key="player">
                  <VideoPlayerPage />
                </div>
              )}
              {page === "upload" && (
                <div key="upload">
                  <UploadPage />
                </div>
              )}
              {page === "history" && (
                <div key="history">
                  <HistoryPage />
                </div>
              )}
              {page === "menu" && (
                <div key="menu">
                  <MenuPage />
                </div>
              )}
              {page === "playlist" && (
                <div key="playlist">
                  <PlaylistPage />
                </div>
              )}
              {page === "settings" && (
                <div key="settings">
                  <SettingsPage />
                </div>
              )}
              {page === "channel" && (
                <div key="channel">
                  <ChannelPage />
                </div>
              )}
              {page === "calendar" && (
                <div key="calendar">
                  <CalendarPage />
                </div>
              )}
              {page === "premiere-preview" && selectedVideo && (
                <div key="premiere-preview">
                  <PremierePreviewPage video={selectedVideo} />
                </div>
              )}
              {/* Fallback: unknown page → home */}
              {![
                "home",
                "player",
                "upload",
                "history",
                "menu",
                "playlist",
                "settings",
                "channel",
                "calendar",
                "premiere-preview",
              ].includes(page) && (
                <div key="home-fallback">
                  <HomePage searchTerm="" />
                </div>
              )}
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>
      </div>

      <GlobalUploadManager />
      <BottomNav />
      <LoginModal />
      <SettingsSheet />
      <FloatingMiniPlayer />
      <ManageStorageSheet
        open={manageStorageOpen}
        onOpenChange={setManageStorageOpen}
      />
    </div>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem("introShown"),
  );

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* non-critical */
      });
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem("introShown", "1");
    setShowIntro(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <AppProvider>
          <I18nProvider>
            <UploadQueueProvider>
              <ErrorBoundary>
                {showIntro ? (
                  <IntroScreen onComplete={handleIntroComplete} />
                ) : (
                  <AppContent />
                )}
              </ErrorBoundary>
              <Toaster richColors closeButton />
            </UploadQueueProvider>
          </I18nProvider>
        </AppProvider>
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}
