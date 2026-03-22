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
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useActor } from "../hooks/useActor";
import {
  clearUploadRecord,
  getFileFingerprint,
  loadQueueState,
  saveQueueState,
  saveUploadRecord,
} from "../utils/uploadDB";
import { useApp } from "./AppContext";

export type JobStatus =
  | "queued"
  | "uploading"
  | "paused"
  | "processing"
  | "completed"
  | "failed";

export interface UploadJob {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  progress: number;
  status: JobStatus;
  errorMsg: string;
  uploadedMB: number;
  totalMB: number;
  uploadSpeed: string;
  timeRemaining: string;
  fingerprint: string;
  videoId: string;
  isResuming: boolean;
  // Internal file references (not persisted)
  _file?: File;
  _thumbFile?: File | null;
  _description?: string;
}

export interface AddJobParams {
  title: string;
  videoFile: File;
  thumbnailFile: File | null;
  description?: string;
}

interface UploadQueueContextValue {
  jobs: UploadJob[];
  addJob: (params: AddJobParams) => void;
  pauseJob: (id: string) => void;
  resumeJob: (id: string) => void;
  cancelJob: (id: string) => void;
  retryJob: (id: string) => void;
  dismissJob: (id: string) => void;
  activeCount: number;
  queuedCount: number;
  hasActive: boolean;
}

const UploadQueueContext = createContext<UploadQueueContextValue | undefined>(
  undefined,
);

const MAX_CONCURRENT = 2;
const CHUNK_SIZE_BYTES = 1024 * 1024;
const UPLOAD_CHUNK_SIZE = 3 * 1024 * 1024;

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

