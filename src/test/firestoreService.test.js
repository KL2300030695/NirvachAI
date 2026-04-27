import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn().mockResolvedValue(undefined),
  getDoc: vi.fn().mockResolvedValue({ exists: () => false }),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  serverTimestamp: vi.fn(() => 'SERVER_TIMESTAMP'),
}));

describe('Firestore Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save user profile to localStorage as fallback', async () => {
    const { saveUserProfile } = await import('../services/firestoreService');
    const uid = 'test_user_fs_1';
    const profile = { uid, displayName: 'Test User', progress: {} };

    await saveUserProfile(uid, profile);

    const stored = JSON.parse(localStorage.getItem(`nirvachai_user_${uid}`));
    expect(stored.displayName).toBe('Test User');
  });

  it('should load user profile from localStorage as fallback', async () => {
    const { loadUserProfile } = await import('../services/firestoreService');
    const uid = 'test_user_fs_2';
    const profile = { uid, displayName: 'Stored User' };
    localStorage.setItem(`nirvachai_user_${uid}`, JSON.stringify(profile));

    const loaded = await loadUserProfile(uid);
    expect(loaded.displayName).toBe('Stored User');
  });

  it('should return null for non-existent profiles', async () => {
    const { loadUserProfile } = await import('../services/firestoreService');
    const loaded = await loadUserProfile('nonexistent');
    expect(loaded).toBeNull();
  });

  it('should merge updates into localStorage profile', async () => {
    const { updateUserProfile } = await import('../services/firestoreService');
    const uid = 'test_user_fs_3';
    localStorage.setItem(`nirvachai_user_${uid}`, JSON.stringify({
      uid, displayName: 'Original', score: 0,
    }));

    await updateUserProfile(uid, { score: 10 });

    const stored = JSON.parse(localStorage.getItem(`nirvachai_user_${uid}`));
    expect(stored.score).toBe(10);
    expect(stored.displayName).toBe('Original');
  });

  it('saveToLeaderboard should not throw', async () => {
    const { saveToLeaderboard } = await import('../services/firestoreService');
    await expect(
      saveToLeaderboard('uid1', 'User', 'basics', 5, 5)
    ).resolves.not.toThrow();
  });
});
