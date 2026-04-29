import { describe, it, expect, vi } from 'vitest';

// Mock firebase/performance
vi.mock('firebase/performance', () => ({
  trace: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    putAttribute: vi.fn(),
    putMetric: vi.fn(),
  })),
}));

describe('Performance Monitoring Service', () => {
  it('should export startTrace function', async () => {
    const { startTrace } = await import('../services/performanceService');
    expect(typeof startTrace).toBe('function');
  });

  it('should export stopTrace function', async () => {
    const { stopTrace } = await import('../services/performanceService');
    expect(typeof stopTrace).toBe('function');
  });

  it('should export setTraceAttribute function', async () => {
    const { setTraceAttribute } = await import('../services/performanceService');
    expect(typeof setTraceAttribute).toBe('function');
  });

  it('should export setTraceMetric function', async () => {
    const { setTraceMetric } = await import('../services/performanceService');
    expect(typeof setTraceMetric).toBe('function');
  });

  it('should export measureAsync function', async () => {
    const { measureAsync } = await import('../services/performanceService');
    expect(typeof measureAsync).toBe('function');
  });

  it('should export TRACE_NAMES constants', async () => {
    const { TRACE_NAMES } = await import('../services/performanceService');
    expect(TRACE_NAMES).toBeDefined();
    expect(TRACE_NAMES.AI_CHAT_RESPONSE).toBe('ai_chat_response');
    expect(TRACE_NAMES.QUIZ_COMPLETION).toBe('quiz_completion');
    expect(TRACE_NAMES.AI_TERM_ENRICHMENT).toBe('ai_term_enrichment');
  });

  it('startTrace should return null when perf is not available', async () => {
    const { startTrace } = await import('../services/performanceService');
    const trace = await startTrace('test_trace');
    // perf is null in test environment
    expect(trace).toBeNull();
  });

  it('stopTrace should not throw with null trace', async () => {
    const { stopTrace } = await import('../services/performanceService');
    expect(() => stopTrace(null)).not.toThrow();
  });

  it('setTraceAttribute should not throw with null trace', async () => {
    const { setTraceAttribute } = await import('../services/performanceService');
    expect(() => setTraceAttribute(null, 'key', 'value')).not.toThrow();
  });

  it('setTraceMetric should not throw with null trace', async () => {
    const { setTraceMetric } = await import('../services/performanceService');
    expect(() => setTraceMetric(null, 'metric', 42)).not.toThrow();
  });

  it('measureAsync should execute the async function and return result', async () => {
    const { measureAsync } = await import('../services/performanceService');
    const { result, durationMs } = await measureAsync(
      'test_measure',
      async () => 'hello',
      { test: 'attr' }
    );
    expect(result).toBe('hello');
    expect(typeof durationMs).toBe('number');
    expect(durationMs).toBeGreaterThanOrEqual(0);
  });

  it('measureAsync should propagate errors', async () => {
    const { measureAsync } = await import('../services/performanceService');
    await expect(
      measureAsync('error_test', async () => { throw new Error('fail'); })
    ).rejects.toThrow('fail');
  });
});
