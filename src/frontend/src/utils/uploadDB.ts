// IndexedDB utility for durable upload state persistence.
// More reliable than localStorage for large-file upload state since it
// won't be evicted by storage pressure and handles larger payloads.

const DB_NAME = "subpremium-upload";
const STORE_NAME = "upload-state";
const DB_VERSION = 1;

export interface UploadRecord {
  fingerprint: string; // "name|size|lastModified" - primary key
  videoId: string;
  title: string;
  progress: number; // 0-100
  chunkIndex: number;
  totalChunks: number;
  fileSizeMB: number;
  savedAt: number; // Date.now()
}

function openDB(): Promise<IDBDatabase> {
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

export async function saveUploadRecord(record: UploadRecord): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  } catch {
    // Silently ignore — upload will still work without persistence
  }
}

export async function loadUploadRecord(
  fingerprint: string,
): Promise<UploadRecord | null> {
  try {
    const db = await openDB();
    return await new Promise<UploadRecord | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(fingerprint);
      req.onsuccess = () => {
        const record = req.result as UploadRecord | undefined;
        db.close();
        if (!record) return resolve(null);
        // Expire records older than 7 days
        const ageMs = Date.now() - record.savedAt;
        if (ageMs > 7 * 24 * 60 * 60 * 1000) {
          resolve(null);
        } else {
          resolve(record);
        }
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });
  } catch {
    return null;
  }
}

export async function loadLatestUploadRecord(): Promise<UploadRecord | null> {
  try {
    const db = await openDB();
    return await new Promise<UploadRecord | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        db.close();
        const records = req.result as UploadRecord[];
        if (!records || records.length === 0) return resolve(null);
        // Return the most recently saved record
        const latest = records.sort((a, b) => b.savedAt - a.savedAt)[0];
        const ageMs = Date.now() - latest.savedAt;
        if (ageMs > 7 * 24 * 60 * 60 * 1000) return resolve(null);
        resolve(latest);
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });
  } catch {
    return null;
  }
}

export async function clearUploadRecord(fingerprint: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(fingerprint);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  } catch {
    // Silently ignore
  }
}

export async function clearAllUploadRecords(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  } catch {
    // Silently ignore
  }
}

export function getFileFingerprint(file: File): string {
  return `${file.name}|${file.size}|${file.lastModified}`;
}
