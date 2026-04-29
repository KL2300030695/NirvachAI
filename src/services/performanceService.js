/**
 * Firebase Performance Monitoring Service
 *
 * Provides custom performance traces for measuring critical user flows:
 * - AI response latency
 * - Quiz completion times
 * - Page navigation performance
 *
 * Goes beyond Firebase's auto-instrumentation by adding business-specific metrics.
 *
 * @module performanceService
 * @see https://firebase.google.com/docs/perf-mon
 */

import { perf, isFirebaseConfigured } from '../config/firebase';

let traceModule = null;

/**
 * Lazily load Firebase Performance trace functions
 * @returns {Promise<boolean>}
 */
const loadTraceModule = async () => {
  if (traceModule) return true;
  if (!isFirebaseConfigured || !perf) return false;

  try {
    const perfModule = await import('firebase/performance');
    traceModule = perfModule;
    return true;
  } catch {
    return false;
  }
};

/**
 * Start a custom performance trace
 * @param {string} traceName - Name for the trace (snake_case)
 * @returns {Promise<Object|null>} Trace object with stop/setAttribute methods, or null
 */
export const startTrace = async (traceName) => {
  const loaded = await loadTraceModule();
  if (!loaded || !perf) return null;

  try {
    const traceInstance = traceModule.trace(perf, traceName);
    traceInstance.start();
    return traceInstance;
  } catch {
    return null;
  }
};

/**
 * Stop a running trace and record it
 * @param {Object|null} traceInstance - Trace from startTrace()
 */
export const stopTrace = (traceInstance) => {
  if (!traceInstance) return;
  try {
    traceInstance.stop();
  } catch {
    // Trace already stopped or invalid
  }
};

/**
 * Add a custom attribute to a trace
 * @param {Object|null} traceInstance - Active trace
 * @param {string} key - Attribute name
 * @param {string} value - Attribute value (must be string)
 */
export const setTraceAttribute = (traceInstance, key, value) => {
  if (!traceInstance) return;
  try {
    traceInstance.putAttribute(key, String(value));
  } catch {
    // Ignore attribute errors
  }
};

/**
 * Add a custom metric to a trace
 * @param {Object|null} traceInstance - Active trace
 * @param {string} metricName - Metric name
 * @param {number} value - Metric value
 */
export const setTraceMetric = (traceInstance, metricName, value) => {
  if (!traceInstance) return;
  try {
    traceInstance.putMetric(metricName, value);
  } catch {
    // Ignore metric errors
  }
};

/**
 * Measure an async operation with a performance trace
 * Convenience wrapper that starts a trace, runs the operation, and stops the trace.
 *
 * @template T
 * @param {string} traceName - Name for the trace
 * @param {() => Promise<T>} asyncFn - Async operation to measure
 * @param {Object<string, string>} [attributes] - Optional trace attributes
 * @returns {Promise<{ result: T, durationMs: number }>}
 */
export const measureAsync = async (traceName, asyncFn, attributes = {}) => {
  const traceInstance = await startTrace(traceName);
  const startTime = performance.now();

  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    setTraceAttribute(traceInstance, key, value);
  });

  try {
    const result = await asyncFn();
    const durationMs = Math.round(performance.now() - startTime);

    setTraceMetric(traceInstance, 'duration_ms', durationMs);
    setTraceAttribute(traceInstance, 'status', 'success');
    stopTrace(traceInstance);

    return { result, durationMs };
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);

    setTraceMetric(traceInstance, 'duration_ms', durationMs);
    setTraceAttribute(traceInstance, 'status', 'error');
    setTraceAttribute(traceInstance, 'error_message', error?.message?.slice(0, 100) || 'unknown');
    stopTrace(traceInstance);

    throw error;
  }
};

/**
 * Pre-defined trace names for consistency
 */
export const TRACE_NAMES = Object.freeze({
  AI_CHAT_RESPONSE: 'ai_chat_response',
  AI_QUIZ_EXPLANATION: 'ai_quiz_explanation',
  AI_TERM_ENRICHMENT: 'ai_term_enrichment',
  QUIZ_COMPLETION: 'quiz_completion',
  PAGE_RENDER: 'page_render',
  AUTH_FLOW: 'auth_flow',
  FIRESTORE_SAVE: 'firestore_save',
  FIRESTORE_LOAD: 'firestore_load',
});
