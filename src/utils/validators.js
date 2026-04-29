/**
 * Input Validation & Sanitization Utilities
 *
 * Provides centralized input validation, sanitization, and XSS prevention
 * functions used across the application. Ensures all user inputs are
 * validated before processing or sending to external APIs.
 *
 * @module validators
 */

import { GEMINI } from '../config/constants';

/**
 * Sanitize user input by removing potentially dangerous HTML/script content
 * @param {string} input - Raw user input
 * @returns {string} Sanitized string safe for display and API calls
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Sanitize text for safe HTML rendering (reverse of sanitizeInput for display)
 * Converts markdown-like syntax to safe HTML without using dangerouslySetInnerHTML risks
 * @param {string} content - Content with markdown formatting
 * @returns {string} Sanitized HTML string
 */
export const sanitizeForDisplay = (content) => {
  if (typeof content !== 'string') return '';

  // First escape all HTML
  let safe = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Then apply safe markdown transformations
  safe = safe
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(
      /\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>'
    )
    .replace(/^• (.*)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n/g, '<br/>');

  return safe;
};

/**
 * Validate chat message input
 * @param {string} message - User's chat message
 * @returns {{ valid: boolean, error: string|null }} Validation result
 */
export const validateChatMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message cannot be empty' };
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (trimmed.length > GEMINI.MAX_INPUT_LENGTH) {
    return { valid: false, error: `Message must be under ${GEMINI.MAX_INPUT_LENGTH} characters` };
  }

  // Check for potential injection attempts
  if (/(<script|javascript:|on\w+=)/i.test(trimmed)) {
    return { valid: false, error: 'Invalid characters detected' };
  }

  return { valid: true, error: null };
};

/**
 * Validate search query for the encyclopedia
 * @param {string} query - Search query
 * @returns {string} Cleaned search query
 */
export const validateSearchQuery = (query) => {
  if (typeof query !== 'string') return '';
  return query
    .replace(/[<>{}]/g, '')
    .trim()
    .slice(0, 200);
};

/**
 * Validate user ID format
 * @param {string} uid - User ID to validate
 * @returns {boolean} Whether the UID is valid
 */
export const isValidUserId = (uid) => {
  if (typeof uid !== 'string') return false;
  return uid.length > 0 && uid.length <= 128 && /^[a-zA-Z0-9_-]+$/.test(uid);
};

/**
 * Validate quiz answer index
 * @param {number} index - Selected answer index
 * @param {number} optionCount - Number of available options
 * @returns {boolean} Whether the answer index is valid
 */
export const isValidAnswerIndex = (index, optionCount = 4) => {
  return Number.isInteger(index) && index >= 0 && index < optionCount;
};

/**
 * Rate limiter factory — creates a function that throttles calls
 * @param {number} minIntervalMs - Minimum time between calls
 * @returns {{ canProceed: () => boolean, reset: () => void }}
 */
export const createRateLimiter = (minIntervalMs) => {
  let lastCallTime = 0;

  return {
    canProceed: () => {
      const now = Date.now();
      if (now - lastCallTime >= minIntervalMs) {
        lastCallTime = now;
        return true;
      }
      return false;
    },
    reset: () => {
      lastCallTime = 0;
    },
  };
};
