import '@testing-library/jest-dom';

// Mock Firebase config module
vi.mock('../config/firebase', () => ({
  auth: null,
  db: null,
  googleProvider: null,
  perf: null,
  isFirebaseConfigured: false,
  getAnalyticsInstance: vi.fn().mockResolvedValue(null),
  app: null,
}));

// Mock analytics — all functions as no-ops
vi.mock('../services/analytics', () => ({
  trackPageView: vi.fn(),
  trackScreenView: vi.fn(),
  trackChatMessage: vi.fn(),
  trackChatResponse: vi.fn(),
  trackAIFallback: vi.fn(),
  trackAIExplainUsed: vi.fn(),
  trackQuizStart: vi.fn(),
  trackQuizComplete: vi.fn(),
  trackQuizAnswer: vi.fn(),
  trackTimelineStageViewed: vi.fn(),
  trackTimelineComplete: vi.fn(),
  trackTermViewed: vi.fn(),
  trackSearch: vi.fn(),
  trackTermBookmarked: vi.fn(),
  trackFeatureUsage: vi.fn(),
  trackLogin: vi.fn(),
  trackSignUp: vi.fn(),
  trackSignOut: vi.fn(),
  trackChecklistProgress: vi.fn(),
  trackChecklistComplete: vi.fn(),
  trackAchievementUnlocked: vi.fn(),
  trackAppPerformance: vi.fn(),
  trackUserEngagement: vi.fn(),
  trackError: vi.fn(),
  setUserProperties: vi.fn().mockResolvedValue(undefined),
  setAnalyticsUserId: vi.fn().mockResolvedValue(undefined),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock performance API
if (!global.performance?.getEntriesByType) {
  Object.defineProperty(global, 'performance', {
    writable: true,
    value: {
      ...global.performance,
      getEntriesByType: () => [],
      now: () => Date.now(),
    },
  });
}
