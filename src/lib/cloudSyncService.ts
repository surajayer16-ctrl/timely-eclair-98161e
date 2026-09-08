import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  onSnapshot,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from './firebase';
import { safeLocalStorageSet } from './imageCompressor';

const COLLECTION_NAME = 'app_content';

// Mapping of storage keys to their respective dispatch event names
export const SYNC_KEY_EVENTS: Record<string, string> = {
  nitvt_courses: 'nitvt_courses_updated',
  nitvt_tools: 'nitvt_tools_updated',
  nitvt_notes: 'nitvt_notes_updated',
  nitvt_symbols: 'nitvt_symbols_updated',
  nitvt_ntc_numbers: 'nitvt_ntc_numbers_updated',
  nitvt_level1_notes: 'nitvt_level1_notes_updated',
  nitvt_level1_course_info: 'nitvt_level1_course_info_updated',
  nitvt_level1_practicals: 'nitvt_level1_practicals_updated',
  nitvt_level1_viva: 'nitvt_level1_viva_updated',
  nitvt_level1_knots: 'nitvt_level1_knots_updated',
  nitvt_level2_notes: 'nitvt_level2_notes_updated',
  nitvt_level2_course_info: 'nitvt_level2_course_info_updated',
  nitvt_level2_pole_specs: 'nitvt_level2_pole_specs_updated',
  nitvt_level2_exam_paper: 'nitvt_level2_exam_paper_updated',
  nitvt_level2_viva_bank: 'nitvt_level2_viva_bank_updated',
  nitvt_exams: 'nitvt_exams_updated',
  nitvt_exams_2083: 'nitvt_exams_2083_updated',
  nitvt_matching_exams: 'nitvt_matching_updated',
  nitvt_matching_2083: 'nitvt_matching_updated',
  nitvt_subjective_exams: 'nitvt_subjective_updated',
  nitvt_subjective_2083: 'nitvt_subjective_updated',
  nitvt_viva_exams: 'nitvt_viva_updated',
  nitvt_viva_2083: 'nitvt_viva_updated',
  nitvt_handbook_qa: 'nitvt_handbook_updated',
  nitvt_abbreviations: 'nitvt_abbrev_updated',
  nitvt_practical_sheets: 'nitvt_practical_updated',
  nitvt_survey_maps: 'nitvt_maps_updated',
  nitvt_level1_field_survey_map: 'nitvt_level1_field_survey_map_updated',
  nitvt_institute_info: 'nitvt_courses_updated',
  nitvt_instructor_profile: 'nitvt_instructor_updated',
  nitvt_gallery: 'nitvt_gallery_updated',
  nitvt_blog_posts: 'nitvt_blog_posts_updated',
  nitvt_electrician_lessons: 'nitvt_electrician_updated',
  nitvt_electrician_symbols: 'nitvt_electrician_updated',
  nitvt_electrician_practicals: 'nitvt_electrician_updated',
  nitvt_electrician_wire_table: 'nitvt_electrician_updated',
  nitvt_downloadable_notes: 'nitvt_downloadable_notes_updated',
};

let syncListenerUnsub: Unsubscribe | null = null;
let isInitialSyncDone = false;
let isSyncing = false;

/**
 * Dispatches UI update events when a storage key changes
 */
export function dispatchStorageEvent(key: string, data?: any) {
  const eventName = SYNC_KEY_EVENTS[key];
  if (eventName) {
    window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
  }
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('nitvt_cloud_synced', { detail: { key, data } }));
}

/**
 * Saves a document to both LocalStorage and Firebase Firestore Cloud Database
 * Guarantees that edits made on ANY device or computer are immediately visible to all other devices.
 */
