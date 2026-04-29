import { describe, it, expect } from 'vitest';
import {
  APP, ROUTES, STORAGE_KEYS, GEMINI, QUIZ, TIMELINE,
  ANALYTICS_EVENTS, A11Y, PERFORMANCE, REMOTE_CONFIG_DEFAULTS,
} from '../config/constants';

describe('Application Constants', () => {
  describe('APP metadata', () => {
    it('should have correct app name', () => {
      expect(APP.NAME).toBe('NirvachAI');
    });

    it('should have a version string', () => {
      expect(APP.VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should have valid ECI URLs', () => {
      expect(APP.ECI_URL).toMatch(/^https:\/\//);
      expect(APP.VOTER_PORTAL_URL).toMatch(/^https:\/\//);
      expect(APP.SVEEP_URL).toMatch(/^https:\/\//);
    });

    it('should be frozen (immutable)', () => {
      expect(Object.isFrozen(APP)).toBe(true);
    });
  });

  describe('ROUTES', () => {
    it('should have all expected routes', () => {
      expect(ROUTES.HOME).toBe('/');
      expect(ROUTES.CHAT).toBe('/chat');
      expect(ROUTES.TIMELINE).toBe('/timeline');
      expect(ROUTES.QUIZ).toBe('/quiz');
      expect(ROUTES.ENCYCLOPEDIA).toBe('/encyclopedia');
      expect(ROUTES.CHECKLIST).toBe('/checklist');
      expect(ROUTES.DASHBOARD).toBe('/dashboard');
    });

    it('should be frozen', () => {
      expect(Object.isFrozen(ROUTES)).toBe(true);
    });
  });

  describe('STORAGE_KEYS', () => {
    it('should have session and user prefix keys', () => {
      expect(STORAGE_KEYS.SESSION).toBe('nirvachai_session');
      expect(STORAGE_KEYS.USER_PREFIX).toBe('nirvachai_user_');
    });

    it('should be frozen', () => {
      expect(Object.isFrozen(STORAGE_KEYS)).toBe(true);
    });
  });

  describe('GEMINI config', () => {
    it('should have valid model name', () => {
      expect(GEMINI.MODEL).toContain('gemini');
    });

    it('should have valid temperature range', () => {
      expect(GEMINI.TEMPERATURE).toBeGreaterThanOrEqual(0);
      expect(GEMINI.TEMPERATURE).toBeLessThanOrEqual(2);
    });

    it('should have positive max tokens', () => {
      expect(GEMINI.MAX_OUTPUT_TOKENS).toBeGreaterThan(0);
    });

    it('should have max input length', () => {
      expect(GEMINI.MAX_INPUT_LENGTH).toBeGreaterThan(0);
    });
  });

  describe('QUIZ config', () => {
    it('should have 3 difficulties', () => {
      expect(QUIZ.DIFFICULTIES).toHaveLength(3);
      expect(QUIZ.DIFFICULTIES).toContain('beginner');
      expect(QUIZ.DIFFICULTIES).toContain('intermediate');
      expect(QUIZ.DIFFICULTIES).toContain('advanced');
    });

    it('should have min questions threshold', () => {
      expect(QUIZ.MIN_QUESTIONS).toBeGreaterThanOrEqual(25);
    });
  });

  describe('TIMELINE config', () => {
    it('should have 9 total stages', () => {
      expect(TIMELINE.TOTAL_STAGES).toBe(9);
    });
  });

  describe('ANALYTICS_EVENTS', () => {
    it('should have page_view event', () => {
      expect(ANALYTICS_EVENTS.PAGE_VIEW).toBe('page_view');
    });

    it('should have all quiz events', () => {
      expect(ANALYTICS_EVENTS.QUIZ_STARTED).toBeDefined();
      expect(ANALYTICS_EVENTS.QUIZ_COMPLETED).toBeDefined();
      expect(ANALYTICS_EVENTS.QUIZ_ANSWER).toBeDefined();
    });

    it('should be frozen', () => {
      expect(Object.isFrozen(ANALYTICS_EVENTS)).toBe(true);
    });
  });

  describe('A11Y constants', () => {
    it('should have skip link target', () => {
      expect(A11Y.SKIP_LINK_TARGET).toBe('#main-content');
    });

    it('should have main content ID', () => {
      expect(A11Y.MAIN_CONTENT_ID).toBe('main-content');
    });
  });

  describe('PERFORMANCE thresholds', () => {
    it('should have reasonable load time thresholds', () => {
      expect(PERFORMANCE.GOOD_LOAD_TIME).toBeLessThan(PERFORMANCE.ACCEPTABLE_LOAD_TIME);
    });

    it('should have auth timeout', () => {
      expect(PERFORMANCE.AUTH_TIMEOUT).toBeGreaterThan(0);
    });
  });

  describe('REMOTE_CONFIG_DEFAULTS', () => {
    it('should have all expected default keys', () => {
      expect(REMOTE_CONFIG_DEFAULTS.welcome_message).toBeDefined();
      expect(REMOTE_CONFIG_DEFAULTS.default_difficulty).toBe('beginner');
      expect(REMOTE_CONFIG_DEFAULTS.enable_ai_explanations).toBe(true);
    });

    it('should be frozen', () => {
      expect(Object.isFrozen(REMOTE_CONFIG_DEFAULTS)).toBe(true);
    });
  });
});
