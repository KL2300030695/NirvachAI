import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for user data persistence operations.
 * Manages quiz scores, timeline progress, bookmarks, checklist items,
 * chat count, and achievements through the AuthContext profile system.
 *
 * @returns {Object} Data mutation functions
 */
export const useFirestore = () => {
  const { userProfile, updateLocalProfile } = useAuth();

  /**
   * Safely update the user profile, handling nested progress merging
   * @param {Object} updates - Fields to update
   */
  const updateProfile = useCallback((updates) => {
    if (!userProfile) return;
    const newProfile = { ...userProfile, ...updates };

    // Handle nested progress updates properly
    if (updates.progress) {
      newProfile.progress = { ...userProfile.progress, ...updates.progress };
    }

    updateLocalProfile(newProfile);
  }, [userProfile, updateLocalProfile]);

  /**
   * Save a quiz score for the given category
   * @param {string} category - Quiz category ID
   * @param {number} score - Points scored
   * @param {number} total - Total possible points
   */
  const saveQuizScore = useCallback(async (category, score, total) => {
    if (!userProfile) return;

    const currentScores = userProfile.progress?.quizScores || {};
    const newTotalScore = (userProfile.totalScore || 0) + score;

    updateProfile({
      progress: {
        ...userProfile.progress,
        quizScores: {
          ...currentScores,
          [category]: { score, total, date: new Date().toISOString() },
        },
      },
      totalScore: newTotalScore,
    });
  }, [userProfile, updateProfile]);

  /**
   * Mark a timeline stage as completed
   * @param {string} stageId - Election stage ID
   */
  const completeTimelineStage = useCallback(async (stageId) => {
    if (!userProfile) return;

    const completed = userProfile.progress?.timelineCompleted || [];
    if (!completed.includes(stageId)) {
      updateProfile({
        progress: {
          ...userProfile.progress,
          timelineCompleted: [...completed, stageId],
        },
      });
    }
  }, [userProfile, updateProfile]);

  /**
   * Toggle bookmark on a glossary term
   * @param {string} termId - Glossary term ID
   */
  const toggleBookmark = useCallback(async (termId) => {
    if (!userProfile) return;

    const bookmarks = userProfile.progress?.bookmarkedTerms || [];
    const newBookmarks = bookmarks.includes(termId)
      ? bookmarks.filter(id => id !== termId)
      : [...bookmarks, termId];

    updateProfile({
      progress: {
        ...userProfile.progress,
        bookmarkedTerms: newBookmarks,
      },
    });
  }, [userProfile, updateProfile]);

  /**
   * Update checklist progress with completed items
   * @param {Array<string>} checklistItems - Array of completed item IDs
   */
  const updateChecklist = useCallback(async (checklistItems) => {
    if (!userProfile) return;

    updateProfile({
      progress: {
        ...userProfile.progress,
        checklistItems,
      },
    });
  }, [userProfile, updateProfile]);

  /**
   * Increment the chat message count by 1
   */
  const incrementChatCount = useCallback(async () => {
    if (!userProfile) return;

    updateProfile({
      progress: {
        ...userProfile.progress,
        chatCount: (userProfile.progress?.chatCount || 0) + 1,
      },
    });
  }, [userProfile, updateProfile]);

  /**
   * Add a new achievement if not already unlocked
   * @param {string} achievementId - Achievement identifier
   */
  const addAchievement = useCallback(async (achievementId) => {
    if (!userProfile) return;

    const achievements = userProfile.achievements || [];
    if (!achievements.includes(achievementId)) {
      updateProfile({
        achievements: [...achievements, achievementId],
      });
    }
  }, [userProfile, updateProfile]);

  return {
    saveQuizScore,
    completeTimelineStage,
    toggleBookmark,
    updateChecklist,
    incrementChatCount,
    addAchievement,
  };
};