export async function saveToCloud(key: string, value: any): Promise<boolean> {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
  
  // 1. Save locally first for instant UI response
  safeLocalStorageSet(key, stringValue);
  dispatchStorageEvent(key, value);

  // 2. Push to Firestore Cloud Database
  try {
    const docRef = doc(db, COLLECTION_NAME, key);
    await setDoc(docRef, {
      key,
      data: stringValue,
      updatedAt: Date.now(),
      clientInfo: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 80) : 'web'
    }, { merge: true });
    
    console.log(`[CloudSync] Successfully synced "${key}" to Firestore.`);
    return true;
  } catch (err: any) {
    console.warn(`[CloudSync] Firestore save failed for "${key}" (saved locally):`, err);
    return false;
  }
}

/**
 * Fetches all cloud-synced documents from Firestore and hydrates LocalStorage
 */
export async function syncAllFromCloud(): Promise<{ success: boolean; count: number }> {
  if (isSyncing) return { success: true, count: 0 };
  isSyncing = true;

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    let count = 0;

    snapshot.forEach((docSnap) => {
      const docData = docSnap.data();
      const key = docSnap.id || docData?.key;
      const payload = docData?.data;

      if (key && payload && typeof payload === 'string') {
        const localVal = localStorage.getItem(key);
        // Only update and trigger if different
        if (localVal !== payload) {
          safeLocalStorageSet(key, payload);
          count++;
          dispatchStorageEvent(key);
        }
      }
    });

    isInitialSyncDone = true;
    console.log(`[CloudSync] Initial fetch completed: ${count} items updated from Cloud.`);
    return { success: true, count };
  } catch (err) {
    console.warn('[CloudSync] Error fetching documents from Firestore:', err);
    return { success: false, count: 0 };
  } finally {
    isSyncing = false;
  }
}

/**
 * Pushes ALL current LocalStorage configurations to Cloud Firestore
 * Useful for initial sync or when admin triggers "Save All to Cloud"
 */
export async function pushAllLocalToCloud(): Promise<{ success: boolean; pushedCount: number }> {
  let pushedCount = 0;
  const keysToSync = Object.keys(SYNC_KEY_EVENTS);

  for (const key of keysToSync) {
    try {
      const localVal = localStorage.getItem(key);
      if (localVal && localVal.trim()) {
        const docRef = doc(db, COLLECTION_NAME, key);
        await setDoc(docRef, {
          key,
          data: localVal,
          updatedAt: Date.now()
        }, { merge: true });
        pushedCount++;
      }
    } catch (err) {
      console.warn(`[CloudSync] Failed pushing "${key}" to Firestore:`, err);
    }
  }

  console.log(`[CloudSync] Pushed ${pushedCount} documents to Firestore Cloud.`);
  return { success: true, pushedCount };
}

/**
 * Real-time listener: Listens for changes in Firestore and updates other devices in real-time
 */
export function subscribeToCloudUpdates(): () => void {
  if (typeof window === 'undefined') return () => {};
  if (syncListenerUnsub) {
    syncListenerUnsub();
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    syncListenerUnsub = onSnapshot(colRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const docData = change.doc.data();
          const key = change.doc.id || docData?.key;
          const payload = docData?.data;

          if (key && payload && typeof payload === 'string') {
            const currentLocal = localStorage.getItem(key);
            if (currentLocal !== payload) {
              safeLocalStorageSet(key, payload);
              dispatchStorageEvent(key);
            }
          }
        }
      });
    }, (error) => {
      console.warn('[CloudSync] Real-time listener note:', error);
    });

    return () => {
      if (syncListenerUnsub) {
        syncListenerUnsub();
        syncListenerUnsub = null;
      }
    };
  } catch (err) {
    console.warn('[CloudSync] Could not initialize real-time listener:', err);
    return () => {};
  }
}

/**
 * Initialize cloud sync on app start
 */
export function initCloudSync(): void {
  if (typeof window === 'undefined') return;

  // 1. Initial fetch from Firestore
  syncAllFromCloud().then(() => {
    // 2. Start real-time subscription
    subscribeToCloudUpdates();
  }).catch((err) => {
    console.warn('[CloudSync] Init error:', err);
  });

  // 3. Listen to tab focus or visibility changes to re-sync fresh data
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      syncAllFromCloud();
    }
  });
}
