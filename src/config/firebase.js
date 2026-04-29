import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getPerformance } from 'firebase/performance';

/**
 * Firebase Configuration Module
 * 
 * Initializes all Firebase services used in NirvachAI:
 * - Firebase Authentication (Google Sign-In + Anonymous)
 * - Cloud Firestore (user progress persistence)
 * - Firebase Analytics (engagement tracking)
 * - Firebase Performance Monitoring (Core Web Vitals + custom traces)
 * - Firebase Remote Config (dynamic feature flags)
 * 
 * All services are initialized conditionally — the app works
 * fully offline or without valid Firebase credentials.
 * 
 * @module firebase
 */

/** @type {import('firebase/app').FirebaseOptions} */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

/** Check if Firebase has valid configuration */
const isFirebaseConfigured = !!firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10;

// ─── Initialize Firebase Services ───────────────────────────
let app = null;
let auth = null;
let db = null;
let googleProvider = null;
let perf = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    
    // Firebase Authentication
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    
    // Cloud Firestore
    try {
      db = getFirestore(app);
    } catch (e) {
      console.warn('Firestore not available:', e.message);
    }
    
    // Firebase Performance Monitoring
    try {
      if (typeof window !== 'undefined') {
        perf = getPerformance(app);
      }
    } catch (e) {
      // Performance monitoring not supported in this environment
    }
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
  }
}

// ─── Firebase Analytics (lazy initialization) ───────────────
let analyticsInstance = null;

/**
 * Get or initialize Firebase Analytics instance
 * @returns {Promise<import('firebase/analytics').Analytics|null>}
 */
const getAnalyticsInstance = async () => {
  if (!app) return null;
  if (analyticsInstance) return analyticsInstance;
  try {
    const supported = await isSupported();
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  } catch (e) {
    // Analytics not supported in this environment
  }
  return analyticsInstance;
};

export { app, auth, db, googleProvider, perf, getAnalyticsInstance, isFirebaseConfigured };
export default app;
