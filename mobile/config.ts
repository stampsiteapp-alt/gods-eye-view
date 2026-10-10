/**
 * Mobile App Configuration
 * Central config for mobile-specific settings, API providers, and feature flags
 */

export const MOBILE_CONFIG = {
  app: {
    name: 'Gods Eye View',
    version: '1.0.0',
    bundle: 'com.stampsiteapp.godseyeview',
  },
  api: {
    baseUrl: process.env.API_URL || 'http://localhost:4173',
    timeout: 30000,
    retryAttempts: 3,
  },
  providers: {
    openai: {
      enabled: !!process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini-realtime-preview',
    },
    cesium: {
      enabled: !!process.env.CESIUM_ION_TOKEN,
      token: process.env.CESIUM_ION_TOKEN || '',
    },
    googleMaps: {
      enabled: !!process.env.GOOGLE_MAPS_API_KEY,
      key: process.env.GOOGLE_MAPS_API_KEY || '',
    },
    aisstream: {
      enabled: !!process.env.AISSTREAM_API_KEY,
      key: process.env.AISSTREAM_API_KEY || '',
    },
    firms: {
      enabled: !!process.env.FIRMS_MAP_KEY,
      key: process.env.FIRMS_MAP_KEY || '',
    },
    tomtom: {
      enabled: !!process.env.TOMTOM_API_KEY,
      key: process.env.TOMTOM_API_KEY || '',
    },
    opensky: {
      enabled: true,
      authMode: process.env.OPENSKY_AUTH_MODE || 'anon',
    },
  },
  features: {
    voice: true,
    offline: true,
    analytics: false,
    crashes: false,
  },
  ui: {
    theme: 'dark',
    primaryColor: '#00d9ff',
    backgroundColor: '#06141b',
  },
};

export default MOBILE_CONFIG;
