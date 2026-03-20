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
import {
  ArrowLeft,
  Camera,
  Link,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { Video } from "../backend";
import { useApp } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteVideo,
  useListVideos,
  useSaveProfile,
  useUserProfile,
} from "../hooks/useQueries";

export function MenuPage() {
  const { setPage, setSelectedVideo } = useApp();
  const { identity } = useInternetIdentity();
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

  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatarBlobId || "");
    }
  }, [profile]);

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

  const handleSave = async () => {
    try {
      await saveProfile.mutateAsync({
        displayName,
        username,
        bio,
        avatarBlobId: avatarUrl,
      });
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-y-auto pb-20"
    >
      <div className="sticky top-0 z-30 bg-background border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          data-ocid="menu.close_button"
          onClick={() => setPage("home")}
          className="p-1.5 rounded-full hover:bg-accent transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-base">Profile & Settings</h1>
      </div>

      <div className="px-4 py-5 space-y-6">
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
            </div>
          )}
        </div>

        {/* Edit Profile */}
        <div className="space-y-3">
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
            className="w-full bg-orange hover:bg-orange/90 text-white font-semibold"
            onClick={handleSave}
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" /> Saving...
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
                    {video.thumbnailBlobId?.getDirectURL?.() ? (
                      <img
                        src={video.thumbnailBlobId.getDirectURL()}
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
