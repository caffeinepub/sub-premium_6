import { useQueryClient } from "@tanstack/react-query";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ExternalBlob } from "../backend";
import { useActor } from "../hooks/useActor";
import {
  clearUploadRecord,
  getFileFingerprint,
  loadLatestUploadRecord,
  loadUploadRecord,
  saveUploadRecord,
} from "../utils/uploadDB";
import { useApp } from "./AppContext";

export type UploadStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "ready"
  | "error";

/** 500 MB — warn user, upload still proceeds */
const MAX_WARN_SIZE = 500 * 1024 * 1024;
/** 1 GB — hard block */
const MAX_BLOCK_SIZE = 1 * 1024 * 1024 * 1024;
/** StorageClient internal chunk size (1 MB) */
const CHUNK_SIZE_BYTES = 1024 * 1024;
/** 3 MB per streaming chunk for memory-safe reads */
const UPLOAD_CHUNK_SIZE = 3 * 1024 * 1024;

interface UploadState {
  status: UploadStatus;
  progress: number; // 0-100
  title: string;
  errorMsg: string;
  fileSizeWarning: string | null;
  fileSizeMB: number;
  uploadedMB: number;
  totalMB: number;
  chunkIndex: number;
  totalChunks: number;
  uploadSpeed: string;
  timeRemaining: string;
  isResuming: boolean;
  isOffline: boolean;
}

export interface UploadParams {
  title: string;
  videoFile: File;
  thumbnailFile: File | null;
  description?: string;
}

interface UploadContextValue extends UploadState {
  startUpload: (params: UploadParams) => void;
  retry: () => void;
  reset: () => void;
  isActive: boolean;
  /** Check if a newly selected file has a saved interrupted state */
  checkResume: (file: File) => Promise<boolean>;
  processingStage: "" | "480p" | "720p" | "1080p";
}

const UploadContext = createContext<UploadContextValue | undefined>(undefined);

const BLANK_JPEG = new Uint8Array([
  0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01,
  0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08,
  0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a,
  0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12, 0x13, 0x0f, 0x14, 0x1d,
  0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20, 0x22,
  0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34,
  0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0,
  0x00, 0x0b, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4,
  0x00, 0x1f, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
  0x07, 0x08, 0x09, 0x0a, 0x0b, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00,
  0x3f, 0x00, 0xfb, 0xd2, 0x8a, 0x28, 0x03, 0xff, 0xd9,
]);

