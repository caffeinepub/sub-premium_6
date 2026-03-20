import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, LogIn, LogOut, Search, Settings, User } from "lucide-react";
import type { ChangeEvent } from "react";
import { useApp } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserProfile } from "../hooks/useQueries";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export function Header({ searchTerm, onSearchChange }: HeaderProps) {
  const { setLoginModalOpen, setSettingsOpen, setPage } = useApp();
  const { identity, clear } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const qc = useQueryClient();

  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    qc.clear();
  };

  const avatarUrl = profile?.avatarBlobId ? profile.avatarBlobId : undefined;
  const initials = profile?.displayName
    ? profile.displayName.slice(0, 2).toUpperCase()
    : "SP";

  return (
    <header className="sticky top-0 z-40 w-full bg-surface1 border-b border-border/60 px-3 py-2">
      {/* Top row: logo + icons */}
      <div className="flex items-center gap-2 mb-2">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center shadow-glow flex-shrink-0">
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path d="M4 2.5L11.5 7L4 11.5V2.5Z" fill="white" />
            </svg>
          </div>
          <div className="leading-none">
            <div className="text-[10px] font-bold tracking-[0.2em] text-orange">
              SUB
            </div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-foreground">
              PREMIUM
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* Notification bell */}
        <button
          type="button"
          data-ocid="header.button"
          className="relative p-1.5 rounded-full hover:bg-accent transition-colors"
        >
          <Bell size={20} className="text-muted-foreground" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-orange rounded-full" />
        </button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              data-ocid="header.open_modal_button"
              className="relative focus:outline-none"
            >
              <Avatar className="w-8 h-8 border-2 border-border">
                {avatarUrl && <AvatarImage src={avatarUrl} />}
                <AvatarFallback className="bg-surface2 text-xs font-bold text-orange">
                  {isAuthenticated ? initials : <User size={14} />}
                </AvatarFallback>
              </Avatar>
              {isAuthenticated && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-online rounded-full border-2 border-surface1" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52 bg-popover border-border"
            data-ocid="header.dropdown_menu"
          >
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold">
                    {profile?.displayName || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @{profile?.username || "user"}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  data-ocid="header.link"
                  onClick={() => setPage("menu")}
                >
                  <User size={14} className="mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="settings.open_modal_button"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Settings size={14} className="mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  data-ocid="header.delete_button"
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut size={14} className="mr-2" /> Logout
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem
                  data-ocid="header.primary_button"
                  onClick={() => setLoginModalOpen(true)}
                >
                  <LogIn size={14} className="mr-2" /> Login / Sign Up
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="settings.open_modal_button"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Settings size={14} className="mr-2" /> Settings
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          data-ocid="home.search_input"
          type="search"
          placeholder="Search videos, channels, and creators"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
          className="pl-9 h-9 rounded-full bg-surface2 border-border/60 text-sm placeholder:text-muted-foreground focus-visible:ring-orange"
        />
      </div>
    </header>
  );
}
