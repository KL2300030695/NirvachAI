import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock firebase/remote-config
vi.mock('firebase/remote-config', () => ({
  getRemoteConfig: vi.fn(() => ({
    settings: {},
    defaultConfig: {},
  })),
  fetchAndActivate: vi.fn().mockResolvedValue(true),
  getValue: vi.fn(() => ({ asString: () => '' })),
}));

describe('Remote Config Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should export initRemoteConfig function', async () => {
    const { initRemoteConfig } = await import('../services/remoteConfig');
    expect(typeof initRemoteConfig).toBe('function');
  });

  it('should export getConfigValue function', async () => {
    const { getConfigValue } = await import('../services/remoteConfig');
    expect(typeof getConfigValue).toBe('function');
  });

  it('should export getAllConfigValues function', async () => {
    const { getAllConfigValues } = await import('../services/remoteConfig');
    expect(typeof getAllConfigValues).toBe('function');
  });

  it('getConfigValue should return defaults when not initialized', async () => {
    const { getConfigValue } = await import('../services/remoteConfig');
    const value = getConfigValue('default_difficulty');
    expect(value).toBe('beginner');
  });

  it('getAllConfigValues should return an object with expected keys', async () => {
    const { getAllConfigValues } = await import('../services/remoteConfig');
    const config = getAllConfigValues();
    expect(config).toHaveProperty('welcome_message');
    expect(config).toHaveProperty('default_difficulty');
    expect(config).toHaveProperty('max_chat_history');
    expect(config).toHaveProperty('enable_ai_explanations');
    expect(config).toHaveProperty('enable_ai_term_enrichment');
  });

  it('initRemoteConfig should not throw when Firebase is not configured', async () => {
    const { initRemoteConfig } = await import('../services/remoteConfig');
    await expect(initRemoteConfig()).resolves.not.toThrow();
  });

  it('should handle localStorage caching gracefully', async () => {
    const { getConfigValue } = await import('../services/remoteConfig');
    // Should not throw even with empty localStorage
    expect(() => getConfigValue('nonexistent_key')).not.toThrow();
  });

  it('getConfigValue should return null for unknown keys', async () => {
    const { getConfigValue } = await import('../services/remoteConfig');
    const value = getConfigValue('completely_unknown_key');
    expect(value).toBeNull();
  });
});
