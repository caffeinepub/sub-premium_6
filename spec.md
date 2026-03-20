# SUB PREMIUM

## Current State
The upload system uses `ExternalBlob.fromBytes(new Uint8Array(await file.arrayBuffer()))` which loads the entire video into memory before upload begins. The StorageClient already chunks files into 1MB pieces and uploads up to 10 in parallel with per-chunk retry logic (3 attempts, exponential backoff). Chunks are content-addressed by SHA-256 hash — so re-uploading the same file naturally skips chunks the server already has.

Progress is tracked via `ExternalBlob.withUploadProgress(pct => ...)` giving a 0–1 fraction. State is saved to localStorage. The context exposes `uploadSpeed` and `timeRemaining` strings. There is no file fingerprinting, no cross-session chunk-level resume, no IndexedDB storage, and no per-chunk UI feedback.

## Requested Changes (Diff)

### Add
- `src/frontend/src/utils/uploadDB.ts` — IndexedDB utility for durable upload state persistence
- File fingerprinting: `name|size|lastModified` string to identify the same file across reloads
- `chunkIndex: number` and `totalChunks: number` in context (estimated from file size / 1MB)
- `uploadedMB: number` and `totalMB: number` in context
- `isResuming: boolean` in context — true when pick matches a saved fingerprint
- On file selection, check IndexedDB for matching fingerprint → if found, pre-populate resume state
- "Resuming upload..." indicator in UploadPage and UploadProgressBar
- Rich progress row: "X.X MB / Y.Y MB · Chunk N/T · X.X MB/s · ~Xs left"
- Interrupted state detection: on mount, if IndexedDB has unfinished state, surface it

### Modify
- `UploadContext.tsx` — add IndexedDB persistence, file fingerprint tracking, chunk estimation from progress fraction, `isResuming`, `uploadedMB`, `totalMB`, `chunkIndex`, `totalChunks` exported
- `UploadProgressBar.tsx` — add MB counter, chunk index, resuming label
- `UploadPage.tsx` — add resume detection banner when file matches saved fingerprint, show chunk-level progress row

### Remove
- localStorage usage in UploadContext (replaced by IndexedDB)

## Implementation Plan
1. Create `src/frontend/src/utils/uploadDB.ts` with IndexedDB open/save/load/clear helpers storing `{ fingerprint, videoId, title, progress, chunkIndex, totalChunks, fileSizeMB, savedAt }` in `subpremium-upload` / `upload-state` store
2. Rewrite `UploadContext.tsx`: fingerprint on `startUpload`, estimate chunks (`totalChunks = ceil(fileSizeMB * 1)` for 1MB StorageClient chunks), update `chunkIndex = round(totalChunks * pct)` and `uploadedMB = totalMB * pct` in progress callback, save to IndexedDB on every progress tick, detect resume on mount and expose `isResuming` flag, clear IndexedDB on ready/reset
3. Update `UploadProgressBar.tsx`: show "Resuming..." badge when `isResuming`, add "X.X / Y.Y MB" and "Chunk N/T" below progress bar
4. Update `UploadPage.tsx`: when `isResuming` is true and file is selected, show a teal/blue "Resuming from N%" banner; show the full progress row with MB + chunks during upload
