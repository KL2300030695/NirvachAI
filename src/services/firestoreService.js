import { db, isFirebaseConfigured } from '../config/firebase';
import { STORAGE_KEYS } from '../config/constants';

/**
 * Firebase Firestore Service
 * 
 * Provides CRUD operations for user data in Cloud Firestore.
 * Falls back to localStorage when Firestore is unavailable.
 * Includes real-time sync capability for leaderboard data.
 * 
 * Collections:
 * - users/{uid} — User profiles and progress
 * - leaderboard/{uid} — Public quiz scores
 * 
 * @module firestoreService
 */

let firestoreAvailable = false;
let docFn, setDocFn, getDocFn, updateDocFn, serverTimestampFn, onSnapshotFn, collectionFn, queryFn, orderByFn, limitFn;

/**
 * Lazily load Firestore functions to reduce initial bundle size
 * @returns {Promise<boolean>} Whether Firestore functions loaded successfully
 */
const loadFirestoreFunctions = async () => {
  if (firestoreAvailable || !isFirebaseConfigured || !db) return false;
  try {
    const firestore = await import('firebase/firestore');
    docFn = firestore.doc;
    setDocFn = firestore.setDoc;
    getDocFn = firestore.getDoc;
    updateDocFn = firestore.updateDoc;
    serverTimestampFn = firestore.serverTimestamp;
    onSnapshotFn = firestore.onSnapshot;
    collectionFn = firestore.collection;
    queryFn = firestore.query;
    orderByFn = firestore.orderBy;
    limitFn = firestore.limit;
    firestoreAvailable = true;
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Save user profile to Firestore with localStorage fallback
 * @param {string} uid - User ID
 * @param {Object} profileData - User profile data
 * @returns {Promise<boolean>} Whether save succeeded on Firestore
 */
export const saveUserProfile = async (uid, profileData) => {
  await loadFirestoreFunctions();
  if (firestoreAvailable && db) {
    try {
      const userRef = docFn(db, 'users', uid);
      await setDocFn(userRef, {
        ...profileData,
        updatedAt: serverTimestampFn(),
      }, { merge: true });
      return true;
    } catch (e) {
      console.warn('Firestore save failed, using localStorage:', e.code);
    }
  }
  // Fallback to localStorage
  try {
    localStorage.setItem(`${STORAGE_KEYS.USER_PREFIX}${uid}`, JSON.stringify(profileData));
  } catch (e) { /* storage full */ }
  return false;
};

/**
 * Load user profile from Firestore with localStorage fallback
 * @param {string} uid - User ID
 * @returns {Promise<Object|null>} User profile or null
 */
export const loadUserProfile = async (uid) => {
  await loadFirestoreFunctions();
  if (firestoreAvailable && db) {
    try {
      const userRef = docFn(db, 'users', uid);
      const docSnap = await getDocFn(userRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (e) {
      console.warn('Firestore load failed, using localStorage:', e.code);
    }
  }
  // Fallback to localStorage
  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.USER_PREFIX}${uid}`);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

/**
 * Update specific fields in user profile
 * @param {string} uid - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<boolean>} Whether update succeeded on Firestore
 */
export const updateUserProfile = async (uid, updates) => {
  await loadFirestoreFunctions();
  if (firestoreAvailable && db) {
    try {
      const userRef = docFn(db, 'users', uid);
      await updateDocFn(userRef, {
        ...updates,
        updatedAt: serverTimestampFn(),
      });
      return true;
    } catch (e) {
      // Document might not exist, try setDoc with merge
      try {
        const userRef = docFn(db, 'users', uid);
        await setDocFn(userRef, { ...updates, updatedAt: serverTimestampFn() }, { merge: true });
        return true;
      } catch (e2) {
        console.warn('Firestore update failed:', e2.code);
      }
    }
  }
  // Fallback: merge into localStorage
  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.USER_PREFIX}${uid}`);
    const current = stored ? JSON.parse(stored) : {};
    const merged = { ...current, ...updates };
    localStorage.setItem(`${STORAGE_KEYS.USER_PREFIX}${uid}`, JSON.stringify(merged));
  } catch (e) { /* ignore */ }
  return false;
};

/**
 * Save quiz score to leaderboard collection
 * @param {string} uid - User ID
 * @param {string} displayName - User display name
 * @param {string} category - Quiz category
 * @param {number} score - Score achieved
 * @param {number} total - Total questions
 * @returns {Promise<boolean>} Whether save succeeded
 */
export const saveToLeaderboard = async (uid, displayName, category, score, total) => {
  await loadFirestoreFunctions();
  if (firestoreAvailable && db) {
    try {
      const leaderboardRef = docFn(db, 'leaderboard', `${uid}_${category}`);
      await setDocFn(leaderboardRef, {
        uid,
        displayName,
        category,
        score,
        total,
        percentage: Math.round((score / total) * 100),
        timestamp: serverTimestampFn(),
      }, { merge: true });
      return true;
    } catch (e) {
      console.warn('Leaderboard save failed:', e.code);
    }
  }
  return false;
};

/**
 * Subscribe to real-time leaderboard updates using Firestore onSnapshot.
 * Demonstrates real-time sync capability with Cloud Firestore.
 *
 * @param {string} category - Quiz category to filter
 * @param {number} maxResults - Maximum number of results
 * @param {Function} callback - Called with array of leaderboard entries
 * @returns {Function|null} Unsubscribe function, or null if unavailable
 */
export const subscribeToLeaderboard = async (category, maxResults = 10, callback) => {
  await loadFirestoreFunctions();
  if (!firestoreAvailable || !db || !onSnapshotFn) return null;

  try {
    const leaderboardCol = collectionFn(db, 'leaderboard');
    const q = queryFn(
      leaderboardCol,
      orderByFn('percentage', 'desc'),
      limitFn(maxResults)
    );

    const unsubscribe = onSnapshotFn(q, (snapshot) => {
      const entries = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (!category || data.category === category) {
          entries.push({ id: doc.id, ...data });
        }
      });
      callback(entries);
    }, (error) => {
      console.warn('Leaderboard subscription error:', error.code);
      callback([]);
    });

    return unsubscribe;
  } catch (e) {
    console.warn('Leaderboard subscription failed:', e.message);
    return null;
  }
};
