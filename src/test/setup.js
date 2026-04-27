import '@testing-library/jest-dom';

// Mock Firebase modules
vi.mock('../config/firebase', () => ({
  auth: null,
  googleProvider: null,
  isFirebaseConfigured: false,
  getAnalyticsInstance: vi.fn().mockResolvedValue(null),
  app: null,
}));

// Mock analytics
vi.mock('../services/analytics', () => ({
  trackPageView: vi.fn(),
  trackChatMessage: vi.fn(),
  trackChatResponse: vi.fn(),
  trackQuizStart: vi.fn(),
  trackQuizComplete: vi.fn(),
  trackQuizAnswer: vi.fn(),
  trackTimelineStageViewed: vi.fn(),
  trackTermViewed: vi.fn(),
  trackSearch: vi.fn(),
  trackFeatureUsage: vi.fn(),
  trackLogin: vi.fn(),
  trackSignUp: vi.fn(),
  trackChecklistProgress: vi.fn(),
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
