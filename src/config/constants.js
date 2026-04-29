/**
 * Application Constants
 *
 * Centralized configuration values, magic strings, and defaults.
 * Eliminates scattered literals and ensures consistency across the app.
 *
 * @module constants
 */

/** Application metadata */
export const APP = Object.freeze({
  NAME: 'NirvachAI',
  VERSION: '1.0.0',
  TAGLINE: 'Understand Democracy, One Step at a Time',
  PLATFORM: 'web',
  ECI_URL: 'https://eci.gov.in',
  VOTER_PORTAL_URL: 'https://voters.eci.gov.in',
  SVEEP_URL: 'https://ecisveep.nic.in',
  ECI_HELPLINE: '1950',
});

/** Route paths used in navigation */
export const ROUTES = Object.freeze({
  HOME: '/',
  CHAT: '/chat',
  TIMELINE: '/timeline',
  QUIZ: '/quiz',
  ENCYCLOPEDIA: '/encyclopedia',
  CHECKLIST: '/checklist',
  DASHBOARD: '/dashboard',
});

/** LocalStorage keys — single source of truth */
export const STORAGE_KEYS = Object.freeze({
  SESSION: 'nirvachai_session',
  USER_PREFIX: 'nirvachai_user_',
  THEME: 'nirvachai_theme',
  REMOTE_CONFIG_CACHE: 'nirvachai_remote_config',
});

/** Gemini AI configuration */
export const GEMINI = Object.freeze({
  MODEL: 'gemini-2.0-flash',
  MAX_OUTPUT_TOKENS: 1024,
  QUIZ_MAX_TOKENS: 200,
  TEMPERATURE: 0.7,
  QUIZ_TEMPERATURE: 0.5,
  TOP_P: 0.9,
  MAX_CONTEXT_MESSAGES: 10,
  RATE_LIMIT_DELAY_MS: 1000,
  MAX_INPUT_LENGTH: 2000,
});

/** Quiz configuration */
export const QUIZ = Object.freeze({
  DIFFICULTIES: ['beginner', 'intermediate', 'advanced'],
  MIN_QUESTIONS: 25,
  OPTION_COUNT: 4,
  PERFECT_SCORE_THRESHOLD: 100,
  EXCELLENT_THRESHOLD: 75,
  GOOD_THRESHOLD: 50,
});

/** Timeline configuration */
export const TIMELINE = Object.freeze({
  TOTAL_STAGES: 9,
});

/** Firebase Analytics event names */
export const ANALYTICS_EVENTS = Object.freeze({
  PAGE_VIEW: 'page_view',
  SCREEN_VIEW: 'screen_view',
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  CHAT_RESPONSE_RECEIVED: 'chat_response_received',
  AI_FALLBACK_USED: 'ai_fallback_used',
  AI_EXPLAIN_USED: 'ai_explain_used',
  QUIZ_STARTED: 'quiz_started',
  QUIZ_COMPLETED: 'quiz_completed',
  QUIZ_ANSWER: 'quiz_answer',
  TIMELINE_STAGE_VIEWED: 'timeline_stage_viewed',
  TIMELINE_COMPLETED: 'timeline_completed',
  ENCYCLOPEDIA_TERM_VIEWED: 'encyclopedia_term_viewed',
  SEARCH: 'search',
  TERM_BOOKMARKED: 'term_bookmarked',
  FEATURE_USED: 'feature_used',
  LOGIN: 'login',
  SIGN_UP: 'sign_up',
  LOGOUT: 'logout',
  CHECKLIST_PROGRESS: 'checklist_progress',
  CHECKLIST_COMPLETED: 'checklist_completed',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  APP_PERFORMANCE: 'app_performance',
  APP_ERROR: 'app_error',
  USER_ENGAGEMENT: 'user_engagement',
});

/** Accessibility constants */
export const A11Y = Object.freeze({
  SKIP_LINK_TARGET: '#main-content',
  MAIN_CONTENT_ID: 'main-content',
  ARIA_ANNOUNCER_ID: 'aria-announcer',
  MIN_CONTRAST_RATIO: 4.5,
});

/** Performance thresholds (ms) */
export const PERFORMANCE = Object.freeze({
  GOOD_LOAD_TIME: 2000,
  ACCEPTABLE_LOAD_TIME: 5000,
  AI_RESPONSE_TIMEOUT: 15000,
  AUTH_TIMEOUT: 2000,
});

/** Remote Config defaults */
export const REMOTE_CONFIG_DEFAULTS = Object.freeze({
  welcome_message: 'Welcome to NirvachAI! Learn about Indian elections.',
  default_difficulty: 'beginner',
  max_chat_history: 10,
  enable_ai_explanations: true,
  enable_ai_term_enrichment: true,
  suggested_questions_count: 8,
});
