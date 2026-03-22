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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertTriangle,
  Database,
  Film,
  HardDrive,
  Image,
  Loader2,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Video } from "../backend";
import { useDeleteVideo, useListVideos } from "../hooks/useQueries";
import {
  type StorageBreakdown,
  clearCache,
  clearFailedUploads,
  clearTempFiles,
  clearUnusedFiles,
  formatBytes,
  formatBytesAsMB,
  getTotalStorageEstimate,
  isStorageHigh,
} from "../utils/storageManager";

interface ManageStorageSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatVideoSize(video: Video): string {
  const qualityMap: Record<string, number> = {
    "480p": 200 * 1024 * 1024,
    "720p": 500 * 1024 * 1024,
    "1080p": 1024 * 1024 * 1024,
  };
  const bytes = qualityMap[video.qualityLevel] ?? 250 * 1024 * 1024;
  return formatBytes(bytes);
}

export function ManageStorageSheet({
  open,
  onOpenChange,
}: ManageStorageSheetProps) {
  const { data: allVideos = [] } = useListVideos();
  const deleteVideo = useDeleteVideo();

  const [storage, setStorage] = useState<StorageBreakdown | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const myVideos = allVideos;

  const refreshStorage = useCallback(async () => {
    setLoading(true);
    try {
      const breakdown = await getTotalStorageEstimate();
      setStorage(breakdown);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) refreshStorage();
  }, [open, refreshStorage]);

  const handleAction = async (
    key: string,
    fn: () => Promise<void>,
    label: string,
  ) => {
    setActionLoading(key);
    try {
      await fn();
      toast.success(`${label} complete`);
      await refreshStorage();
    } catch {
      toast.error(`Failed: ${label}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedVideos(new Set(myVideos.map((v) => v.id)));
    } else {
      setSelectedVideos(new Set());
    }
  };

  const handleToggleVideo = (id: string) => {
    setSelectedVideos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    setActionLoading("bulk");
    try {
      await Promise.all(
        Array.from(selectedVideos).map((id) => deleteVideo.mutateAsync(id)),
      );
      toast.success(
        `Deleted ${selectedVideos.size} video${selectedVideos.size > 1 ? "s" : ""}`,
      );
      setSelectedVideos(new Set());
      setSelectAll(false);
      await refreshStorage();
    } catch {
      toast.error("Some videos could not be deleted");
    } finally {
      setActionLoading(null);
    }
  };

  const totalBytes = storage?.total ?? 0;
  const isHigh = isStorageHigh(totalBytes);

  const progressPercent = storage
    ? Math.min(90, (storage.cache / Math.max(storage.total, 1)) * 100 + 10)
    : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        data-ocid="storage.sheet"
        className="bg-[#121212] border-t border-white/10 rounded-t-2xl p-0 max-h-[92dvh] flex flex-col"
      >
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-bold text-white flex items-center gap-2">
              <HardDrive size={18} className="text-orange-400" />
              Manage Storage
            </SheetTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-white/50 hover:text-white p-1"
              data-ocid="storage.close_button"
            >
              <X size={20} />
            </button>
          </div>
        </SheetHeader>

        <div className="overflow-y-auto flex-1 pb-8">
          {/* Smart warning banner */}
          {isHigh && (
            <div className="mx-4 mt-4 bg-orange-500/15 border border-orange-500/30 rounded-xl p-3 flex items-start gap-3">
              <AlertTriangle
                size={18}
                className="text-orange-400 flex-shrink-0 mt-0.5"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange-300">
                  Storage is getting full
                </p>
                <p className="text-xs text-orange-300/70 mt-0.5">
                  Free up space to keep the app running smoothly
                </p>
              </div>
              <Button
                size="sm"
                data-ocid="storage.primary_button"
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 h-7 flex-shrink-0"
                onClick={() =>
                  handleAction("unused", clearUnusedFiles, "Clean all")
                }
                disabled={actionLoading !== null}
              >
                Clean Now
              </Button>
            </div>
          )}

          {/* Storage overview card */}
          <div className="mx-4 mt-4 bg-[#1E1E1E] border border-white/8 rounded-2xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider font-medium mb-1">
                  Storage used
                </p>
                <div className="flex items-baseline gap-2">
                  {loading ? (
                    <Loader2
                      size={16}
                      className="text-orange-400 animate-spin"
                      data-ocid="storage.loading_state"
                    />
                  ) : (
                    <>
                      <span className="text-xl font-bold text-white">
                        {storage ? formatBytesAsMB(totalBytes) : "0 MB"}
                      </span>
                      <span className="text-sm text-white/40">/ expanding</span>
                    </>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={refreshStorage}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                data-ocid="storage.secondary_button"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>

            {/* Progress bar */}
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-2">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles size={11} className="text-orange-400" />
              <p className="text-xs text-white/40">
                Storage expands automatically
              </p>
            </div>
          </div>

          {/* Breakdown section */}
          <div className="mx-4 mt-3 bg-[#1E1E1E] border border-white/8 rounded-2xl overflow-hidden">
            <p className="text-xs text-white/40 uppercase tracking-wider font-medium px-4 pt-4 pb-2">
              Breakdown
            </p>
            <div className="divide-y divide-white/6">
              <BreakdownRow
                icon={<Film size={16} className="text-blue-400" />}
                label="Videos"
                bytes={storage?.videos ?? 0}
                color="bg-blue-400"
                total={totalBytes}
              />
              <BreakdownRow
                icon={<Image size={16} className="text-purple-400" />}
                label="Thumbnails"
                bytes={storage?.thumbnails ?? 0}
                color="bg-purple-400"
                total={totalBytes}
              />
              <BreakdownRow
                icon={<Database size={16} className="text-green-400" />}
                label="Cache & Temp Files"
                bytes={storage?.cache ?? 0}
                color="bg-green-400"
                total={totalBytes}
              />
            </div>
          </div>

          {/* Free Up Space actions */}
          <div className="mx-4 mt-3">
            <p className="text-xs text-white/40 uppercase tracking-wider font-medium mb-3">
              Free Up Space
            </p>
            <div className="space-y-2">
              <ActionButton
                icon={<Zap size={15} className="text-green-400" />}
                label="Clear Cache"
                description="Removes temporary app data. Safe, instant."
                loading={actionLoading === "cache"}
                onClick={() => handleAction("cache", clearCache, "Clear cache")}
                ocid="storage.primary_button"
              />
              <ActionButton
                icon={<Trash2 size={15} className="text-orange-400" />}
                label="Delete Unused Files"
                description="Removes orphaned and duplicate files."
                loading={actionLoading === "unused"}
                onClick={() =>
                  handleAction(
                    "unused",
                    clearUnusedFiles,
                    "Delete unused files",
                  )
                }
                ocid="storage.delete_button"
              />
              <ActionButton
                icon={<X size={15} className="text-red-400" />}
                label="Remove Failed Uploads"
                description="Clears stuck or failed upload records."
                loading={actionLoading === "failed"}
                onClick={() =>
                  handleAction(
                    "failed",
                    clearFailedUploads,
                    "Remove failed uploads",
                  )
                }
                ocid="storage.secondary_button"
              />
              <ActionButton
                icon={<Database size={15} className="text-blue-400" />}
                label="Clear Temporary Data"
                description="Removes temp files from completed uploads."
                loading={actionLoading === "temp"}
                onClick={() =>
                  handleAction("temp", clearTempFiles, "Clear temporary data")
                }
                ocid="storage.toggle"
              />
            </div>
          </div>

          <Separator className="mx-4 my-5 bg-white/8" />

          {/* Video Management */}
          <div className="mx-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-white/40 uppercase tracking-wider font-medium">
                Your Videos
              </p>
              {myVideos.length > 0 && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all-videos"
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    className="border-white/30 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    data-ocid="storage.checkbox"
                  />
                  <label
                    htmlFor="select-all-videos"
                    className="text-xs text-white/60 cursor-pointer"
                  >
                    Select all
                  </label>
                </div>
              )}
            </div>

            {myVideos.length === 0 ? (
              <div
                className="text-center py-8 text-white/30 text-sm"
                data-ocid="storage.empty_state"
              >
                No uploaded videos yet
              </div>
            ) : (
              <div className="space-y-2">
                {myVideos.map((video, idx) => (
                  <VideoManageRow
                    key={video.id}
                    video={video}
                    selected={selectedVideos.has(video.id)}
                    onToggle={() => handleToggleVideo(video.id)}
                    size={formatVideoSize(video)}
                    index={idx + 1}
                  />
                ))}
              </div>
            )}

            {selectedVideos.size > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full mt-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                    disabled={actionLoading === "bulk"}
                    data-ocid="storage.delete_button"
                  >
                    {actionLoading === "bulk" ? (
                      <Loader2 size={14} className="mr-2 animate-spin" />
                    ) : (
                      <Trash2 size={14} className="mr-2" />
                    )}
                    Delete Selected ({selectedVideos.size})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#1E1E1E] border-white/10">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">
                      Delete {selectedVideos.size} video
                      {selectedVideos.size > 1 ? "s" : ""}?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-white/50">
                      This action cannot be undone. The selected videos will be
                      permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      className="bg-white/10 border-white/10 text-white hover:bg-white/20"
                      data-ocid="storage.cancel_button"
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={handleBulkDelete}
                      data-ocid="storage.confirm_button"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function BreakdownRow({
  icon,
  label,
  bytes,
  color,
  total,
}: {
  icon: React.ReactNode;
  label: string;
  bytes: number;
  color: string;
  total: number;
}) {
  const pct = total > 0 ? Math.round((bytes / total) * 100) : 0;
  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-white/80">{label}</span>
          <span className="text-sm font-mono text-white/60">
            {formatBytes(bytes)}
          </span>
        </div>
        <div className="h-1 bg-white/8 rounded-full overflow-hidden">
          <div
            className={`h-full ${color} rounded-full transition-all`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  description,
  loading,
  onClick,
  ocid,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  loading: boolean;
  onClick: () => void;
  ocid: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      data-ocid={ocid}
      className="w-full bg-[#1E1E1E] hover:bg-[#282828] border border-white/8 rounded-xl px-4 py-3 flex items-center gap-3 text-left transition-colors disabled:opacity-50"
    >
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
        {loading ? (
          <Loader2 size={15} className="animate-spin text-white/60" />
        ) : (
          icon
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-white/40 mt-0.5">{description}</p>
      </div>
    </button>
  );
}

function VideoManageRow({
  video,
  selected,
  onToggle,
  size,
  index,
}: {
  video: Video;
  selected: boolean;
  onToggle: () => void;
  size: string;
  index: number;
}) {
  const thumbUrl = video.thumbnailBlob?.getDirectURL?.() ?? "";
  return (
    <button
      type="button"
      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
        selected
          ? "bg-orange-500/10 border-orange-500/30"
          : "bg-[#1E1E1E] border-white/8"
      }`}
      onClick={onToggle}
      data-ocid={`storage.item.${index}`}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={onToggle}
        onClick={(e) => e.stopPropagation()}
        className="border-white/30 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 flex-shrink-0"
        data-ocid={`storage.checkbox.${index}`}
      />
      <div className="w-12 h-8 rounded bg-white/10 overflow-hidden flex-shrink-0">
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <Film size={14} className="text-white/30" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{video.title}</p>
        <p className="text-xs text-white/40">
          {size} · {video.qualityLevel || "processing"}
        </p>
      </div>
    </button>
  );
}
