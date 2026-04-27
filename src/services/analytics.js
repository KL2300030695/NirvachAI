import { getAnalyticsInstance, isFirebaseConfigured } from '../config/firebase';

/**
 * Safely log an analytics event
 */
const safeLogEvent = async (eventName, params = {}) => {
  if (!isFirebaseConfigured) return;
  try {
    const { logEvent } = await import('firebase/analytics');
    const analytics = await getAnalyticsInstance();
    if (analytics) {
      logEvent(analytics, eventName, params);
    }
  } catch (error) {
    // Silently fail — analytics should never break the app
  }
};

// Page view tracking
export const trackPageView = (pageName) =>
  safeLogEvent('page_view', { page_title: pageName, page_location: window.location.href });

// Chat interactions
export const trackChatMessage = (topic = 'general') =>
  safeLogEvent('chat_message_sent', { topic });

export const trackChatResponse = (responseTime) =>
  safeLogEvent('chat_response_received', { response_time_ms: responseTime });

// Quiz tracking
export const trackQuizStart = (category, difficulty) =>
  safeLogEvent('quiz_started', { category, difficulty });

export const trackQuizComplete = (category, score, totalQuestions) =>
  safeLogEvent('quiz_completed', { category, score, total_questions: totalQuestions, percentage: Math.round((score / totalQuestions) * 100) });

export const trackQuizAnswer = (isCorrect) =>
  safeLogEvent('quiz_answer', { is_correct: isCorrect });

// Timeline interactions
export const trackTimelineStageViewed = (stageName, stageIndex) =>
  safeLogEvent('timeline_stage_viewed', { stage_name: stageName, stage_index: stageIndex });

// Encyclopedia
export const trackTermViewed = (termName) =>
  safeLogEvent('encyclopedia_term_viewed', { term_name: termName });

export const trackSearch = (searchQuery) =>
  safeLogEvent('search', { search_term: searchQuery });

// Feature usage
export const trackFeatureUsage = (featureName) =>
  safeLogEvent('feature_used', { feature_name: featureName });

// Auth events
export const trackLogin = (method) =>
  safeLogEvent('login', { method });

export const trackSignUp = (method) =>
  safeLogEvent('sign_up', { method });

// Voter checklist
export const trackChecklistProgress = (completedItems, totalItems) =>
  safeLogEvent('checklist_progress', { completed: completedItems, total: totalItems, percentage: Math.round((completedItems / totalItems) * 100) });
