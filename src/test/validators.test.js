import { describe, it, expect } from 'vitest';
import {
  sanitizeInput,
  sanitizeForDisplay,
  validateChatMessage,
  validateSearchQuery,
  isValidUserId,
  isValidAnswerIndex,
  createRateLimiter,
} from '../utils/validators';

describe('Validators - sanitizeInput', () => {
  it('should escape HTML angle brackets', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toContain('&lt;');
    expect(sanitizeInput('<script>alert("xss")</script>')).toContain('&gt;');
  });

  it('should escape quotes', () => {
    expect(sanitizeInput('"hello"')).toContain('&quot;');
    expect(sanitizeInput("'hello'")).toContain('&#x27;');
  });

  it('should trim whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('should return empty string for non-string input', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
    expect(sanitizeInput(123)).toBe('');
  });
});

describe('Validators - sanitizeForDisplay', () => {
  it('should convert markdown bold to <strong>', () => {
    const result = sanitizeForDisplay('**bold text**');
    expect(result).toContain('<strong>bold text</strong>');
  });

  it('should convert markdown italic to <em>', () => {
    const result = sanitizeForDisplay('*italic text*');
    expect(result).toContain('<em>italic text</em>');
  });

  it('should convert markdown links to safe <a> tags', () => {
    const result = sanitizeForDisplay('[ECI](https://eci.gov.in)');
    expect(result).toContain('href="https://eci.gov.in"');
    expect(result).toContain('rel="noopener noreferrer"');
  });

  it('should escape raw HTML before formatting', () => {
    const result = sanitizeForDisplay('<script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  it('should return empty string for non-string input', () => {
    expect(sanitizeForDisplay(null)).toBe('');
    expect(sanitizeForDisplay(42)).toBe('');
  });
});

describe('Validators - validateChatMessage', () => {
  it('should accept valid messages', () => {
    const result = validateChatMessage('What is EVM?');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should reject empty messages', () => {
    expect(validateChatMessage('').valid).toBe(false);
    expect(validateChatMessage('   ').valid).toBe(false);
    expect(validateChatMessage(null).valid).toBe(false);
  });

  it('should reject messages exceeding max length', () => {
    const longMsg = 'a'.repeat(2001);
    const result = validateChatMessage(longMsg);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('2000');
  });

  it('should reject messages with script injection', () => {
    expect(validateChatMessage('<script>').valid).toBe(false);
    expect(validateChatMessage('javascript:void(0)').valid).toBe(false);
    expect(validateChatMessage('onclick=alert(1)').valid).toBe(false);
  });
});

describe('Validators - validateSearchQuery', () => {
  it('should clean and trim search queries', () => {
    expect(validateSearchQuery('  EVM  ')).toBe('EVM');
  });

  it('should remove dangerous characters', () => {
    expect(validateSearchQuery('EVM<script>')).toBe('EVMscript');
  });

  it('should truncate long queries to 200 chars', () => {
    const long = 'a'.repeat(300);
    expect(validateSearchQuery(long).length).toBe(200);
  });

  it('should return empty string for non-string input', () => {
    expect(validateSearchQuery(null)).toBe('');
    expect(validateSearchQuery(123)).toBe('');
  });
});

describe('Validators - isValidUserId', () => {
  it('should accept valid UIDs', () => {
    expect(isValidUserId('user_123')).toBe(true);
    expect(isValidUserId('guest_abc-def')).toBe(true);
  });

  it('should reject invalid UIDs', () => {
    expect(isValidUserId('')).toBe(false);
    expect(isValidUserId(null)).toBe(false);
    expect(isValidUserId('user with spaces')).toBe(false);
    expect(isValidUserId('a'.repeat(129))).toBe(false);
  });
});

describe('Validators - isValidAnswerIndex', () => {
  it('should accept valid indices', () => {
    expect(isValidAnswerIndex(0)).toBe(true);
    expect(isValidAnswerIndex(3)).toBe(true);
  });

  it('should reject invalid indices', () => {
    expect(isValidAnswerIndex(-1)).toBe(false);
    expect(isValidAnswerIndex(4)).toBe(false);
    expect(isValidAnswerIndex(1.5)).toBe(false);
    expect(isValidAnswerIndex(null)).toBe(false);
  });
});

describe('Validators - createRateLimiter', () => {
  it('should allow first call', () => {
    const limiter = createRateLimiter(1000);
    expect(limiter.canProceed()).toBe(true);
  });

  it('should block rapid successive calls', () => {
    const limiter = createRateLimiter(5000);
    limiter.canProceed(); // first call
    expect(limiter.canProceed()).toBe(false); // too soon
  });

  it('should reset properly', () => {
    const limiter = createRateLimiter(5000);
    limiter.canProceed();
    limiter.reset();
    expect(limiter.canProceed()).toBe(true);
  });
});
