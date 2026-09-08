/**
 * IndexedDB storage utility for large binary files (PDFs, high-res images, photos)
 * Prevents exceeding the 5MB browser LocalStorage quota and avoids ephemeral container 404s.
 */

const DB_NAME = 'nitvt_offline_store';
const STORE_NAME = 'downloadable_files';
const IMAGES_STORE_NAME = 'uploaded_images';
const DB_VERSION = 2;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(IMAGES_STORE_NAME)) {
        db.createObjectStore(IMAGES_STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.warn('IndexedDB open error:', request.error);
      reject(request.error);
    };
  });

  return dbPromise;
}

export async function saveFileToIndexedDb(id: string, fileUrl: string): Promise<void> {
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.put({ id, fileUrl, updatedAt: Date.now() });

      req.onsuccess = () => resolve();
      req.onerror = () => {
        console.warn('IndexedDB put error:', req.error);
        reject(req.error);
      };
    });
  } catch (err) {
    console.warn('Could not save file to IndexedDB:', err);
  }
}

export async function getFileFromIndexedDb(id: string): Promise<string | null> {
  try {
    const db = await getDb();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        if (req.result && req.result.fileUrl) {
          resolve(req.result.fileUrl);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => {
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

export async function getAllFilesFromIndexedDb(): Promise<Record<string, string>> {
  try {
    const db = await getDb();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const result: Record<string, string> = {};
        if (Array.isArray(req.result)) {
          req.result.forEach((item) => {
            if (item && item.id && item.fileUrl) {
              result[item.id] = item.fileUrl;
            }
          });
        }
        resolve(result);
      };

      req.onerror = () => {
        resolve({});
      };
    });
  } catch {
    return {};
  }
}

export async function deleteFileFromIndexedDb(id: string): Promise<void> {
  try {
    const db = await getDb();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => resolve(); // Non-blocking
    });
  } catch {
    // Non-blocking
  }
}

/**
 * Universal persistent image storage in IndexedDB (prevents auto-delete & quota loss)
 */
export async function saveImageToIndexedDb(id: string, dataUrl: string): Promise<void> {
  try {
    const db = await getDb();
    return new Promise((resolve) => {
      const transaction = db.transaction([IMAGES_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(IMAGES_STORE_NAME);
      const req = store.put({ id, dataUrl, savedAt: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('saveImageToIndexedDb error:', err);
  }
}

export async function getImageFromIndexedDb(id: string): Promise<string | null> {
  try {
    const db = await getDb();
    return new Promise((resolve) => {
      const transaction = db.transaction([IMAGES_STORE_NAME], 'readonly');
      const store = transaction.objectStore(IMAGES_STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result && req.result.dataUrl) {
          resolve(req.result.dataUrl);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

