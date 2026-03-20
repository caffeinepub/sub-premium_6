import { type ReactNode, createContext, useContext, useState } from "react";
import type { Video } from "../backend";

export type Page = "home" | "player" | "upload" | "history" | "menu";

interface AppContextValue {
  page: Page;
  setPage: (page: Page) => void;
  selectedVideo: Video | null;
  setSelectedVideo: (video: Video | null) => void;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  justUploadedVideoId: string | null;
  setJustUploadedVideoId: (id: string | null) => void;
  miniPlayerActive: boolean;
  setMiniPlayerActive: (v: boolean) => void;
  miniPlayerVideo: Video | null;
  setMiniPlayerVideo: (v: Video | null) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>("home");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [justUploadedVideoId, setJustUploadedVideoId] = useState<string | null>(
    null,
  );
  const [miniPlayerActive, setMiniPlayerActive] = useState(false);
  const [miniPlayerVideo, setMiniPlayerVideo] = useState<Video | null>(null);

  return (
    <AppContext.Provider
      value={{
        page,
        setPage,
        selectedVideo,
        setSelectedVideo,
        loginModalOpen,
        setLoginModalOpen,
        settingsOpen,
        setSettingsOpen,
        justUploadedVideoId,
        setJustUploadedVideoId,
        miniPlayerActive,
        setMiniPlayerActive,
        miniPlayerVideo,
        setMiniPlayerVideo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
