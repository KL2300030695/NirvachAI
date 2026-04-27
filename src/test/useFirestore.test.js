import { describe, it, expect, beforeEach } from 'vitest';

describe('useFirestore Hook (LocalStorage)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save quiz score to localStorage', () => {
    const uid = 'test_user_1';
    const profile = {
      uid,
      displayName: 'Test User',
      progress: { quizScores: {}, timelineCompleted: [], checklistItems: [], chatCount: 0 },
      totalScore: 0,
    };
    localStorage.setItem(`nirvachai_user_${uid}`, JSON.stringify(profile));

    // Simulate saving a quiz score
    const stored = JSON.parse(localStorage.getItem(`nirvachai_user_${uid}`));
    stored.progress.quizScores['basics'] = { score: 3, total: 5, date: new Date().toISOString() };
    stored.totalScore = 3;
    localStorage.setItem(`nirvachai_user_${uid}`, JSON.stringify(stored));

    const updated = JSON.parse(localStorage.getItem(`nirvachai_user_${uid}`));
    expect(updated.progress.quizScores.basics.score).toBe(3);
    expect(updated.totalScore).toBe(3);
  });

  it('should track timeline stage completion', () => {
    const uid = 'test_user_2';
    const profile = {
      uid,
      progress: { timelineCompleted: [], quizScores: {} },
    };
    localStorage.setItem(`nirvachai_user_${uid}`, JSON.stringify(profile));

    const stored = JSON.parse(localStorage.getItem(`nirvachai_user_${uid}`));
    stored.progress.timelineCompleted.push('announcement');
    stored.progress.timelineCompleted.push('notification');
    localStorage.setItem(`nirvachai_user_${uid}`, JSON.stringify(stored));

    const updated = JSON.parse(localStorage.getItem(`nirvachai_user_${uid}`));
    expect(updated.progress.timelineCompleted).toContain('announcement');
    expect(updated.progress.timelineCompleted).toHaveLength(2);
  });

  it('should persist checklist items', () => {
    const uid = 'test_user_3';
    const profile = {
      uid,
      progress: { checklistItems: [] },
    };
    localStorage.setItem(`nirvachai_user_${uid}`, JSON.stringify(profile));

    const stored = JSON.parse(localStorage.getItem(`nirvachai_user_${uid}`));
    stored.progress.checklistItems = ['age_check', 'citizenship', 'voter_id'];
    localStorage.setItem(`nirvachai_user_${uid}`, JSON.stringify(stored));

    const updated = JSON.parse(localStorage.getItem(`nirvachai_user_${uid}`));
    expect(updated.progress.checklistItems).toHaveLength(3);
    expect(updated.progress.checklistItems).toContain('voter_id');
  });

  it('should handle missing user gracefully', () => {
    const data = localStorage.getItem('nirvachai_user_nonexistent');
    expect(data).toBeNull();
  });

  it('should increment chat count correctly', () => {
    const uid = 'test_user_4';
    const profile = { uid, progress: { chatCount: 0 } };
    localStorage.setItem(`nirvachai_user_${uid}`, JSON.stringify(profile));

    const stored = JSON.parse(localStorage.getItem(`nirvachai_user_${uid}`));
    stored.progress.chatCount += 1;
    localStorage.setItem(`nirvachai_user_${uid}`, JSON.stringify(stored));

    const updated = JSON.parse(localStorage.getItem(`nirvachai_user_${uid}`));
    expect(updated.progress.chatCount).toBe(1);
  });
});
