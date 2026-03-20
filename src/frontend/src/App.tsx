import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { FloatingMiniPlayer } from "./components/FloatingMiniPlayer";
import { Header } from "./components/Header";
import { LoginModal } from "./components/LoginModal";
import { SettingsSheet } from "./components/SettingsSheet";
import { UploadProgressBar } from "./components/UploadProgressBar";
import { AppProvider, useApp } from "./context/AppContext";
import { UploadProvider } from "./context/UploadContext";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import { HistoryPage } from "./pages/HistoryPage";
import { HomePage } from "./pages/HomePage";
import { MenuPage } from "./pages/MenuPage";
import { UploadPage } from "./pages/UploadPage";
import { VideoPlayerPage } from "./pages/VideoPlayerPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
  },
});

function AppContent() {
  const { page } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col h-[100dvh] max-w-[430px] mx-auto relative bg-background">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Main scrollable area — pb-16 reserves space for fixed BottomNav */}
      <div className="flex-1 overflow-y-auto pb-16">
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
        </AnimatePresence>
      </div>

      <UploadProgressBar />
      <BottomNav />
      <LoginModal />
      <SettingsSheet />
      <FloatingMiniPlayer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <AppProvider>
          <UploadProvider>
            <AppContent />
            <Toaster
              theme="dark"
              position="top-center"
              toastOptions={{
                style: {
                  background: "oklch(0.21 0.012 240)",
                  border: "1px solid oklch(0.26 0.012 240)",
                  color: "oklch(0.96 0.005 240)",
                },
              }}
            />
          </UploadProvider>
        </AppProvider>
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}
