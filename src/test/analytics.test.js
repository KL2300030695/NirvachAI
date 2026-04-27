import { describe, it, expect, vi } from 'vitest';
import { trackPageView, trackChatMessage, trackQuizStart, trackQuizComplete, trackLogin, trackChecklistProgress } from '../services/analytics';

describe('Analytics Service', () => {
  it('trackPageView should be callable without error', () => {
    expect(() => trackPageView('Home')).not.toThrow();
  });

  it('trackChatMessage should be callable without error', () => {
    expect(() => trackChatMessage('elections')).not.toThrow();
  });

  it('trackQuizStart should be callable without error', () => {
    expect(() => trackQuizStart('basics', 'beginner')).not.toThrow();
  });

  it('trackQuizComplete should be callable without error', () => {
    expect(() => trackQuizComplete('basics', 3, 5)).not.toThrow();
  });

  it('trackLogin should be callable without error', () => {
    expect(() => trackLogin('google')).not.toThrow();
  });

  it('trackChecklistProgress should be callable without error', () => {
    expect(() => trackChecklistProgress(5, 20)).not.toThrow();
  });

  it('all analytics functions should be functions', () => {
    expect(typeof trackPageView).toBe('function');
    expect(typeof trackChatMessage).toBe('function');
    expect(typeof trackQuizStart).toBe('function');
    expect(typeof trackQuizComplete).toBe('function');
    expect(typeof trackLogin).toBe('function');
    expect(typeof trackChecklistProgress).toBe('function');
  });
});
