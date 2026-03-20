import { useQueryClient } from "@tanstack/react-query";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { ExternalBlob } from "../backend";
import { useActor } from "../hooks/useActor";
import { useApp } from "./AppContext";

export type UploadStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "ready"
  | "error";

interface UploadState {
  status: UploadStatus;
  progress: number;
  title: string;
  errorMsg: string;
}

export interface UploadParams {
  title: string;
  videoFile: File;
  thumbnailFile: File | null;
}

interface UploadContextValue extends UploadState {
  startUpload: (params: UploadParams) => void;
  retry: () => void;
  reset: () => void;
  isActive: boolean;
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

export function UploadProvider({ children }: { children: ReactNode }) {
  const { actor } = useActor();
  const qc = useQueryClient();
  const { setJustUploadedVideoId, setPage } = useApp();

  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const paramsRef = useRef<UploadParams | null>(null);
  const isRunningRef = useRef(false);

  const doUpload = useCallback(
    async (params: UploadParams) => {
      if (isRunningRef.current) return;
      if (!actor) {
        setStatus("error");
        setErrorMsg("Not authenticated");
        return;
      }

      isRunningRef.current = true;
      setTitle(params.title);
      setStatus("uploading");
      setProgress(0);
      setErrorMsg("");

      try {
        const id = crypto.randomUUID();

        // Upload video: 0-85%
        const videoBytes = new Uint8Array(await params.videoFile.arrayBuffer());
        const videoBlob = ExternalBlob.fromBytes(videoBytes).withUploadProgress(
          (pct) => setProgress(Math.round(pct * 85)),
        );

        // Upload thumbnail: 85-97%
        let thumbBlob: ExternalBlob;
        if (params.thumbnailFile) {
          const thumbBytes = new Uint8Array(
            await params.thumbnailFile.arrayBuffer(),
          );
          thumbBlob = ExternalBlob.fromBytes(thumbBytes).withUploadProgress(
            (pct) => setProgress(85 + Math.round(pct * 12)),
          );
        } else {
          thumbBlob = ExternalBlob.fromBytes(BLANK_JPEG);
        }

        await actor.uploadVideo(id, params.title, videoBlob, thumbBlob);

        setProgress(97);
        setStatus("processing");
        await actor.updateVideoStatus(id, "processing");

        setProgress(100);
        await actor.updateVideoStatus(id, "ready");
        setStatus("ready");

        await qc.invalidateQueries({ queryKey: ["videos"] });
        setJustUploadedVideoId(id);
        setPage("home");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setStatus("error");
        setErrorMsg(msg);
      } finally {
        isRunningRef.current = false;
      }
    },
    [actor, qc, setJustUploadedVideoId, setPage],
  );

  const startUpload = useCallback(
    (params: UploadParams) => {
      paramsRef.current = params;
      doUpload(params);
    },
    [doUpload],
  );

  const retry = useCallback(() => {
    if (paramsRef.current) {
      setProgress(0);
      doUpload(paramsRef.current);
    }
  }, [doUpload]);

  const reset = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setTitle("");
    setErrorMsg("");
    paramsRef.current = null;
    isRunningRef.current = false;
  }, []);

  const isActive = status === "uploading" || status === "processing";

  return (
    <UploadContext.Provider
      value={{
        status,
        progress,
        title,
        errorMsg,
        startUpload,
        retry,
        reset,
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
