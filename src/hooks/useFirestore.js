import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for operations on user data (Using LocalStorage fallback instead of Firestore)
 */
export const useFirestore = () => {
  const { user, userProfile, updateLocalProfile } = useAuth();

  // Helper to safely update profile
  const updateProfile = (updates) => {
    if (!userProfile) return;
    const newProfile = { ...userProfile, ...updates };
    
    // Handle nested progress updates properly
    if (updates.progress) {
      newProfile.progress = { ...userProfile.progress, ...updates.progress };
    }
    
    updateLocalProfile(newProfile);
  };

  // Save quiz score
  const saveQuizScore = async (category, score, total) => {
    if (!userProfile) return;
    
    const currentScores = userProfile.progress?.quizScores || {};
    const newTotalScore = (userProfile.totalScore || 0) + score;

    updateProfile({
      progress: {
        ...userProfile.progress,
        quizScores: {
          ...currentScores,
          [category]: { score, total, date: new Date().toISOString() }
        }
      },
      totalScore: newTotalScore
    });
  };

  // Mark timeline stage as completed
  const completeTimelineStage = async (stageId) => {
    if (!userProfile) return;
    
    const completed = userProfile.progress?.timelineCompleted || [];
    if (!completed.includes(stageId)) {
      updateProfile({
        progress: {
          ...userProfile.progress,
          timelineCompleted: [...completed, stageId]
        }
      });
    }
  };

  // Toggle bookmark on glossary term
  const toggleBookmark = async (termId) => {
    if (!userProfile) return;
    
    const bookmarks = userProfile.progress?.bookmarkedTerms || [];
    const newBookmarks = bookmarks.includes(termId) 
      ? bookmarks.filter(id => id !== termId)
      : [...bookmarks, termId];

    updateProfile({
      progress: {
        ...userProfile.progress,
        bookmarkedTerms: newBookmarks
      }
    });
  };

  // Update checklist progress
  const updateChecklist = async (checklistItems) => {
    if (!userProfile) return;
    
    updateProfile({
      progress: {
        ...userProfile.progress,
        checklistItems
      }
    });
  };

  // Increment chat count
  const incrementChatCount = async () => {
    if (!userProfile) return;
    
    updateProfile({
      progress: {
        ...userProfile.progress,
        chatCount: (userProfile.progress?.chatCount || 0) + 1
      }
    });
  };

  // Add achievement
  const addAchievement = async (achievementId) => {
    if (!userProfile) return;
    
    const achievements = userProfile.achievements || [];
    if (!achievements.includes(achievementId)) {
      updateProfile({
        achievements: [...achievements, achievementId]
      });
    }
  };

  return {
    saveQuizScore,
    completeTimelineStage,
    toggleBookmark,
    updateChecklist,
    incrementChatCount,
    addAchievement,
  };
};
