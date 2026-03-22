// Smart Storage Manager — estimates local storage usage and provides cleanup tools.
// Tracks IndexedDB upload state, localStorage usage, and estimates based on video metadata.

import { type UploadRecord, clearAllUploadRecords } from "./uploadDB";

const DB_NAME = "subpremium-upload";
const STORE_NAME = "upload-state";
const DB_VERSION = 1;

function openUploadDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "fingerprint" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getAllUploadRecords(): Promise<UploadRecord[]> {
  try {
    const db = await openUploadDB();
    return await new Promise<UploadRecord[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        db.close();
        resolve((req.result as UploadRecord[]) || []);
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });
  } catch {
    return [];
  }
}

async function deleteUploadRecordsByFilter(
  filter: (r: UploadRecord) => boolean,
): Promise<number> {
  try {
    const db = await openUploadDB();
    const records = await getAllUploadRecords();
    const toDelete = records.filter(filter);
    if (toDelete.length === 0) return 0;

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      let count = 0;
      for (const r of toDelete) {
        const req = store.delete(r.fingerprint);
        req.onsuccess = () => {
          count++;
          if (count === toDelete.length) resolve();
        };
        req.onerror = () => reject(req.error);
      }
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
    });
    return toDelete.length;
  } catch {
    return 0;
  }
}

// ─── Estimate functions ────────────────────────────────────────────────────

/** Estimate cache bytes from IndexedDB upload records */
export async function getCacheStorageEstimate(): Promise<number> {
  try {
    const records = await getAllUploadRecords();
    const totalMB = records.reduce((acc, r) => acc + (r.fileSizeMB || 0), 0);
    const cacheBytes = records.reduce((acc, r) => {
      const remaining =
        (1 - r.progress / 100) * (r.fileSizeMB || 0) * 1024 * 1024;
      return acc + remaining;
    }, 0);
    let lsBytes = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || "";
        const val = localStorage.getItem(key) || "";
        lsBytes += (key.length + val.length) * 2;
      }
    } catch {
      /* ignore */
    }
    return cacheBytes + lsBytes + (totalMB > 0 ? 512 * 1024 : 0);
  } catch {
    return 0;
  }
}

/** Estimate thumbnail cache bytes */
export async function getThumbnailStorageEstimate(): Promise<number> {
  try {
    let historyCount = 0;
    try {
      const raw = localStorage.getItem("watchHistory");
      if (raw) {
        const arr = JSON.parse(raw);
        historyCount = Array.isArray(arr) ? arr.length : 0;
      }
    } catch {
      /* ignore */
    }
    return Math.max(50 * 1024, historyCount * 50 * 1024);
  } catch {
    return 50 * 1024;
  }
}

/** Estimate video storage used */
export async function getVideoStorageEstimate(): Promise<number> {
  try {
    const raw = localStorage.getItem("storageUsedBytes");
    const backendBytes = raw ? Number.parseInt(raw, 10) : 0;
    if (!Number.isNaN(backendBytes) && backendBytes > 0) return backendBytes;
    const records = await getAllUploadRecords();
    const completedMB = records
      .filter((r) => r.progress >= 100)
      .reduce((acc, r) => acc + (r.fileSizeMB || 0), 0);
    return completedMB * 1024 * 1024;
  } catch {
    return 0;
  }
}

export interface StorageBreakdown {
  videos: number;
  thumbnails: number;
  cache: number;
  total: number;
}

export async function getTotalStorageEstimate(): Promise<StorageBreakdown> {
  const [videos, thumbnails, cache] = await Promise.all([
    getVideoStorageEstimate(),
    getThumbnailStorageEstimate(),
    getCacheStorageEstimate(),
  ]);
  return { videos, thumbnails, cache, total: videos + thumbnails + cache };
}

// ─── Clear functions ───────────────────────────────────────────────────────

/** Clears completed IndexedDB upload entries and localStorage caches */
export async function clearCache(): Promise<void> {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) || "";
    if (
      key.startsWith("rqCache") ||
      key.startsWith("query-") ||
      key === "recentUploadFingerprints"
    ) {
      keysToRemove.push(key);
    }
  }
  for (const k of keysToRemove) {
    localStorage.removeItem(k);
  }
  await deleteUploadRecordsByFilter((r) => r.progress >= 100);
}

/** Clears failed upload records (progress < 100, old entries) */
export async function clearFailedUploads(): Promise<void> {
  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
  await deleteUploadRecordsByFilter(
    (r) => r.progress < 100 && r.savedAt < twentyFourHoursAgo,
  );
}

/** Clears temporary/in-progress entries older than 24h */
export async function clearTempFiles(): Promise<void> {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  await deleteUploadRecordsByFilter((r) => r.savedAt < oneDayAgo);
}

/** Combined cleanup: removes failed, old temp, and completed entries */
export async function clearUnusedFiles(): Promise<void> {
  await clearAllUploadRecords();
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) || "";
    if (
      key.startsWith("rqCache") ||
      key.startsWith("query-") ||
      key === "recentUploadFingerprints"
    ) {
      keysToRemove.push(key);
    }
  }
  for (const k of keysToRemove) {
    localStorage.removeItem(k);
  }
}

/** Auto cleanup: remove entries older than 24h with completed or failed status */
export async function autoCleanupOldEntries(): Promise<void> {
  try {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    await deleteUploadRecordsByFilter(
      (r) => r.savedAt < oneDayAgo || r.progress >= 100,
    );
  } catch {
    /* fire and forget */
  }
}

/** Returns true if estimated local cache > 200MB */
export function isStorageHigh(total: number): boolean {
  return total > 200 * 1024 * 1024;
}

// ─── Format helpers ────────────────────────────────────────────────────────

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function formatBytesAsMB(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatBytesAsGB(bytes: number): string {
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
