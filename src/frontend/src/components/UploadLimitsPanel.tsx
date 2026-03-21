import {
  HardDrive,
  Infinity as InfinityIcon,
  Shield,
  Timer,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUploadStats } from "../hooks/useUploadStats";

function formatBytes(bytes: bigint): string {
  const n = Number(bytes);
  if (n >= 1024 * 1024 * 1024)
    return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${n} B`;
}

function formatSeconds(sec: bigint): string {
  const s = Number(sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m > 0) return `${m}m ${r}s`;
  return `${r}s`;
}

export function UploadLimitsPanel() {
  const { identity } = useInternetIdentity();
  const { stats, isLoading } = useUploadStats();
  const [cooldownDisplay, setCooldownDisplay] = useState<bigint>(0n);
  const [blockDisplay, setBlockDisplay] = useState<bigint>(0n);

  // Live countdown timers
  useEffect(() => {
    if (!stats) return;
    setCooldownDisplay(stats.cooldownRemaining);
    setBlockDisplay(stats.tempBlockRemaining);
  }, [stats]);

  useEffect(() => {
    if (cooldownDisplay <= 0n && blockDisplay <= 0n) return;
    const id = setInterval(() => {
      setCooldownDisplay((prev) => (prev > 0n ? prev - 1n : 0n));
      setBlockDisplay((prev) => (prev > 0n ? prev - 1n : 0n));
    }, 1000);
    return () => clearInterval(id);
  }, [cooldownDisplay, blockDisplay]);

  if (!identity || isLoading || !stats) return null;

  return (
    <div
      data-ocid="upload.panel"
      className="bg-[#1A1A1A] border border-[#333] rounded-xl p-4 space-y-3"
    >
      {/* Temp block alert */}
      {blockDisplay > 0n && (
        <div
          data-ocid="upload.error_state"
          className="flex items-start gap-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2.5"
        >
          <Shield size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs font-medium text-red-400">
            Uploads paused due to rapid activity. Resumes in{" "}
            <span className="font-bold">{formatSeconds(blockDisplay)}</span>
          </p>
        </div>
      )}

      {/* Unlimited uploads branding */}
      <div className="flex items-center gap-2">
        <InfinityIcon size={15} className="text-orange flex-shrink-0" />
        <span className="text-sm font-semibold text-white">
          Unlimited uploads
        </span>
      </div>

      {/* Storage used */}
      <div className="flex items-center gap-2">
        <HardDrive size={13} className="text-muted-foreground flex-shrink-0" />
        <span className="text-xs text-muted-foreground">
          Storage used:{" "}
          <span className="text-white font-semibold">
            {formatBytes(stats.storageUsedBytes)}
          </span>
        </span>
      </div>

      {/* Cooldown countdown — only shown when active */}
      {cooldownDisplay > 0n && blockDisplay <= 0n && (
        <div
          data-ocid="upload.loading_state"
          className="flex items-center gap-2"
        >
          <Timer size={13} className="text-orange flex-shrink-0" />
          <span className="text-xs text-orange font-medium">
            Almost ready — uploading in{" "}
            <span className="font-bold tabular-nums">
              {formatSeconds(cooldownDisplay)}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
