import { db, isFirebaseConfigured } from '../config/firebase';

/**
 * Firebase Firestore Service
 * 
 * Provides CRUD operations for user data in Cloud Firestore.
 * Falls back to localStorage when Firestore is unavailable.
 * 
 * Collections:
 * - users/{uid} — User profiles and progress
 * - leaderboard/{uid} — Public quiz scores
 * 
 * @module firestoreService
 */

let firestoreAvailable = false;
let docFn, setDocFn, getDocFn, updateDocFn, serverTimestampFn;

/**
 * Lazily load Firestore functions
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
    firestoreAvailable = true;
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Save user profile to Firestore
 * @param {string} uid - User ID
 * @param {Object} profileData - User profile data
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
    localStorage.setItem(`nirvachai_user_${uid}`, JSON.stringify(profileData));
  } catch (e) { /* storage full */ }
  return false;
};

/**
 * Load user profile from Firestore
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
    const stored = localStorage.getItem(`nirvachai_user_${uid}`);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

/**
 * Update specific fields in user profile
 * @param {string} uid - User ID
 * @param {Object} updates - Fields to update
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
    const stored = localStorage.getItem(`nirvachai_user_${uid}`);
    const current = stored ? JSON.parse(stored) : {};
    const merged = { ...current, ...updates };
    localStorage.setItem(`nirvachai_user_${uid}`, JSON.stringify(merged));
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
