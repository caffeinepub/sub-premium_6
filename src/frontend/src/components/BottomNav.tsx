import { cn } from "@/lib/utils";
import { History, Home, Menu, Plus } from "lucide-react";
import { type Page, useApp } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function BottomNav() {
  const {
    page,
    setPage,
    setLoginModalOpen,
    selectedVideo,
    setMiniPlayerActive,
    setMiniPlayerVideo,
  } = useApp();
  const { identity } = useInternetIdentity();

  const navigate = (target: Page) => {
    if ((target === "upload" || target === "menu") && !identity) {
      setLoginModalOpen(true);
      return;
    }
    // Activate mini-player when leaving the player page
    if (page === "player" && target !== "player" && selectedVideo) {
      setMiniPlayerVideo(selectedVideo);
      setMiniPlayerActive(true);
    }
    setPage(target);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface1 border-t border-border/60">
      <div className="max-w-[430px] mx-auto flex items-center justify-around px-2 h-16">
        {/* Home */}
        <button
          type="button"
          data-ocid="nav.home.link"
          onClick={() => navigate("home")}
          className={cn(
            "flex flex-col items-center gap-1 min-w-[56px] py-1 transition-colors",
            page === "home"
              ? "text-orange"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Home size={22} />
          <span className="text-[10px] font-medium">Home</span>
          {page === "home" && (
            <span className="w-1 h-1 rounded-full bg-orange mt-[-4px]" />
          )}
        </button>

        {/* History */}
        <button
          type="button"
          data-ocid="nav.history.link"
          onClick={() => navigate("history")}
          className={cn(
            "flex flex-col items-center gap-1 min-w-[56px] py-1 transition-colors",
            page === "history"
              ? "text-orange"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <History size={22} />
          <span className="text-[10px] font-medium">History</span>
          {page === "history" && (
            <span className="w-1 h-1 rounded-full bg-orange mt-[-4px]" />
          )}
        </button>

        {/* Upload center button */}
        <button
          type="button"
          data-ocid="nav.upload.primary_button"
          onClick={() => navigate("upload")}
          className="flex flex-col items-center gap-1 -mt-5"
        >
          <div className="w-12 h-12 rounded-full border-2 border-orange bg-orange/10 flex items-center justify-center shadow-glow hover:bg-orange/20 transition-colors">
            <Plus size={24} className="text-orange" />
          </div>
          <span className="text-[10px] font-medium text-orange">Upload</span>
        </button>

        {/* Menu */}
        <button
          type="button"
          data-ocid="nav.menu.link"
          onClick={() => navigate("menu")}
          className={cn(
            "flex flex-col items-center gap-1 min-w-[56px] py-1 transition-colors",
            page === "menu"
              ? "text-orange"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Menu size={22} />
          <span className="text-[10px] font-medium">Menu</span>
          {page === "menu" && (
            <span className="w-1 h-1 rounded-full bg-orange mt-[-4px]" />
          )}
        </button>
      </div>
    </nav>
  );
}
