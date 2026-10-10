/**
 * API Service for mobile app
 * Handles all provider integration and secure credential passing
 */

import { MOBILE_CONFIG } from '../config';

interface ApiProvider {
  name: string;
  enabled: boolean;
  endpoint?: string;
  key?: string;
}

export class ApiService {
  private baseUrl: string;
  private timeout: number;
  private providers: Map<string, ApiProvider>;

  constructor() {
    this.baseUrl = MOBILE_CONFIG.api.baseUrl;
    this.timeout = MOBILE_CONFIG.api.timeout;
    this.providers = this.initializeProviders();
  }

  private initializeProviders(): Map<string, ApiProvider> {
    const providers = new Map<string, ApiProvider>();

    providers.set('openai', {
      name: 'OpenAI Realtime',
      enabled: MOBILE_CONFIG.providers.openai.enabled,
    });

    providers.set('cesium', {
      name: 'Cesium Ion',
      enabled: MOBILE_CONFIG.providers.cesium.enabled,
    });

    providers.set('googleMaps', {
      name: 'Google Maps',
      enabled: MOBILE_CONFIG.providers.googleMaps.enabled,
    });

    providers.set('aisstream', {
      name: 'AISStream',
      enabled: MOBILE_CONFIG.providers.aisstream.enabled,
      endpoint: 'https://api.aisstream.io',
    });

    providers.set('firms', {
      name: 'NASA FIRMS',
      enabled: MOBILE_CONFIG.providers.firms.enabled,
      endpoint: 'https://firms.modaps.eosdis.nasa.gov',
    });

    providers.set('tomtom', {
      name: 'TomTom',
      enabled: MOBILE_CONFIG.providers.tomtom.enabled,
      endpoint: 'https://api.tomtom.com',
    });

    providers.set('opensky', {
      name: 'OpenSky Network',
      enabled: MOBILE_CONFIG.providers.opensky.enabled,
      endpoint: 'https://opensky-network.org/api',
    });

    return providers;
  }

  /**
   * Get enabled provider info for mobile dashboard
   */
  getEnabledProviders(): ApiProvider[] {
    return Array.from(this.providers.values()).filter((p) => p.enabled);
  }

  /**
   * Generic fetch with timeout and retry logic
   */
  async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<{ data?: T; error?: string; status: number }> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MOBILE_CONFIG.api.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          this.timeout
        );

        const url = endpoint.startsWith('http')
          ? endpoint
          : `${this.baseUrl}${endpoint}`;

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        return { data, status: response.status };
      } catch (error) {
        lastError = error as Error;
        if (attempt < MOBILE_CONFIG.api.retryAttempts - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }

    return {
      error: lastError?.message || 'Unknown error',
      status: 0,
    };
  }

  /**
   * Get live flights from OpenSky
   */
  async getLiveFlights(bounds?: {
    lamin: number;
    lamax: number;
    lomin: number;
    lomax: number;
  }) {
    const params = bounds
      ? `?lamin=${bounds.lamin}&lamax=${bounds.lamax}&lomin=${bounds.lomin}&lomax=${bounds.lomax}`
      : '';

    return this.fetch(
      `https://opensky-network.org/api/states/all${params}`
    );
  }

  /**
   * Get live vessel positions from AISStream
   */
  async getLiveVessels() {
    if (!MOBILE_CONFIG.providers.aisstream.enabled) {
      return { error: 'AISStream not configured', status: 0 };
    }
    return this.fetch('/api/vessels');
  }

  /**
   * Get active fires from NASA FIRMS
   */
  async getActiveFires(bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) {
    return this.fetch('/api/firms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bounds),
    });
  }

  /**
   * Get traffic flow from TomTom
   */
  async getTrafficFlow(lat: number, lon: number, zoom: number) {
    if (!MOBILE_CONFIG.providers.tomtom.enabled) {
      return { error: 'TomTom not configured', status: 0 };
    }
    return this.fetch(
      `/api/traffic?lat=${lat}&lon=${lon}&zoom=${zoom}`
    );
  }

  /**
   * Get satellite positions
   */
  async getSatellites() {
    return this.fetch('/api/satellites');
  }

  /**
   * Stream voice audio for OpenAI Realtime
   */
  async streamVoice(audioBlob: Blob) {
    if (!MOBILE_CONFIG.providers.openai.enabled) {
      return { error: 'OpenAI not configured', status: 0 };
    }

    const formData = new FormData();
    formData.append('audio', audioBlob);

    return this.fetch('/api/voice/stream', {
      method: 'POST',
      body: formData,
    });
  }
}

export const apiService = new ApiService();
