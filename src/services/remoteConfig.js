/**
 * Firebase Remote Config Service
 *
 * Provides feature flags and dynamic configuration from Firebase Remote Config.
 * Falls back to local defaults when Remote Config is unavailable.
 * This enables server-side control of app behavior without deploying new code.
 *
 * @module remoteConfig
 * @see https://firebase.google.com/docs/remote-config
 */

import { app, isFirebaseConfigured } from '../config/firebase';
import { REMOTE_CONFIG_DEFAULTS, STORAGE_KEYS } from '../config/constants';

let remoteConfigInstance = null;
let configValues = { ...REMOTE_CONFIG_DEFAULTS };

/**
 * Initialize Firebase Remote Config with defaults and fetch fresh values
 * @returns {Promise<boolean>} Whether initialization succeeded
 */
export const initRemoteConfig = async () => {
  if (!isFirebaseConfigured || !app) {
    loadCachedConfig();
    return false;
  }

  try {
    const { getRemoteConfig, fetchAndActivate, getValue } = await import('firebase/remote-config');
    remoteConfigInstance = getRemoteConfig(app);

    // Set minimum fetch interval (12 hours for production, 0 for dev)
    remoteConfigInstance.settings = {
      minimumFetchIntervalMillis: import.meta.env.DEV ? 0 : 43200000,
      fetchTimeoutMillis: 10000,
    };

    // Set defaults before fetching
    remoteConfigInstance.defaultConfig = REMOTE_CONFIG_DEFAULTS;

    // Fetch and activate remote values
    await fetchAndActivate(remoteConfigInstance);

    // Read all config values
    const keys = Object.keys(REMOTE_CONFIG_DEFAULTS);
    keys.forEach((key) => {
      try {
        const val = getValue(remoteConfigInstance, key);
        if (val && val.asString()) {
          const raw = val.asString();
          // Attempt to parse booleans/numbers
          if (raw === 'true') configValues[key] = true;
          else if (raw === 'false') configValues[key] = false;
          else if (!isNaN(Number(raw)) && raw !== '') configValues[key] = Number(raw);
          else configValues[key] = raw;
        }
      } catch {
        // Keep default for this key
      }
    });

    // Cache fetched values
    cacheConfig(configValues);

    if (import.meta.env.DEV) {
      console.debug('[RemoteConfig] Loaded:', configValues);
    }

    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[RemoteConfig] Init failed, using defaults:', error.message);
    }
    loadCachedConfig();
    return false;
  }
};

/**
 * Get a Remote Config value by key
 * @param {string} key - Config key (from REMOTE_CONFIG_DEFAULTS)
 * @returns {*} Config value or default
 */
export const getConfigValue = (key) => {
  return configValues[key] ?? REMOTE_CONFIG_DEFAULTS[key] ?? null;
};

/**
 * Get all current config values
 * @returns {Object} All config key-value pairs
 */
export const getAllConfigValues = () => {
  return { ...configValues };
};

/**
 * Cache config to localStorage for offline fallback
 * @param {Object} values - Config values to cache
 */
const cacheConfig = (values) => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.REMOTE_CONFIG_CACHE,
      JSON.stringify({ values, timestamp: Date.now() })
    );
  } catch {
    // Storage full — ignore
  }
};

/**
 * Load cached config from localStorage
 */
const loadCachedConfig = () => {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.REMOTE_CONFIG_CACHE);
    if (cached) {
      const { values } = JSON.parse(cached);
      if (values) {
        configValues = { ...REMOTE_CONFIG_DEFAULTS, ...values };
      }
    }
  } catch {
    // Invalid cache — use defaults
  }
};
