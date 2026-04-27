import { describe, it, expect, vi } from 'vitest';
import {
  trackPageView, trackChatMessage, trackChatResponse, trackAIFallback,
  trackQuizStart, trackQuizComplete, trackQuizAnswer,
  trackTimelineStageViewed, trackTimelineComplete,
  trackTermViewed, trackSearch, trackTermBookmarked,
  trackFeatureUsage, trackLogin, trackSignUp, trackSignOut,
  trackChecklistProgress, trackChecklistComplete,
  trackAchievementUnlocked, trackAppPerformance, trackError,
  setUserProperties, setAnalyticsUserId,
} from '../services/analytics';

describe('Firebase Analytics Service', () => {
  describe('Page Tracking', () => {
    it('trackPageView should not throw', () => {
      expect(() => trackPageView('Home')).not.toThrow();
    });
  });

  describe('Chat / Gemini AI Tracking', () => {
    it('trackChatMessage should not throw', () => {
      expect(() => trackChatMessage('elections')).not.toThrow();
    });
    it('trackChatResponse should not throw', () => {
      expect(() => trackChatResponse(350)).not.toThrow();
    });
    it('trackAIFallback should not throw', () => {
      expect(() => trackAIFallback('quota_exceeded')).not.toThrow();
    });
  });

  describe('Quiz Tracking', () => {
    it('trackQuizStart should not throw', () => {
      expect(() => trackQuizStart('basics', 'beginner')).not.toThrow();
    });
    it('trackQuizComplete should not throw', () => {
      expect(() => trackQuizComplete('basics', 3, 5)).not.toThrow();
    });
    it('trackQuizAnswer should not throw', () => {
      expect(() => trackQuizAnswer(true)).not.toThrow();
      expect(() => trackQuizAnswer(false)).not.toThrow();
    });
  });

  describe('Timeline Tracking', () => {
    it('trackTimelineStageViewed should not throw', () => {
      expect(() => trackTimelineStageViewed('announcement', 0)).not.toThrow();
    });
    it('trackTimelineComplete should not throw', () => {
      expect(() => trackTimelineComplete()).not.toThrow();
    });
  });

  describe('Encyclopedia Tracking', () => {
    it('trackTermViewed should not throw', () => {
      expect(() => trackTermViewed('EVM')).not.toThrow();
    });
    it('trackSearch should not throw', () => {
      expect(() => trackSearch('electronic voting')).not.toThrow();
    });
    it('trackTermBookmarked should not throw', () => {
      expect(() => trackTermBookmarked('evm')).not.toThrow();
    });
  });

  describe('Auth Events', () => {
    it('trackLogin should not throw', () => {
      expect(() => trackLogin('google')).not.toThrow();
    });
    it('trackSignUp should not throw', () => {
      expect(() => trackSignUp('anonymous')).not.toThrow();
    });
    it('trackSignOut should not throw', () => {
      expect(() => trackSignOut()).not.toThrow();
    });
  });

  describe('Checklist Tracking', () => {
    it('trackChecklistProgress should not throw', () => {
      expect(() => trackChecklistProgress(5, 20)).not.toThrow();
    });
    it('trackChecklistComplete should not throw', () => {
      expect(() => trackChecklistComplete()).not.toThrow();
    });
  });

  describe('Achievement Tracking', () => {
    it('trackAchievementUnlocked should not throw', () => {
      expect(() => trackAchievementUnlocked('first-chat', 'First Conversation')).not.toThrow();
    });
  });

  describe('Performance & Error Tracking', () => {
    it('trackAppPerformance should not throw', () => {
      expect(() => trackAppPerformance()).not.toThrow();
    });
    it('trackError should not throw', () => {
      expect(() => trackError('test_error', 'Something went wrong')).not.toThrow();
    });
  });

  describe('User Properties', () => {
    it('setUserProperties should not throw', async () => {
      await expect(setUserProperties({ user_type: 'student' })).resolves.not.toThrow();
    });
    it('setAnalyticsUserId should not throw', async () => {
      await expect(setAnalyticsUserId('user_123')).resolves.not.toThrow();
    });
  });

  describe('All exports are functions', () => {
    it('should export all tracking functions', () => {
      const functions = [
        trackPageView, trackChatMessage, trackChatResponse, trackAIFallback,
        trackQuizStart, trackQuizComplete, trackQuizAnswer,
        trackTimelineStageViewed, trackTimelineComplete,
        trackTermViewed, trackSearch, trackTermBookmarked,
        trackFeatureUsage, trackLogin, trackSignUp, trackSignOut,
        trackChecklistProgress, trackChecklistComplete,
        trackAchievementUnlocked, trackAppPerformance, trackError,
        setUserProperties, setAnalyticsUserId,
      ];
      functions.forEach(fn => {
        expect(typeof fn).toBe('function');
      });
    });
  });
});