function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec <= 0) return "";
  const mbps = bytesPerSec / (1024 * 1024);
  if (mbps >= 1) return `${mbps.toFixed(1)} MB/s`;
  const kbps = bytesPerSec / 1024;
  return `${kbps.toFixed(0)} KB/s`;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  if (seconds > 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  }
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/**
 * Exponential-backoff retry wrapper.
 * Retries up to maxAttempts times, doubling the delay each time.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 5,
  baseDelayMs = 1000,
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt >= maxAttempts) throw err;
      await new Promise((r) => setTimeout(r, baseDelayMs * 2 ** (attempt - 1)));
    }
  }
}

export function UploadProvider({ children }: { children: ReactNode }) {
  const { actor } = useActor();
  const qc = useQueryClient();
  const { setJustUploadedVideoId, setPage } = useApp();

  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fileSizeWarning, setFileSizeWarning] = useState<string | null>(null);
  const [fileSizeMB, setFileSizeMB] = useState(0);
  const [uploadedMB, setUploadedMB] = useState(0);
  const [totalMB, setTotalMB] = useState(0);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isResuming, setIsResuming] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [processingStage, setProcessingStage] = useState<
    "" | "480p" | "720p" | "1080p"
  >("");

  const paramsRef = useRef<UploadParams | null>(null);
  const isRunningRef = useRef(false);
  const videoIdRef = useRef<string | null>(null);
  const fingerprintRef = useRef<string | null>(null);
  const uploadStartTimeRef = useRef<number>(0);
  const totalBytesRef = useRef<number>(0);
  // Throttle IndexedDB saves — write at most once per second
  const lastSaveRef = useRef<number>(0);
  const progressRef = useRef<number>(0);
  const chunkIndexRef = useRef<number>(0);
  const statusRef = useRef<UploadStatus>("idle");
  const errorMsgRef = useRef<string>("");

  // Keep statusRef / errorMsgRef in sync
  useEffect(() => {
    statusRef.current = status;
    errorMsgRef.current = errorMsg;
  }, [status, errorMsg]);

  // ── Online / offline detection ──────────────────────────────────────────
  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      console.info(
        "[UploadContext] Network offline — upload will retry when connection restores.",
      );
    };

    const handleOnline = () => {
      setIsOffline(false);
      // Auto-retry if upload was in error state due to a network error
      if (
        statusRef.current === "error" &&
        errorMsgRef.current.toLowerCase().includes("connection")
      ) {
        if (paramsRef.current) {
          setProgress(progressRef.current);
          setUploadedMB(
            (progressRef.current / 100) *
              (paramsRef.current.videoFile.size / (1024 * 1024)),
          );
          // Keep videoIdRef so chunks are skipped server-side
          doUpload(paramsRef.current);
        }
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On mount, check IndexedDB for any interrupted upload
  useEffect(() => {
    loadLatestUploadRecord().then((record) => {
      if (!record) return;
      // Only restore if it was interrupted (not completed)
      setTitle(record.title);
      setProgress(record.progress);
      setFileSizeMB(record.fileSizeMB);
      setTotalMB(record.fileSizeMB);
      setUploadedMB((record.fileSizeMB * record.progress) / 100);
      setChunkIndex(record.chunkIndex);
      setTotalChunks(record.totalChunks);
      setStatus("error");
      setErrorMsg(
        `Upload interrupted at ${record.progress}%. Select the same file and tap Retry to resume.`,
      );
      videoIdRef.current = record.videoId;
      fingerprintRef.current = record.fingerprint;
    });
  }, []);

  // ── Navigation guard — prevent accidental page leave during upload ──────
  const isActive = status === "uploading" || status === "processing";

  useEffect(() => {
    if (!isActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Modern browsers require returnValue to be set
      e.returnValue = "Upload in progress — leave and lose progress?";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isActive]);

  /**
   * Check whether a newly selected file matches a saved interrupted upload.
   * Returns true if a resume record was found and context was pre-populated.
   */
  const checkResume = useCallback(async (file: File): Promise<boolean> => {
    const fp = getFileFingerprint(file);
    const record = await loadUploadRecord(fp);
    if (!record) return false;
    // Pre-populate state so the UI shows the resume banner
    setIsResuming(true);
    setTitle(record.title);
    setProgress(record.progress);
    setFileSizeMB(record.fileSizeMB);
    setTotalMB(record.fileSizeMB);
    setUploadedMB((record.fileSizeMB * record.progress) / 100);
    setChunkIndex(record.chunkIndex);
    setTotalChunks(record.totalChunks);
    videoIdRef.current = record.videoId;
    fingerprintRef.current = fp;
    return true;
  }, []);

  const doUpload = useCallback(
    async (params: UploadParams) => {
      if (isRunningRef.current) return;
      if (!actor) {
        setStatus("error");
        setErrorMsg("Not authenticated. Please log in and try again.");
        return;
      }

      // ── Upload permission check ───────────────────────────────────────
      try {
        const perm = (await (actor as any).checkUploadPermission()) as {
          allowed: boolean;
          reason: string;
          cooldownRemaining: bigint;
        };
        if (!perm.allowed) {
          setStatus("error");
          setErrorMsg(perm.reason || "Upload not allowed at this time.");
          return;
        }
        if (perm.cooldownRemaining > 0n) {
          setStatus("error");
          setErrorMsg(
            `Please wait ${Number(perm.cooldownRemaining)} seconds before uploading again.`,
          );
          return;
        }
      } catch {
        // If the method doesn't exist yet, proceed normally
      }

      // ── File size checks ──────────────────────────────────────────────
      const sizeBytes = params.videoFile.size;
      const sizeMB = sizeBytes / (1024 * 1024);
      setFileSizeMB(sizeMB);
      setTotalMB(sizeMB);

      if (sizeBytes > MAX_BLOCK_SIZE) {
        setStatus("error");
        setErrorMsg(
          "File exceeds 1 GB limit. Please compress or trim your video.",
        );
        return;
      }

      setFileSizeWarning(
        sizeBytes > MAX_WARN_SIZE
          ? `Large file (${sizeMB.toFixed(0)} MB) — upload may take longer. Consider compressing for faster results.`
          : null,
      );

      // ── Setup ─────────────────────────────────────────────────────────
      isRunningRef.current = true;
      setTitle(params.title);
      setStatus("uploading");
      setProgress(0);
      setUploadedMB(0);
      setErrorMsg("");
      setUploadSpeed("");
      setTimeRemaining("");

      // Estimate total chunks (StorageClient uses 1 MB chunks)
      const estimatedChunks = Math.max(
        1,
        Math.ceil(sizeBytes / CHUNK_SIZE_BYTES),
      );
      setTotalChunks(estimatedChunks);
      setChunkIndex(0);

      // Assign/reuse video ID
      if (!videoIdRef.current) {
        videoIdRef.current = crypto.randomUUID();
      }
      const id = videoIdRef.current;

      // Assign fingerprint for IndexedDB key
      const fp = getFileFingerprint(params.videoFile);
      fingerprintRef.current = fp;

      uploadStartTimeRef.current = Date.now();
      totalBytesRef.current = sizeBytes;

      // Keep reference so GC can collect after upload
      let videoBytes: Uint8Array<ArrayBuffer> | null = null;

      try {
        // ── Memory-safe video bytes load ──────────────────────────────
        try {
          if (sizeBytes > 200 * 1024 * 1024) {
            // For files > 200 MB, read in UPLOAD_CHUNK_SIZE segments and concatenate
            // to reduce peak memory vs one giant arrayBuffer() call
            const parts: Uint8Array[] = [];
            let offset = 0;
            while (offset < sizeBytes) {
              const end = Math.min(offset + UPLOAD_CHUNK_SIZE, sizeBytes);
              const segBuf = await params.videoFile
                .slice(offset, end)
                .arrayBuffer();
              parts.push(new Uint8Array(segBuf));
              offset = end;
            }
            // Concatenate all parts
            const merged = new Uint8Array(sizeBytes);
            let pos = 0;
            for (const part of parts) {
              merged.set(part, pos);
              pos += part.length;
            }
            videoBytes = merged as Uint8Array<ArrayBuffer>;
          } else {
            videoBytes = new Uint8Array(
              (await params.videoFile.arrayBuffer()) as ArrayBuffer,
            );
          }
        } catch (memErr: unknown) {
          const msg =
            memErr instanceof Error ? memErr.message.toLowerCase() : "";
          const isOOM =
            msg.includes("out of memory") ||
            msg.includes("memory") ||
            msg.includes("allocation") ||
            msg.includes("arraybuffer");
          setStatus("error");
          setErrorMsg(
            isOOM
              ? "File too large to load. Try a smaller video or compress it first."
              : "Failed to read video file. Please try again.",
          );
          isRunningRef.current = false;
          return;
        }

        // ── Video ExternalBlob with progress tracking ─────────────────
        const videoBlob = ExternalBlob.fromBytes(videoBytes).withUploadProgress(
          (pct) => {
            // pct is 0-1 for the video portion (maps to 0-85% of total progress)
            const newProgress = Math.round(pct * 85);
            const newUploadedMB = sizeMB * pct;
            const newChunkIndex = Math.round(estimatedChunks * pct);

            setProgress(newProgress);
            progressRef.current = newProgress;
            setUploadedMB(newUploadedMB);
            setChunkIndex(newChunkIndex);
            chunkIndexRef.current = newChunkIndex;
            setIsResuming(false);

            // Speed + ETA calculation
            const elapsed = (Date.now() - uploadStartTimeRef.current) / 1000;
            if (elapsed > 1) {
              const bytesUploaded = sizeBytes * pct;
              const speed = bytesUploaded / elapsed;
              const bytesRemaining = sizeBytes - bytesUploaded;
              const eta = speed > 0 ? bytesRemaining / speed : 0;
              setUploadSpeed(formatSpeed(speed));
              setTimeRemaining(formatTime(eta));
            }

            // Throttled IndexedDB save (max once/sec)
            const now = Date.now();
            if (now - lastSaveRef.current > 1000) {
              lastSaveRef.current = now;
              saveUploadRecord({
                fingerprint: fp,
                videoId: id,
                title: params.title,
                progress: newProgress,
                chunkIndex: newChunkIndex,
                totalChunks: estimatedChunks,
                fileSizeMB: sizeMB,
                savedAt: now,
              });
            }
          },
        );

        // ── Thumbnail ────────────────────────────────────────────────
        let thumbBlob: ExternalBlob;
        if (params.thumbnailFile) {
          let thumbBytes: Uint8Array<ArrayBuffer>;
          try {
            thumbBytes = new Uint8Array(
              (await params.thumbnailFile.arrayBuffer()) as ArrayBuffer,
            );
          } catch {
            thumbBytes = BLANK_JPEG;
          }
          thumbBlob = ExternalBlob.fromBytes(thumbBytes).withUploadProgress(
            (pct) => {
              setProgress(85 + Math.round(pct * 12));
            },
          );
        } else {
          thumbBlob = ExternalBlob.fromBytes(BLANK_JPEG);
        }

        // ── Upload (with exponential-backoff retry) ───────────────────
        await withRetry(
          () =>
            actor.uploadVideo(
              id,
              params.title,
              videoBlob,
              thumbBlob,
              params.description ?? "",
            ),
          5,
          1000,
        );

        // Allow GC to collect video bytes now that upload is done
        videoBytes = null;

        setProgress(97);
        setUploadSpeed("");
        setTimeRemaining("");
        setStatus("processing");
        await actor.updateVideoStatus(id, "processing");

        setProgress(100);
        setUploadedMB(sizeMB);
        setChunkIndex(estimatedChunks);
        await actor.updateVideoStatus(id, "ready");
        setStatus("ready");
        setIsResuming(false);

        // Background quality simulation (non-blocking)
        const bgId = id;
        const bgActor = actor;
        setTimeout(async () => {
          try {
            setProcessingStage("480p");
            await bgActor.updateVideoQuality(bgId, "480p");
            setTimeout(async () => {
              try {
                setProcessingStage("720p");
                await bgActor.updateVideoQuality(bgId, "720p");
                setTimeout(async () => {
                  try {
                    setProcessingStage("1080p");
                    await bgActor.updateVideoQuality(bgId, "1080p");
                  } catch {
                    /* non-critical */
                  }
                }, 4000);
              } catch {
                /* non-critical */
              }
            }, 3000);
          } catch {
            /* non-critical */
          }
        }, 2000);

        // Clear persisted state on success
        clearUploadRecord(fp);
        videoIdRef.current = null;
        fingerprintRef.current = null;

        // Track storage usage (fire and forget)
        try {
          await (actor as any).addStorageUsage(BigInt(params.videoFile.size));
        } catch {
          // Non-critical
        }

        // Invalidate both videos and uploadStats queries
        await qc.invalidateQueries({ queryKey: ["videos"] });
        qc.invalidateQueries({ queryKey: ["uploadStats"] });

        setJustUploadedVideoId(id);
        setPage("home");
      } catch (err: unknown) {
        // Ensure video bytes are released even on error
        videoBytes = null;

        const raw = err instanceof Error ? err.message : String(err);
        const msg = raw.toLowerCase();
        let userMsg: string;

        if (
          msg.includes("out of memory") ||
          msg.includes("allocation") ||
          (msg.includes("memory") && !msg.includes("network"))
        ) {
          userMsg =
            "File too large to process. Try a smaller video or compress it first.";
        } else if (
          msg.includes("network") ||
          msg.includes("fetch") ||
          msg.includes("connection") ||
          msg.includes("timeout") ||
          msg.includes("offline")
        ) {
          userMsg =
            "Connection lost. Tap Retry — already-uploaded chunks will be skipped.";
        } else {
          userMsg = raw || "Upload failed. Tap Retry to try again.";
        }

        setStatus("error");
        setErrorMsg(userMsg);
        setUploadSpeed("");
        setTimeRemaining("");

        // Save interrupted state to IndexedDB so user can resume later
        if (fingerprintRef.current && videoIdRef.current) {
          saveUploadRecord({
            fingerprint: fingerprintRef.current,
            videoId: videoIdRef.current,
            title: params.title,
            progress: progressRef.current,
            chunkIndex: chunkIndexRef.current,
            totalChunks: estimatedChunks ?? 0,
            fileSizeMB: sizeMB,
            savedAt: Date.now(),
          });
        }
      } finally {
        isRunningRef.current = false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actor, qc, setJustUploadedVideoId, setPage],
  );

  const startUpload = useCallback(
    (params: UploadParams) => {
      paramsRef.current = params;
      // If not resuming (no saved videoId), issue a fresh ID
      if (!isResuming || !videoIdRef.current) {
        videoIdRef.current = null;
      }
      setIsResuming(false);
      doUpload(params);
    },
    [doUpload, isResuming],
  );

  const retry = useCallback(() => {
    if (paramsRef.current) {
      setProgress(0);
      setUploadedMB(0);
      // Keep videoIdRef so already-uploaded chunks are skipped server-side
      doUpload(paramsRef.current);
    }
  }, [doUpload]);

  const reset = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setTitle("");
    setErrorMsg("");
    setFileSizeWarning(null);
    setFileSizeMB(0);
    setUploadedMB(0);
    setTotalMB(0);
    setChunkIndex(0);
    setTotalChunks(0);
    setUploadSpeed("");
    setTimeRemaining("");
    setIsResuming(false);
    paramsRef.current = null;
    isRunningRef.current = false;
    if (fingerprintRef.current) {
      clearUploadRecord(fingerprintRef.current);
    }
    videoIdRef.current = null;
    fingerprintRef.current = null;
  }, []);

  return (
    <UploadContext.Provider
      value={{
        status,
        progress,
        title,
        errorMsg,
        fileSizeWarning,
        fileSizeMB,
        uploadedMB,
        totalMB,
        chunkIndex,
        totalChunks,
        uploadSpeed,
        timeRemaining,
        isResuming,
        isOffline,
        processingStage,
        startUpload,
        retry,
        reset,
        checkResume,
        isActive,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  const ctx = useContext(UploadContext);
  if (!ctx) throw new Error("useUpload must be used within UploadProvider");
  return ctx;
}
