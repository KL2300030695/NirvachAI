import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { trackLogin, trackSignUp } from '../services/analytics';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateLocalProfile = useCallback((newProfile) => {
    setUserProfile(newProfile);
    if (newProfile && newProfile.uid) {
      try {
        localStorage.setItem(`nirvachai_user_${newProfile.uid}`, JSON.stringify(newProfile));
      } catch (e) { /* storage full, ignore */ }
    }
  }, []);

  const loadOrCreateProfile = useCallback((userData) => {
    try {
      const stored = localStorage.getItem(`nirvachai_user_${userData.uid}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserProfile(parsed);
        return parsed;
      }
    } catch (e) { /* ignore parse errors */ }

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

  // Create a local guest user (no Firebase needed)
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
    localStorage.setItem('nirvachai_session', JSON.stringify({ user: guestUser }));
    loadOrCreateProfile(guestUser);
    trackLogin('local_guest');
    return guestUser;
  }, [loadOrCreateProfile]);

  useEffect(() => {
    let unsubscribe = null;

    // Restore local session
    try {
      const saved = localStorage.getItem('nirvachai_session');
      if (saved) {
        const session = JSON.parse(saved);
        if (session.user) {
          setUser(session.user);
          loadOrCreateProfile(session.user);
        }
      }
    } catch (e) { /* ignore */ }

    // Listen to Firebase auth state (if Firebase is configured)
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
          localStorage.setItem('nirvachai_session', JSON.stringify({ user: userData }));
          loadOrCreateProfile(userData);
        }
        setLoading(false);
      });
    } catch (e) {
      console.warn('Firebase auth listener failed:', e);
      setLoading(false);
    }

    // If no saved session and no firebase user after timeout, stop loading
    const timeout = setTimeout(() => setLoading(false), 2000);

    return () => {
      if (unsubscribe) unsubscribe();
      clearTimeout(timeout);
    };
  }, [loadOrCreateProfile]);

  // Google Sign-In
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      trackLogin('google');
      return result.user;
    } catch (error) {
      console.warn('Google sign-in failed, using local guest:', error.code);
      // Fallback to local guest
      return createLocalGuest();
    }
  };

  // Guest Sign-In (tries Firebase anonymous, falls back to local)
  const signInAsGuest = async () => {
    try {
      const result = await signInAnonymously(auth);
      trackLogin('anonymous');
      return result.user;
    } catch (error) {
      console.warn('Firebase anonymous auth unavailable, using local guest:', error.code);
      // Local-only guest mode
      return createLocalGuest();
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) { /* ignore if firebase not configured */ }
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('nirvachai_session');
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
