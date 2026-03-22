import { cn } from "@/lib/utils";
import { History, Home, Menu, Upload } from "lucide-react";
import { type Page, useApp } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useT } from "../i18n";

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
  const t = useT();

  const TABS = [
    { id: "home" as Page, label: t("nav.home"), Icon: Home },
    { id: "upload" as Page, label: t("nav.upload"), Icon: Upload },
    { id: "history" as Page, label: t("nav.history"), Icon: History },
    { id: "menu" as Page, label: t("nav.menu"), Icon: Menu },
  ] as const;

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
      <div className="max-w-[430px] mx-auto flex items-stretch h-16">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = page === id;
          return (
            <button
              key={id}
              type="button"
              data-ocid={`nav.${id}.link`}
              onClick={() => navigate(id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-colors relative",
                isActive
                  ? "text-orange"
                  : id === "upload"
                    ? "text-muted-foreground hover:text-orange/80"
                    : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{label}</span>
              {isActive && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
