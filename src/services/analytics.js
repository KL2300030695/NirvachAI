import { getAnalyticsInstance, isFirebaseConfigured } from '../config/firebase';
import { ANALYTICS_EVENTS, APP } from '../config/constants';

/**
 * Firebase Analytics Service
 *
 * Provides comprehensive event tracking for user engagement across all app features.
 * Implements custom event taxonomy aligned with Google Analytics 4 best practices.
 * Includes screen_view tracking, user engagement metrics, and custom dimensions.
 *
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
        app_version: APP.VERSION,
        platform: APP.PLATFORM,
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

// ─── Page View & Screen Tracking ────────────────────────────
/** @param {string} pageName - Human-readable page name */
export const trackPageView = (pageName) =>
  safeLogEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
    page_title: pageName,
    page_location: window.location.href,
    page_path: window.location.pathname,
  });

/**
 * Track screen view (GA4 recommended event for SPAs)
 * @param {string} screenName - Screen name
 * @param {string} screenClass - Screen class/component name
 */
export const trackScreenView = (screenName, screenClass = 'Page') =>
  safeLogEvent(ANALYTICS_EVENTS.SCREEN_VIEW, {
    screen_name: screenName,
    screen_class: screenClass,
  });

// ─── Chat / Gemini AI Tracking ──────────────────────────────
/** @param {string} topic */
export const trackChatMessage = (topic = 'general') =>
  safeLogEvent(ANALYTICS_EVENTS.CHAT_MESSAGE_SENT, { topic, engagement_type: 'ai_chat' });

/** @param {number} responseTime - Response time in ms */
export const trackChatResponse = (responseTime) =>
  safeLogEvent(ANALYTICS_EVENTS.CHAT_RESPONSE_RECEIVED, {
    response_time_ms: responseTime,
    engagement_type: 'ai_chat',
  });

/** Track when the AI uses a fallback response */
export const trackAIFallback = (reason = 'api_unavailable') =>
  safeLogEvent(ANALYTICS_EVENTS.AI_FALLBACK_USED, { reason, engagement_type: 'ai_chat' });

/**
 * Track AI-powered encyclopedia term explanation usage
 * @param {string} termName - The term being explained
 */
export const trackAIExplainUsed = (termName) =>
  safeLogEvent(ANALYTICS_EVENTS.AI_EXPLAIN_USED, { term_name: termName, engagement_type: 'ai_explain' });

// ─── Quiz Tracking ──────────────────────────────────────────
/** @param {string} category @param {string} difficulty */
export const trackQuizStart = (category, difficulty) =>
  safeLogEvent(ANALYTICS_EVENTS.QUIZ_STARTED, { category, difficulty, engagement_type: 'quiz' });

/** @param {string} category @param {number} score @param {number} totalQuestions */
export const trackQuizComplete = (category, score, totalQuestions) =>
  safeLogEvent(ANALYTICS_EVENTS.QUIZ_COMPLETED, {
    category,
    score,
    total_questions: totalQuestions,
    percentage: Math.round((score / totalQuestions) * 100),
    engagement_type: 'quiz',
  });

/** @param {boolean} isCorrect */
export const trackQuizAnswer = (isCorrect) =>
  safeLogEvent(ANALYTICS_EVENTS.QUIZ_ANSWER, { is_correct: isCorrect, engagement_type: 'quiz' });

// ─── Timeline Tracking ─────────────────────────────────────
/** @param {string} stageName @param {number} stageIndex */
export const trackTimelineStageViewed = (stageName, stageIndex) =>
  safeLogEvent(ANALYTICS_EVENTS.TIMELINE_STAGE_VIEWED, {
    stage_name: stageName,
    stage_index: stageIndex,
    engagement_type: 'timeline',
  });

/** Track when all timeline stages are completed */
export const trackTimelineComplete = () =>
  safeLogEvent(ANALYTICS_EVENTS.TIMELINE_COMPLETED, { engagement_type: 'timeline' });

// ─── Encyclopedia Tracking ──────────────────────────────────
/** @param {string} termName */
export const trackTermViewed = (termName) =>
  safeLogEvent(ANALYTICS_EVENTS.ENCYCLOPEDIA_TERM_VIEWED, {
    term_name: termName,
    engagement_type: 'encyclopedia',
  });

/** @param {string} searchQuery */
export const trackSearch = (searchQuery) =>
  safeLogEvent(ANALYTICS_EVENTS.SEARCH, { search_term: searchQuery });

/** @param {string} termId */
export const trackTermBookmarked = (termId) =>
  safeLogEvent(ANALYTICS_EVENTS.TERM_BOOKMARKED, { term_id: termId, engagement_type: 'encyclopedia' });

// ─── Feature Usage Tracking ─────────────────────────────────
/** @param {string} featureName */
export const trackFeatureUsage = (featureName) =>
  safeLogEvent(ANALYTICS_EVENTS.FEATURE_USED, { feature_name: featureName });

// ─── Auth Events ────────────────────────────────────────────
/** @param {string} method - 'google', 'anonymous', 'local_guest' */
export const trackLogin = (method) =>
  safeLogEvent(ANALYTICS_EVENTS.LOGIN, { method });

/** @param {string} method */
export const trackSignUp = (method) =>
  safeLogEvent(ANALYTICS_EVENTS.SIGN_UP, { method });

/** Track sign-out events */
export const trackSignOut = () =>
  safeLogEvent(ANALYTICS_EVENTS.LOGOUT, {});

// ─── Voter Checklist Tracking ───────────────────────────────
/** @param {number} completedItems @param {number} totalItems */
export const trackChecklistProgress = (completedItems, totalItems) =>
  safeLogEvent(ANALYTICS_EVENTS.CHECKLIST_PROGRESS, {
    completed: completedItems,
    total: totalItems,
    percentage: Math.round((completedItems / totalItems) * 100),
    engagement_type: 'checklist',
  });

/** Track when checklist is fully completed */
export const trackChecklistComplete = () =>
  safeLogEvent(ANALYTICS_EVENTS.CHECKLIST_COMPLETED, { engagement_type: 'checklist' });

// ─── Achievement Tracking ───────────────────────────────────
/** @param {string} achievementId @param {string} achievementName */
export const trackAchievementUnlocked = (achievementId, achievementName) =>
  safeLogEvent(ANALYTICS_EVENTS.ACHIEVEMENT_UNLOCKED, {
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
      safeLogEvent(ANALYTICS_EVENTS.APP_PERFORMANCE, {
        dom_load_ms: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
        full_load_ms: Math.round(nav.loadEventEnd - nav.startTime),
        dns_ms: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
        ttfb_ms: Math.round(nav.responseStart - nav.requestStart),
      });
    }
  } catch (e) { /* performance API not available */ }
};

// ─── User Engagement Tracking ───────────────────────────────
/**
 * Track user engagement duration for a feature
 * @param {string} featureName - Feature used
 * @param {number} durationMs - Time spent in ms
 */
export const trackUserEngagement = (featureName, durationMs) =>
  safeLogEvent(ANALYTICS_EVENTS.USER_ENGAGEMENT, {
    feature_name: featureName,
    duration_ms: durationMs,
    engagement_type: 'session',
  });

// ─── Error Tracking ─────────────────────────────────────────
/** @param {string} errorType @param {string} errorMessage */
export const trackError = (errorType, errorMessage) =>
  safeLogEvent(ANALYTICS_EVENTS.APP_ERROR, {
    error_type: errorType,
    error_message: errorMessage?.slice(0, 100),
  });