export function UploadQueueProvider({ children }: { children: ReactNode }) {
  const { actor } = useActor();
  const qc = useQueryClient();
  const { setJustUploadedVideoId } = useApp();

  // Sync actor to a ref so async upload loops always read the latest value
  const actorRef = useRef(actor);
  useEffect(() => {
    actorRef.current = actor;
  }, [actor]);

  const qcRef = useRef(qc);
  useEffect(() => {
    qcRef.current = qc;
  }, [qc]);

  const setJustUploadedRef = useRef(setJustUploadedVideoId);
  useEffect(() => {
    setJustUploadedRef.current = setJustUploadedVideoId;
  }, [setJustUploadedVideoId]);

  // ── Jobs state with always-fresh ref ───────────────────────────────────
  const [jobs, _setJobs] = useState<UploadJob[]>([]);
  const jobsRef = useRef<UploadJob[]>([]);

  const setJobs = useCallback(
    (updater: UploadJob[] | ((prev: UploadJob[]) => UploadJob[])) => {
      _setJobs((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        jobsRef.current = next;
        return next;
      });
    },
    [],
  );

  // ── Abort flags: 'paused' | 'cancelled' ────────────────────────────────
  const abortFlagsRef = useRef<Map<string, "paused" | "cancelled">>(new Map());

  // ── Throttled IndexedDB save ────────────────────────────────────────────
  const lastQueueSaveRef = useRef(0);
  const saveQueueThrottled = useCallback(() => {
    const now = Date.now();
    if (now - lastQueueSaveRef.current < 1000) return;
    lastQueueSaveRef.current = now;
    const snapshot = jobsRef.current.map((j) => ({
      id: j.id,
      fingerprint: j.fingerprint,
      videoId: j.videoId,
      title: j.title,
      status: j.status,
      progress: j.progress,
      chunkIndex: 0,
      totalChunks: 0,
      fileSizeMB: j.totalMB,
      errorMsg: j.errorMsg,
      savedAt: Date.now(),
    }));
    saveQueueState(snapshot);
  }, []);

  // ── Load persisted queue on mount ──────────────────────────────────────
  useEffect(() => {
    loadQueueState().then((records) => {
      if (!records || records.length === 0) return;
      const restored: UploadJob[] = records
        .filter((r) => r.status !== "completed")
        .map((r) => ({
          id: r.id,
          title: r.title,
          thumbnailUrl: null,
          progress: r.progress,
          // Any active/queued jobs on reload become failed — File object is gone
          status:
            r.status === "completed" ? "completed" : ("failed" as JobStatus),
          errorMsg:
            r.status === "completed"
              ? ""
              : "Upload interrupted — tap Retry to re-add",
          uploadedMB: (r.fileSizeMB * r.progress) / 100,
          totalMB: r.fileSizeMB,
          uploadSpeed: "",
          timeRemaining: "",
          fingerprint: r.fingerprint,
          videoId: r.videoId,
          isResuming: false,
        }));
      if (restored.length > 0) {
        setJobs(restored);
      }
    });
  }, [setJobs]);

  // ── Update a single job field ──────────────────────────────────────────
  const updateJob = useCallback(
    (id: string, update: Partial<UploadJob>) => {
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, ...update } : j)),
      );
    },
    [setJobs],
  );

  // ── scheduleNext: start up to MAX_CONCURRENT - active queued jobs ──────
  const scheduleNext = useCallback(() => {
    const current = jobsRef.current;
    const activeCount = current.filter(
      (j) => j.status === "uploading" || j.status === "processing",
    ).length;
    const slots = MAX_CONCURRENT - activeCount;
    if (slots <= 0) return;

    const queued = current.filter((j) => j.status === "queued" && j._file);
    for (const job of queued.slice(0, slots)) {
      startJobUpload(job.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Core upload loop per job ───────────────────────────────────────────
  const startJobUpload = useCallback(
    async (jobId: string) => {
      const job = jobsRef.current.find((j) => j.id === jobId);
      if (!job || !job._file) return;

      const actor = actorRef.current;
      if (!actor) {
        updateJob(jobId, {
          status: "failed",
          errorMsg: "Not authenticated. Please log in and try again.",
        });
        scheduleNext();
        return;
      }

      // Remove any stale abort flags
      abortFlagsRef.current.delete(jobId);

      // Mark as uploading
      updateJob(jobId, {
        status: "uploading",
        errorMsg: "",
        isResuming: false,
      });

      const file = job._file;
      const sizeBytes = file.size;
      const sizeMB = sizeBytes / (1024 * 1024);
      const estimatedChunks = Math.max(
        1,
        Math.ceil(sizeBytes / CHUNK_SIZE_BYTES),
      );
      const videoId = job.videoId || crypto.randomUUID();
      const fingerprint = job.fingerprint;

      // Update videoId on job
      updateJob(jobId, { videoId, totalMB: sizeMB });

      const uploadStartTime = Date.now();
      const lastSave = { current: 0 };

      let videoBytes: Uint8Array<ArrayBuffer> | null = null;

      try {
        // ── Check upload permission ─────────────────────────────────────
        try {
          const perm = (await (actor as any).checkUploadPermission()) as {
            allowed: boolean;
            reason: string;
            cooldownRemaining: bigint;
          };
          if (!perm.allowed) {
            updateJob(jobId, {
              status: "failed",
              errorMsg: perm.reason || "Upload not allowed at this time.",
            });
            scheduleNext();
            return;
          }
        } catch {
          // Method may not exist — proceed
        }

        // ── Load file bytes ─────────────────────────────────────────────
        try {
          if (sizeBytes > 200 * 1024 * 1024) {
            const parts: Uint8Array[] = [];
            let offset = 0;
            while (offset < sizeBytes) {
              const end = Math.min(offset + UPLOAD_CHUNK_SIZE, sizeBytes);
              const segBuf = await file.slice(offset, end).arrayBuffer();
              parts.push(new Uint8Array(segBuf));
              offset = end;

              // Check abort between chunk reads
              const flag = abortFlagsRef.current.get(jobId);
              if (flag) {
                throw new Error(
                  flag === "paused" ? "__PAUSED__" : "__CANCELLED__",
                );
              }
            }
            const merged = new Uint8Array(sizeBytes);
            let pos = 0;
            for (const part of parts) {
              merged.set(part, pos);
              pos += part.length;
            }
            videoBytes = merged as Uint8Array<ArrayBuffer>;
          } else {
            videoBytes = new Uint8Array(
              (await file.arrayBuffer()) as ArrayBuffer,
            );
          }
        } catch (memErr: unknown) {
          const msg = memErr instanceof Error ? memErr.message : String(memErr);
          if (msg === "__PAUSED__" || msg === "__CANCELLED__") throw memErr;
          const isOOM =
            msg.toLowerCase().includes("out of memory") ||
            msg.toLowerCase().includes("memory") ||
            msg.toLowerCase().includes("allocation");
          throw new Error(
            isOOM
              ? "File too large to load. Try a smaller video or compress it first."
              : "Failed to read video file. Please try again.",
          );
        }

        // ── Video ExternalBlob with progress tracking ───────────────────
        const videoBlob = ExternalBlob.fromBytes(videoBytes).withUploadProgress(
          (pct) => {
            // Check abort flag during upload progress
            const flag = abortFlagsRef.current.get(jobId);
            if (flag) {
              throw new Error(
                flag === "paused" ? "__PAUSED__" : "__CANCELLED__",
              );
            }

            const newProgress = Math.round(pct * 85);
            const newUploadedMB = sizeMB * pct;

            const elapsed = (Date.now() - uploadStartTime) / 1000;
            let speed = "";
            let eta = "";
            if (elapsed > 1) {
              const bytesUploaded = sizeBytes * pct;
              const spd = bytesUploaded / elapsed;
              const bytesRemaining = sizeBytes - bytesUploaded;
              speed = formatSpeed(spd);
              eta = formatTime(spd > 0 ? bytesRemaining / spd : 0);
            }

            updateJob(jobId, {
              progress: newProgress,
              uploadedMB: newUploadedMB,
              uploadSpeed: speed,
              timeRemaining: eta,
            });

            // Throttled IndexedDB save
            const now = Date.now();
            if (now - lastSave.current > 1000) {
              lastSave.current = now;
              saveUploadRecord({
                fingerprint,
                videoId,
                title: job.title,
                progress: newProgress,
                chunkIndex: Math.round(estimatedChunks * pct),
                totalChunks: estimatedChunks,
                fileSizeMB: sizeMB,
                savedAt: now,
              });
            }
          },
        );

        // ── Thumbnail ──────────────────────────────────────────────────
        let thumbBlob: ExternalBlob;
        if (job._thumbFile) {
          try {
            const thumbBytes = new Uint8Array(
              (await job._thumbFile.arrayBuffer()) as ArrayBuffer,
            );
            thumbBlob = ExternalBlob.fromBytes(thumbBytes).withUploadProgress(
              (pct) => {
                updateJob(jobId, { progress: 85 + Math.round(pct * 12) });
              },
            );
          } catch {
            thumbBlob = ExternalBlob.fromBytes(BLANK_JPEG);
          }
        } else {
          thumbBlob = ExternalBlob.fromBytes(BLANK_JPEG);
        }

        // ── Upload with retry ──────────────────────────────────────────
        await withRetry(
          () =>
            actor.uploadVideo(
              videoId,
              job.title,
              videoBlob,
              thumbBlob,
              job._description ?? "",
            ),
          5,
          1000,
        );

        videoBytes = null;

        updateJob(jobId, {
          progress: 97,
          uploadSpeed: "",
          timeRemaining: "",
          status: "processing",
        });
        await actor.updateVideoStatus(videoId, "processing");
        await actor.updateVideoStatus(videoId, "ready");

        updateJob(jobId, {
          progress: 100,
          uploadedMB: sizeMB,
          status: "completed",
          errorMsg: "",
        });

        // Background quality progression
        const bgActor = actor;
        const bgId = videoId;
        setTimeout(async () => {
          try {
            await bgActor.updateVideoQuality(bgId, "480p");
            setTimeout(async () => {
              try {
                await bgActor.updateVideoQuality(bgId, "720p");
                setTimeout(async () => {
                  try {
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

        // Clear persisted state
        clearUploadRecord(fingerprint);

        // Storage tracking
        try {
          await (actor as any).addStorageUsage(BigInt(file.size));
        } catch {
          /* non-critical */
        }

        // Invalidate queries
        await qcRef.current.invalidateQueries({ queryKey: ["videos"] });
        qcRef.current.invalidateQueries({ queryKey: ["uploadStats"] });

        setJustUploadedRef.current(videoId);
        saveQueueThrottled();
        scheduleNext();
      } catch (err: unknown) {
        videoBytes = null;
        const raw = err instanceof Error ? err.message : String(err);

        if (raw === "__PAUSED__") {
          updateJob(jobId, {
            status: "paused",
            uploadSpeed: "",
            timeRemaining: "",
          });
          abortFlagsRef.current.delete(jobId);
          saveQueueThrottled();
          return;
        }

        if (raw === "__CANCELLED__") {
          // Remove the job
          setJobs((prev) => prev.filter((j) => j.id !== jobId));
          abortFlagsRef.current.delete(jobId);
          clearUploadRecord(fingerprint);
          saveQueueThrottled();
          scheduleNext();
          return;
        }

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
          msg.includes("timeout")
        ) {
          userMsg = "Connection lost. Retry to resume.";
        } else {
          userMsg = raw || "Upload failed. Tap Retry to try again.";
        }

        updateJob(jobId, {
          status: "failed",
          errorMsg: userMsg,
          uploadSpeed: "",
          timeRemaining: "",
        });
        saveQueueThrottled();
        scheduleNext();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateJob, scheduleNext, saveQueueThrottled, setJobs],
  );

  // ── Public API ─────────────────────────────────────────────────────────

  const addJob = useCallback(
    (params: AddJobParams) => {
      const fp = getFileFingerprint(params.videoFile);

      // Duplicate check
      const existing = jobsRef.current.find(
        (j) =>
          j.fingerprint === fp &&
          (j.status === "queued" ||
            j.status === "uploading" ||
            j.status === "paused"),
      );
      if (existing) {
        toast.error("This file is already in the upload queue.");
        return;
      }

      // Create thumbnail URL if provided
      let thumbnailUrl: string | null = null;
      if (params.thumbnailFile) {
        thumbnailUrl = URL.createObjectURL(params.thumbnailFile);
      }

      const id = crypto.randomUUID();
      const videoId = crypto.randomUUID();

      const job: UploadJob = {
        id,
        title: params.title,
        thumbnailUrl,
        progress: 0,
        status: "queued",
        errorMsg: "",
        uploadedMB: 0,
        totalMB: params.videoFile.size / (1024 * 1024),
        uploadSpeed: "",
        timeRemaining: "",
        fingerprint: fp,
        videoId,
        isResuming: false,
        _file: params.videoFile,
        _thumbFile: params.thumbnailFile,
        _description: params.description,
      };

      setJobs((prev) => [...prev, job]);

      // Schedule after state is set (use setTimeout to let React flush)
      setTimeout(() => scheduleNext(), 0);
      saveQueueThrottled();
    },
    [setJobs, scheduleNext, saveQueueThrottled],
  );

  const pauseJob = useCallback(
    (id: string) => {
      abortFlagsRef.current.set(id, "paused");
      // If job is queued (not yet uploading), just mark it paused directly
      const job = jobsRef.current.find((j) => j.id === id);
      if (job?.status === "queued") {
        updateJob(id, { status: "paused" });
      }
    },
    [updateJob],
  );

  const resumeJob = useCallback(
    (id: string) => {
      abortFlagsRef.current.delete(id);
      updateJob(id, { status: "queued", errorMsg: "", isResuming: true });
      setTimeout(() => scheduleNext(), 0);
    },
    [updateJob, scheduleNext],
  );

  const cancelJob = useCallback(
    (id: string) => {
      const job = jobsRef.current.find((j) => j.id === id);
      if (!job) return;

      if (job.status === "uploading" || job.status === "processing") {
        // Signal the upload loop to cancel
        abortFlagsRef.current.set(id, "cancelled");
      } else {
        // Not currently uploading — remove directly
        setJobs((prev) => prev.filter((j) => j.id !== id));
        clearUploadRecord(job.fingerprint);
        saveQueueThrottled();
      }
    },
    [setJobs, saveQueueThrottled],
  );

  const retryJob = useCallback(
    (id: string) => {
      const job = jobsRef.current.find((j) => j.id === id);
      if (!job) return;
      abortFlagsRef.current.delete(id);

      if (!job._file) {
        toast.error(
          "Original file is no longer available. Please add the file again.",
        );
        return;
      }

      updateJob(id, {
        status: "queued",
        progress: 0,
        uploadedMB: 0,
        errorMsg: "",
        uploadSpeed: "",
        timeRemaining: "",
        isResuming: false,
      });
      setTimeout(() => scheduleNext(), 0);
    },
    [updateJob, scheduleNext],
  );

  const dismissJob = useCallback(
    (id: string) => {
      setJobs((prev) => prev.filter((j) => j.id !== id));
      saveQueueThrottled();
    },
    [setJobs, saveQueueThrottled],
  );

  const activeCount = jobs.filter(
    (j) => j.status === "uploading" || j.status === "processing",
  ).length;
  const queuedCount = jobs.filter((j) => j.status === "queued").length;
  const hasActive = activeCount > 0;

  return (
    <UploadQueueContext.Provider
      value={{
        jobs,
        addJob,
        pauseJob,
        resumeJob,
        cancelJob,
        retryJob,
        dismissJob,
        activeCount,
        queuedCount,
        hasActive,
      }}
    >
      {children}
    </UploadQueueContext.Provider>
  );
}

export function useUploadQueue() {
  const ctx = useContext(UploadQueueContext);
  if (!ctx)
    throw new Error("useUploadQueue must be used within UploadQueueProvider");
  return ctx;
}
