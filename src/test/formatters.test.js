import { describe, it, expect } from 'vitest';
import {
  formatPercentage,
  formatScore,
  formatDate,
  formatRelativeTime,
  capitalize,
  truncateText,
  extractTopicHint,
  getQuizResultMessage,
} from '../utils/formatters';

describe('Formatters - formatPercentage', () => {
  it('should calculate percentage correctly', () => {
    expect(formatPercentage(3, 5)).toBe(60);
    expect(formatPercentage(5, 5)).toBe(100);
    expect(formatPercentage(0, 5)).toBe(0);
  });

  it('should round to nearest integer', () => {
    expect(formatPercentage(1, 3)).toBe(33);
    expect(formatPercentage(2, 3)).toBe(67);
  });

  it('should return 0 for zero/invalid total', () => {
    expect(formatPercentage(5, 0)).toBe(0);
    expect(formatPercentage(5, null)).toBe(0);
  });
});

describe('Formatters - formatScore', () => {
  it('should format score string correctly', () => {
    expect(formatScore(3, 5)).toBe('3/5');
    expect(formatScore(0, 10)).toBe('0/10');
  });

  it('should handle null/undefined values', () => {
    expect(formatScore(null, 5)).toBe('0/5');
    expect(formatScore(3, null)).toBe('3/0');
  });
});

describe('Formatters - formatDate', () => {
  it('should format ISO date string', () => {
    const result = formatDate('2024-01-25T10:30:00Z');
    expect(typeof result).toBe('string');
    expect(result).not.toBe('Unknown date');
  });

  it('should format Date objects', () => {
    const result = formatDate(new Date(2024, 0, 25));
    expect(typeof result).toBe('string');
    expect(result).toContain('2024');
  });

  it('should return "Unknown date" for invalid input', () => {
    expect(formatDate('not-a-date')).toBe('Unknown date');
    expect(formatDate(null)).toBe('Unknown date');
  });
});

describe('Formatters - formatRelativeTime', () => {
  it('should return "Just now" for recent timestamps', () => {
    expect(formatRelativeTime(Date.now())).toBe('Just now');
  });

  it('should return minutes for recent past', () => {
    const fiveMinAgo = Date.now() - 5 * 60 * 1000;
    expect(formatRelativeTime(fiveMinAgo)).toBe('5 min ago');
  });

  it('should return hours for older timestamps', () => {
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    expect(formatRelativeTime(twoHoursAgo)).toBe('2 hr ago');
  });

  it('should handle Date objects', () => {
    expect(formatRelativeTime(new Date())).toBe('Just now');
  });
});

describe('Formatters - capitalize', () => {
  it('should capitalize first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('beginner')).toBe('Beginner');
  });

  it('should return empty string for invalid input', () => {
    expect(capitalize('')).toBe('');
    expect(capitalize(null)).toBe('');
    expect(capitalize(123)).toBe('');
  });
});

describe('Formatters - truncateText', () => {
  it('should truncate long text with ellipsis', () => {
    const long = 'This is a very long text that should be truncated';
    const result = truncateText(long, 20);
    expect(result.length).toBeLessThanOrEqual(21); // 20 + ellipsis
    expect(result).toContain('…');
  });

  it('should not truncate short text', () => {
    expect(truncateText('Short', 100)).toBe('Short');
  });

  it('should handle non-string input', () => {
    expect(truncateText(null)).toBe('');
    expect(truncateText(123)).toBe('');
  });
});

describe('Formatters - extractTopicHint', () => {
  it('should extract first 3 words', () => {
    expect(extractTopicHint('How does voting work?')).toBe('How does voting');
  });

  it('should return "general" for non-string input', () => {
    expect(extractTopicHint(null)).toBe('general');
  });

  it('should handle short messages', () => {
    expect(extractTopicHint('Hello')).toBe('Hello');
  });
});

describe('Formatters - getQuizResultMessage', () => {
  it('should return perfect score message for 100%', () => {
    const result = getQuizResultMessage(100);
    expect(result.emoji).toBe('🏆');
    expect(result.text).toContain('Perfect');
  });

  it('should return excellent for 75-99%', () => {
    const result = getQuizResultMessage(80);
    expect(result.emoji).toBe('🌟');
  });

  it('should return good for 50-74%', () => {
    const result = getQuizResultMessage(60);
    expect(result.emoji).toBe('👍');
  });

  it('should return encourage for below 50%', () => {
    const result = getQuizResultMessage(30);
    expect(result.emoji).toBe('📚');
  });
});
