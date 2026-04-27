import { getAnalyticsInstance, isFirebaseConfigured } from '../config/firebase';

/**
 * Firebase Analytics Service
 * Provides comprehensive event tracking for user engagement across all app features.
 * Implements custom event taxonomy aligned with Google Analytics 4 best practices.
 * @module analytics
 */

/**
 * Safely log a Firebase Analytics event with error handling
 * @param {string} eventName - GA4 event name (snake_case)
 * @param {Object} params - Event parameters
 * @returns {Promise<void>}
 */
const safeLogEvent = async (eventName, params = {}) => {
  if (!isFirebaseConfigured) return;
  try {
    const { logEvent } = await import('firebase/analytics');
    const analytics = await getAnalyticsInstance();
    if (analytics) {
      logEvent(analytics, eventName, {
        ...params,
        app_version: '1.0.0',
        platform: 'web',
        timestamp: Date.now(),
      });
    }
  } catch (error) {
    // Analytics should never break the app — fail silently
    if (import.meta.env.DEV) console.debug('[Analytics]', eventName, params);
  }
};

/**
 * Set user properties for Firebase Analytics audience segmentation
 * @param {Object} properties - User properties to set
 */
export const setUserProperties = async (properties) => {
  if (!isFirebaseConfigured) return;
  try {
    const { setUserProperties: setProps } = await import('firebase/analytics');
    const analytics = await getAnalyticsInstance();
    if (analytics) {
      setProps(analytics, properties);
    }
  } catch (e) { /* silent */ }
};

/**
 * Set user ID for cross-device tracking in Firebase Analytics
 * @param {string} userId
 */
export const setAnalyticsUserId = async (userId) => {
  if (!isFirebaseConfigured) return;
  try {
    const { setUserId } = await import('firebase/analytics');
    const analytics = await getAnalyticsInstance();
    if (analytics) {
      setUserId(analytics, userId);
    }
  } catch (e) { /* silent */ }
};

// ─── Page View Tracking ─────────────────────────────────────
/** @param {string} pageName - Human-readable page name */
export const trackPageView = (pageName) =>
  safeLogEvent('page_view', {
    page_title: pageName,
    page_location: window.location.href,
    page_path: window.location.pathname,
  });

// ─── Chat / Gemini AI Tracking ──────────────────────────────
/** @param {string} topic */
export const trackChatMessage = (topic = 'general') =>
  safeLogEvent('chat_message_sent', { topic, engagement_type: 'ai_chat' });

/** @param {number} responseTime - Response time in ms */
export const trackChatResponse = (responseTime) =>
  safeLogEvent('chat_response_received', {
    response_time_ms: responseTime,
    engagement_type: 'ai_chat',
  });

/** Track when the AI uses a fallback response */
export const trackAIFallback = (reason = 'api_unavailable') =>
  safeLogEvent('ai_fallback_used', { reason, engagement_type: 'ai_chat' });

// ─── Quiz Tracking ──────────────────────────────────────────
/** @param {string} category @param {string} difficulty */
export const trackQuizStart = (category, difficulty) =>
  safeLogEvent('quiz_started', { category, difficulty, engagement_type: 'quiz' });

/** @param {string} category @param {number} score @param {number} totalQuestions */
export const trackQuizComplete = (category, score, totalQuestions) =>
  safeLogEvent('quiz_completed', {
    category,
    score,
    total_questions: totalQuestions,
    percentage: Math.round((score / totalQuestions) * 100),
    engagement_type: 'quiz',
  });

/** @param {boolean} isCorrect */
export const trackQuizAnswer = (isCorrect) =>
  safeLogEvent('quiz_answer', { is_correct: isCorrect, engagement_type: 'quiz' });

// ─── Timeline Tracking ─────────────────────────────────────
/** @param {string} stageName @param {number} stageIndex */
export const trackTimelineStageViewed = (stageName, stageIndex) =>
  safeLogEvent('timeline_stage_viewed', {
    stage_name: stageName,
    stage_index: stageIndex,
    engagement_type: 'timeline',
  });

/** Track when all timeline stages are completed */
export const trackTimelineComplete = () =>
  safeLogEvent('timeline_completed', { engagement_type: 'timeline' });

// ─── Encyclopedia Tracking ──────────────────────────────────
/** @param {string} termName */
export const trackTermViewed = (termName) =>
  safeLogEvent('encyclopedia_term_viewed', {
    term_name: termName,
    engagement_type: 'encyclopedia',
  });

/** @param {string} searchQuery */
export const trackSearch = (searchQuery) =>
  safeLogEvent('search', { search_term: searchQuery });

/** @param {string} termId */
export const trackTermBookmarked = (termId) =>
  safeLogEvent('term_bookmarked', { term_id: termId, engagement_type: 'encyclopedia' });

// ─── Feature Usage Tracking ─────────────────────────────────
/** @param {string} featureName */
export const trackFeatureUsage = (featureName) =>
  safeLogEvent('feature_used', { feature_name: featureName });

// ─── Auth Events ────────────────────────────────────────────
/** @param {string} method - 'google', 'anonymous', 'local_guest' */
export const trackLogin = (method) =>
  safeLogEvent('login', { method });

/** @param {string} method */
export const trackSignUp = (method) =>
  safeLogEvent('sign_up', { method });

/** Track sign-out events */
export const trackSignOut = () =>
  safeLogEvent('logout', {});

// ─── Voter Checklist Tracking ───────────────────────────────
/** @param {number} completedItems @param {number} totalItems */
export const trackChecklistProgress = (completedItems, totalItems) =>
  safeLogEvent('checklist_progress', {
    completed: completedItems,
    total: totalItems,
    percentage: Math.round((completedItems / totalItems) * 100),
    engagement_type: 'checklist',
  });

/** Track when checklist is fully completed */
export const trackChecklistComplete = () =>
  safeLogEvent('checklist_completed', { engagement_type: 'checklist' });

// ─── Achievement Tracking ───────────────────────────────────
/** @param {string} achievementId @param {string} achievementName */
export const trackAchievementUnlocked = (achievementId, achievementName) =>
  safeLogEvent('achievement_unlocked', {
    achievement_id: achievementId,
    achievement_name: achievementName,
  });

// ─── Performance Tracking ───────────────────────────────────
/** Track app load performance */
export const trackAppPerformance = () => {
  if (typeof window === 'undefined' || !window.performance) return;
  try {
    const nav = performance.getEntriesByType('navigation')[0];
    if (nav) {
      safeLogEvent('app_performance', {
        dom_load_ms: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
        full_load_ms: Math.round(nav.loadEventEnd - nav.startTime),
        dns_ms: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
        ttfb_ms: Math.round(nav.responseStart - nav.requestStart),
      });
    }
  } catch (e) { /* performance API not available */ }
};

// ─── Error Tracking ─────────────────────────────────────────
/** @param {string} errorType @param {string} errorMessage */
export const trackError = (errorType, errorMessage) =>
  safeLogEvent('app_error', {
    error_type: errorType,
    error_message: errorMessage?.slice(0, 100),
  });
