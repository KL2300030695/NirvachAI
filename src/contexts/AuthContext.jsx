import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { trackLogin, trackSignUp } from '../services/analytics';
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase';
import { STORAGE_KEYS, PERFORMANCE } from '../config/constants';

const AuthContext = createContext(null);

// Dynamically import Firebase Auth functions only if Firebase is configured
let signInWithPopup, signInAnonymously, firebaseSignOut, onAuthStateChanged;
if (isFirebaseConfigured && auth) {
  const firebaseAuth = await import('firebase/auth');
  signInWithPopup = firebaseAuth.signInWithPopup;
  signInAnonymously = firebaseAuth.signInAnonymously;
  firebaseSignOut = firebaseAuth.signOut;
  onAuthStateChanged = firebaseAuth.onAuthStateChanged;
}

/**
 * AuthProvider — Manages authentication state across the application.
 * Supports Firebase Google Sign-In, Firebase Anonymous Auth, and local guest mode.
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateLocalProfile = useCallback((newProfile) => {
    setUserProfile(newProfile);
    if (newProfile && newProfile.uid) {
      try {
        localStorage.setItem(`${STORAGE_KEYS.USER_PREFIX}${newProfile.uid}`, JSON.stringify(newProfile));
      } catch (e) { /* storage full */ }
    }
  }, []);

  const loadOrCreateProfile = useCallback((userData) => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEYS.USER_PREFIX}${userData.uid}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserProfile(parsed);
        return parsed;
      }
    } catch (e) { /* ignore */ }

    const newProfile = {
      uid: userData.uid,
      displayName: userData.displayName || 'Citizen',
      email: userData.email || null,
      photoURL: userData.photoURL || null,
      isAnonymous: userData.isAnonymous || false,
      createdAt: new Date().toISOString(),
      progress: {
        timelineCompleted: [],
        quizScores: {},
        bookmarkedTerms: [],
        checklistItems: [],
        chatCount: 0,
      },
      achievements: [],
      totalScore: 0,
      streak: 0,
    };
    updateLocalProfile(newProfile);
    trackSignUp(userData.isAnonymous ? 'anonymous' : 'google');
    return newProfile;
  }, [updateLocalProfile]);

  const createLocalGuest = useCallback(() => {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const guestUser = {
      uid: guestId,
      displayName: 'Guest Citizen',
      email: null,
      photoURL: null,
      isAnonymous: true,
    };
    setUser(guestUser);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ user: guestUser }));
    loadOrCreateProfile(guestUser);
    trackLogin('local_guest');
    return guestUser;
  }, [loadOrCreateProfile]);

  useEffect(() => {
    let unsubscribe = null;

    // Restore local session
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (saved) {
        const session = JSON.parse(saved);
        if (session.user) {
          setUser(session.user);
          loadOrCreateProfile(session.user);
        }
      }
    } catch (e) { /* ignore */ }

    // Listen to Firebase auth if available
    if (isFirebaseConfigured && auth && onAuthStateChanged) {
      try {
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            const userData = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Citizen',
              email: firebaseUser.email || null,
              photoURL: firebaseUser.photoURL || null,
              isAnonymous: firebaseUser.isAnonymous,
            };
            setUser(userData);
            localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ user: userData }));
            loadOrCreateProfile(userData);
          }
          setLoading(false);
        });
      } catch (e) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    const timeout = setTimeout(() => setLoading(false), PERFORMANCE.AUTH_TIMEOUT);
    return () => {
      if (unsubscribe) unsubscribe();
      clearTimeout(timeout);
    };
  }, [loadOrCreateProfile]);

  const signInWithGoogle = async () => {
    if (isFirebaseConfigured && auth && signInWithPopup && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        trackLogin('google');
        return result.user;
      } catch (error) {
        console.warn('Google sign-in failed:', error.code);
      }
    }
    return createLocalGuest();
  };

  const signInAsGuest = async () => {
    if (isFirebaseConfigured && auth && signInAnonymously) {
      try {
        const result = await signInAnonymously(auth);
        trackLogin('anonymous');
        return result.user;
      } catch (error) {
        console.warn('Anonymous auth failed:', error.code);
      }
    }
    return createLocalGuest();
  };

  const signOut = async () => {
    if (isFirebaseConfigured && auth && firebaseSignOut) {
      try { await firebaseSignOut(auth); } catch (e) { /* ignore */ }
    }
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  };

  const value = {
    user,
    userProfile,
    updateLocalProfile,
    loading,
    signInWithGoogle,
    signInAsGuest,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context.
 * Must be used within an AuthProvider.
 * @returns {{ user: Object|null, userProfile: Object|null, updateLocalProfile: Function, loading: boolean, signInWithGoogle: Function, signInAsGuest: Function, signOut: Function, isAuthenticated: boolean }}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
