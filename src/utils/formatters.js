/**
 * Formatting Utilities
 *
 * Reusable formatters for percentages, scores, dates, and text content.
 * Extracted from inline logic in page components to ensure consistency.
 *
 * @module formatters
 */

/**
 * Format a score as a percentage
 * @param {number} score - Points scored
 * @param {number} total - Total possible points
 * @returns {number} Rounded percentage (0-100)
 */
export const formatPercentage = (score, total) => {
  if (!total || total <= 0) return 0;
  return Math.round((score / total) * 100);
};

/**
 * Format a score display string (e.g., "3/5")
 * @param {number} score - Points scored
 * @param {number} total - Total possible points
 * @returns {string} Formatted score string
 */
export const formatScore = (score, total) => {
  return `${score ?? 0}/${total ?? 0}`;
};

/**
 * Format a date to a readable locale string
 * @param {string|Date} dateInput - ISO date string or Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (dateInput) => {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return 'Unknown date';
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Unknown date';
  }
};

/**
 * Format a timestamp to relative time (e.g., "2 min ago")
 * @param {Date|number} timestamp - Date or timestamp in ms
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (timestamp) => {
  const now = Date.now();
  const time = timestamp instanceof Date ? timestamp.getTime() : timestamp;
  const diffMs = now - time;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hr ago`;
  return `${Math.floor(diffSec / 86400)} days ago`;
};

/**
 * Capitalize the first letter of a string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (typeof str !== 'string' || str.length === 0) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate text to a maximum length with ellipsis
 * @param {string} text - Input text
 * @param {number} maxLength - Maximum character length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
};

/**
 * Extract a topic hint from a user message (first 3 words)
 * Used for analytics categorization of chat messages
 * @param {string} message - User message
 * @returns {string} Topic hint
 */
export const extractTopicHint = (message) => {
  if (typeof message !== 'string') return 'general';
  return message.split(' ').slice(0, 3).join(' ') || 'general';
};

/**
 * Get quiz result message based on percentage score
 * @param {number} percentage - Score percentage (0-100)
 * @returns {{ emoji: string, text: string }} Result message
 */
export const getQuizResultMessage = (percentage) => {
  if (percentage === 100) return { emoji: '🏆', text: "Perfect Score! You're an election expert!" };
  if (percentage >= 75) return { emoji: '🌟', text: 'Excellent! Great understanding of the process!' };
  if (percentage >= 50) return { emoji: '👍', text: 'Good effort! Keep learning to improve!' };
  return { emoji: '📚', text: 'Keep exploring! The Timeline and Encyclopedia can help!' };
};
