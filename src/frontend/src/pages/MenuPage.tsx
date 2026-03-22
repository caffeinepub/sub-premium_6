import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  Camera,
  ChevronRight,
  Link,
  ListVideo,
  Loader2,
  LogIn,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { CreatorTier } from "../backend";
import type { Video } from "../backend";
import { useApp } from "../context/AppContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteVideo,
  useListVideos,
  useSaveProfile,
  useUserProfile,
} from "../hooks/useQueries";
import { deletePlaylist, getPlaylists } from "../utils/playlists";

export function MenuPage() {
  const { setPage, setSelectedVideo, setSelectedPlaylistId } = useApp();
  const { identity, login, isInitializing } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const saveProfile = useSaveProfile();
  const { data: allVideos = [] } = useListVideos();
  const deleteVideo = useDeleteVideo();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  // Playlist state
  const [playlists, setPlaylists] = useState(getPlaylists());

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const editProfileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatarBlobId || "");
    }
  }, [profile]);

  const { data: creatorStats } = useQuery({
    queryKey: ["creatorStats"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCreatorStats();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !!identity,
    staleTime: 60_000,
  });

  const myVideos = allVideos.filter(
    (v) => v.creatorId === identity?.getPrincipal().toString(),
  );

  const handleAvatarChange = async (file: File) => {
    setUploading(true);
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      const url = blob.getDirectURL();
      setAvatarUrl(url);
    } catch {
      toast.error("Failed to process avatar");
    } finally {
      setUploading(false);
    }
  };

  const isActorReady = !!actor && !actorFetching;
  const isSaveDisabled =
    saveProfile.isPending || uploading || !isActorReady || profileLoading;

  const handleSave = async () => {
    if (!identity) {
      toast.error("Please log in first");
      login();
      return;
    }
    if (!isActorReady) {
      toast.error("Still connecting — please try again in a moment.");
      return;
    }
    try {
      await saveProfile.mutateAsync({
        displayName,
        username,
        bio,
        avatarBlobId: avatarUrl,
      });
      toast.success("Profile saved!");
    } catch (err) {
      const raw = err instanceof Error ? err.message : String(err);
      const message = raw.includes("Not authenticated")
        ? "Session expired — please log in again."
        : raw.includes("Actor not ready")
          ? "Network not ready, please try again."
          : raw;
      toast.error(message);
    }
  };

  const handleAddLink = () => {
    if (newLink.trim()) {
      setLinks((prev) => [...prev, newLink.trim()]);
      setNewLink("");
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      await deleteVideo.mutateAsync(videoId);
      toast.success("Video deleted");
    } catch {
      toast.error("Failed to delete video");
    }
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setPage("player");
  };

  const refreshPlaylists = () => setPlaylists(getPlaylists());

  const scrollToEditProfile = () => {
    editProfileRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const avatarSrc = avatarPreview || avatarUrl;
  const avatarInitials = displayName.slice(0, 2).toUpperCase() || "SP";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-y-auto pb-20"
    >
      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 bg-background border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          data-ocid="menu.close_button"
          onClick={() => setPage("home")}
          className="p-1.5 rounded-full hover:bg-accent transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-base">Profile &amp; Settings</h1>
      </div>

      {/* ── PROFILE HEADER ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {isInitializing ? (
          <motion.div
            key="header-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-4 py-4 bg-background"
          >
            <Skeleton className="w-12 h-12 rounded-full bg-surface2 flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-28 bg-surface2" />
              <Skeleton className="h-3 w-20 bg-surface2" />
            </div>
          </motion.div>
        ) : identity ? (
          <motion.div
            key="header-loggedin"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-0 px-4 py-4 bg-background"
          >
            {/* Avatar — tap → edit profile */}
            <button
              type="button"
              data-ocid="menu.upload_button"
              onClick={scrollToEditProfile}
              className="relative flex-shrink-0"
              aria-label="Edit profile"
            >
              <Avatar className="w-12 h-12 border-2 border-orange/60">
                {avatarSrc && <AvatarImage src={avatarSrc} />}
                <AvatarFallback className="bg-surface2 text-sm font-bold text-orange">
                  {avatarInitials}
                </AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              <span
                aria-label="Online"
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background"
              />
            </button>

            {/* Name + username — tap → channel page */}
            <button
              type="button"
              data-ocid="menu.link"
              onClick={() => setPage("channel")}
              className="flex-1 ml-3 min-w-0 text-left active:opacity-70 transition-opacity cursor-pointer"
            >
              {profileLoading ? (
                <>
                  <Skeleton className="h-3.5 w-28 bg-surface2 mb-1.5" />
                  <Skeleton className="h-3 w-20 bg-surface2" />
                </>
              ) : (
                <>
                  <p className="font-bold text-white text-sm leading-tight truncate">
                    {displayName || "Your Name"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    @{username || "username"}
                  </p>
                </>
              )}
            </button>

            {/* View channel button — tap → channel page */}
            <button
              type="button"
              data-ocid="menu.secondary_button"
              onClick={() => setPage("channel")}
              className="flex items-center gap-0.5 text-xs font-semibold text-orange flex-shrink-0 ml-2 hover:text-orange/80 transition-colors"
            >
              View channel
              <ChevronRight size={13} className="mt-px" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="header-loggedout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-4 py-4 bg-background"
          >
            {/* Generic avatar placeholder */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-surface2 flex items-center justify-center">
                <LogIn size={20} className="text-muted-foreground" />
              </div>
            </div>
            <p className="flex-1 text-sm text-muted-foreground">
              Sign in to see your profile
            </p>
            <button
              type="button"
              data-ocid="menu.primary_button"
              onClick={login}
              className="text-xs font-semibold text-orange hover:text-orange/80 transition-colors flex-shrink-0"
            >
              Sign in
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider below header */}
      <Separator className="bg-border/40" />

      {/* Settings row */}
      <button
        type="button"
        data-ocid="menu.settings.button"
        onClick={() => setPage("settings")}
        className="w-full flex items-center justify-between px-4 py-3.5 border-b border-border/30 hover:bg-white/5 active:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Settings size={17} className="text-orange" />
          <span className="text-sm font-medium">Settings</span>
        </div>
        <ChevronRight size={15} className="text-muted-foreground" />
      </button>

      <div className="px-4 py-5 space-y-6">
        {/* ── PLAYLISTS SECTION ─────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ListVideo size={14} className="text-orange" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Playlists
            </p>
          </div>

          {playlists.length === 0 ? (
            <div
              data-ocid="menu.empty_state"
              className="text-center py-6 text-muted-foreground text-sm"
            >
              No playlists yet
            </div>
          ) : (
            <div data-ocid="menu.list" className="space-y-2">
              {playlists.map((pl, idx) => {
                return (
                  <div
                    key={pl.id}
                    data-ocid={`menu.item.${idx + 1}`}
                    className="bg-surface2/50 rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlaylistId(pl.id);
                        setPage("playlist");
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface2 transition-colors text-left"
                    >
                      <Bookmark
                        size={15}
                        className="text-orange flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {pl.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pl.videoIds.length} video
                          {pl.videoIds.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      {pl.id !== "watch_later" && (
                        <button
                          type="button"
                          data-ocid={`menu.delete_button.${idx + 1}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePlaylist(pl.id);
                            refreshPlaylists();
                          }}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Separator className="bg-border/60" />

        {/* Not logged in */}
        {!isInitializing && !identity && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 py-10"
          >
            <div className="w-16 h-16 rounded-full bg-surface2 flex items-center justify-center">
              <LogIn size={28} className="text-orange" />
            </div>
            <div className="text-center">
              <p className="font-bold text-base mb-1">
                Log in to edit your profile
              </p>
              <p className="text-sm text-muted-foreground">
                Sign in with Internet Identity to access and save your profile.
              </p>
            </div>
            <Button
              data-ocid="menu.primary_button"
              className="bg-orange hover:bg-orange/90 text-white font-semibold px-8"
              onClick={login}
            >
              <LogIn size={16} className="mr-2" /> Log In
            </Button>
          </motion.div>
        )}

        {/* Initializing */}
        {isInitializing && (
          <div
            data-ocid="menu.loading_state"
            className="flex flex-col items-center gap-4 py-10"
          >
            <Skeleton className="w-16 h-16 rounded-full bg-surface2" />
            <Skeleton className="h-4 w-32 bg-surface2" />
            <Skeleton className="h-4 w-48 bg-surface2" />
          </div>
        )}

        {/* Logged-in profile editor */}
        {!isInitializing && identity && (
          <>
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="w-20 h-20 border-2 border-orange">
                  {(avatarPreview || avatarUrl) && (
                    <AvatarImage src={avatarPreview || avatarUrl} />
                  )}
                  <AvatarFallback className="bg-surface2 text-xl font-bold text-orange">
                    {displayName.slice(0, 2).toUpperCase() || "SP"}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  data-ocid="menu.upload_button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-orange flex items-center justify-center shadow-lg"
                >
                  <Camera size={14} className="text-white" />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAvatarChange(file);
                  }}
                />
              </div>
              {profileLoading && <Skeleton className="h-4 w-24 bg-surface2" />}
              {!profileLoading && (
                <div className="text-center">
                  <p className="font-bold">{displayName || "Your Name"}</p>
                  <p className="text-sm text-muted-foreground">
                    @{username || "username"}
                  </p>
                  {creatorStats &&
                    creatorStats.tier === CreatorTier.verified && (
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <BadgeCheck size={13} className="text-blue-400" />
                        <span className="text-[11px] font-semibold text-blue-400">
                          Verified Creator
                        </span>
                      </div>
                    )}
                  {creatorStats && creatorStats.tier === CreatorTier.active && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <ShieldCheck size={13} className="text-orange" />
                      <span className="text-[11px] font-semibold text-orange">
                        Active Creator
                      </span>
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    Unlimited uploads
                  </p>
                </div>
              )}
            </div>

            {/* Network connecting banner */}
            {actorFetching && (
              <div
                data-ocid="menu.loading_state"
                className="flex items-center gap-2 rounded-xl bg-surface2/60 px-3 py-2.5 text-sm text-muted-foreground"
              >
                <Loader2 size={14} className="animate-spin flex-shrink-0" />
                <span>Connecting to network…</span>
              </div>
            )}

            {/* Edit Profile */}
            <div ref={editProfileRef} className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Edit Profile
              </p>

              <div>
                <Label className="text-xs mb-1 block">Display Name</Label>
                <Input
                  data-ocid="menu.input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                  className="bg-surface2 border-border focus-visible:ring-orange"
                />
              </div>

              <div>
                <Label className="text-xs mb-1 block">Username</Label>
                <Input
                  data-ocid="menu.input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="@username"
                  className="bg-surface2 border-border focus-visible:ring-orange"
                />
              </div>

              <div>
                <Label className="text-xs mb-1 block">Bio</Label>
                <Textarea
                  data-ocid="menu.textarea"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell viewers about yourself..."
                  className="bg-surface2 border-border focus-visible:ring-orange resize-none"
                  rows={3}
                />
              </div>

              {/* Links */}
              <div>
                <Label className="text-xs mb-1 block">External Links</Label>
                <div className="space-y-2">
                  {links.map((link, i) => (
                    <div key={link} className="flex items-center gap-2">
                      <Link
                        size={12}
                        className="text-muted-foreground flex-shrink-0"
                      />
                      <span className="flex-1 text-sm text-muted-foreground truncate">
                        {link}
                      </span>
                      <button
                        type="button"
                        data-ocid={`menu.delete_button.${i + 1}`}
                        onClick={() =>
                          setLinks((prev) => prev.filter((_, j) => j !== i))
                        }
                        className="p-1 hover:text-destructive transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      data-ocid="menu.search_input"
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
                      placeholder="https://..."
                      className="bg-surface2 border-border focus-visible:ring-orange text-sm"
                    />
                    <Button
                      data-ocid="menu.secondary_button"
                      size="sm"
                      variant="outline"
                      onClick={handleAddLink}
                      className="border-border flex-shrink-0"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                data-ocid="menu.save_button"
                className="w-full bg-orange hover:bg-orange/90 text-white font-semibold disabled:opacity-60"
                onClick={handleSave}
                disabled={isSaveDisabled}
              >
                {saveProfile.isPending ? (
                  <>
                    <Loader2 size={14} className="mr-2 animate-spin" />{" "}
                    Saving...
                  </>
                ) : actorFetching ? (
                  <>
                    <Loader2 size={14} className="mr-2 animate-spin" />{" "}
                    Connecting...
                  </>
                ) : (
                  <>
                    <Save size={14} className="mr-2" /> Save Profile
                  </>
                )}
              </Button>
            </div>

            <Separator className="bg-border/60" />

            {/* My Videos */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                My Videos ({myVideos.length})
              </p>

              {myVideos.length === 0 ? (
                <div
                  data-ocid="menu.empty_state"
                  className="text-center py-8 text-muted-foreground text-sm"
                >
                  You haven&apos;t uploaded any videos yet
                </div>
              ) : (
                <div data-ocid="menu.list" className="space-y-3">
                  {myVideos.map((video, i) => (
                    <div
                      key={video.id}
                      data-ocid={`menu.item.${i + 1}`}
                      className="flex gap-3 items-center"
                    >
                      <button
                        type="button"
                        className="relative w-24 h-14 rounded-lg overflow-hidden bg-surface2 flex-shrink-0"
                        onClick={() => handleVideoClick(video)}
                        aria-label={`Play ${video.title}`}
                      >
                        {video.thumbnailBlob?.getDirectURL?.() ? (
                          <img
                            src={video.thumbnailBlob.getDirectURL()}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full bg-orange/20 flex items-center justify-center">
                              <svg
                                aria-hidden="true"
                                width="8"
                                height="8"
                                viewBox="0 0 8 8"
                                fill="none"
                              >
                                <path
                                  d="M2 1L7 4L2 7V1Z"
                                  fill="oklch(0.68 0.18 35)"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold line-clamp-2 leading-snug">
                          {video.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {Number(video.views).toLocaleString()} views
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            type="button"
                            data-ocid={`menu.delete_button.${i + 1}`}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                          data-ocid="menu.dialog"
                          className="bg-popover border-border max-w-xs mx-4"
                        >
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete video?</AlertDialogTitle>
                            <AlertDialogDescription>
                              &ldquo;{video.title}&rdquo; will be permanently
                              deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              data-ocid="menu.cancel_button"
                              className="border-border"
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              data-ocid="menu.confirm_button"
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                              onClick={() => handleDeleteVideo(video.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-6 pt-2 text-center">
        <p className="text-xs text-muted-foreground/50">
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-muted-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </motion.div>
  );
}
