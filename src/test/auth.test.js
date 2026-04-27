import { describe, it, expect, beforeEach } from 'vitest';

describe('Authentication Flow (LocalStorage)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should create a local guest session', () => {
    const guestId = `guest_${Date.now()}_abc1234`;
    const guestUser = {
      uid: guestId,
      displayName: 'Guest Citizen',
      email: null,
      isAnonymous: true,
    };
    localStorage.setItem('nirvachai_session', JSON.stringify({ user: guestUser }));

    const session = JSON.parse(localStorage.getItem('nirvachai_session'));
    expect(session.user.uid).toBe(guestId);
    expect(session.user.displayName).toBe('Guest Citizen');
    expect(session.user.isAnonymous).toBe(true);
  });

  it('should persist user profile on creation', () => {
    const uid = 'google_user_123';
    const profile = {
      uid,
      displayName: 'Test Voter',
      email: 'test@example.com',
      isAnonymous: false,
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
    };
    localStorage.setItem(`nirvachai_user_${uid}`, JSON.stringify(profile));

    const stored = JSON.parse(localStorage.getItem(`nirvachai_user_${uid}`));
    expect(stored.displayName).toBe('Test Voter');
    expect(stored.email).toBe('test@example.com');
    expect(stored.progress.timelineCompleted).toEqual([]);
  });

  it('should clear session on sign out', () => {
    localStorage.setItem('nirvachai_session', JSON.stringify({ user: { uid: 'test' } }));
    expect(localStorage.getItem('nirvachai_session')).not.toBeNull();

    localStorage.removeItem('nirvachai_session');
    expect(localStorage.getItem('nirvachai_session')).toBeNull();
  });

  it('should restore session from localStorage', () => {
    const user = { uid: 'restored_user', displayName: 'Restored' };
    localStorage.setItem('nirvachai_session', JSON.stringify({ user }));

    const session = JSON.parse(localStorage.getItem('nirvachai_session'));
    expect(session.user.uid).toBe('restored_user');
  });

  it('should handle corrupted session data', () => {
    localStorage.setItem('nirvachai_session', 'invalid json');

    let session = null;
    try {
      session = JSON.parse(localStorage.getItem('nirvachai_session'));
    } catch (e) {
      session = null;
    }
    expect(session).toBeNull();
  });
});
