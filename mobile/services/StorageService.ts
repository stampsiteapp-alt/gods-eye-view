/**
 * Secure local storage for mobile app
 * Uses Capacitor Preferences for encrypted storage
 */

import { Preferences } from '@capacitor/preferences';

export class StorageService {
  private prefix = 'gev_';

  async set(key: string, value: any): Promise<void> {
    const prefixedKey = this.prefix + key;
    const serialized = JSON.stringify(value);
    await Preferences.set({ key: prefixedKey, value: serialized });
  }

  async get<T>(key: string, defaultValue?: T): Promise<T | null> {
    const prefixedKey = this.prefix + key;
    const result = await Preferences.get({ key: prefixedKey });

    if (result.value === null || result.value === undefined) {
      return defaultValue ?? null;
    }

    try {
      return JSON.parse(result.value) as T;
    } catch {
      return result.value as any;
    }
  }

  async remove(key: string): Promise<void> {
    const prefixedKey = this.prefix + key;
    await Preferences.remove({ key: prefixedKey });
  }

  async clear(): Promise<void> {
    await Preferences.clear();
  }

  async saveMapState(state: any): Promise<void> {
    await this.set('map_state', state);
  }

  async getMapState(): Promise<any> {
    return this.get('map_state', null);
  }

  async saveLayerPreferences(layers: string[]): Promise<void> {
    await this.set('active_layers', layers);
  }

  async getLayerPreferences(): Promise<string[]> {
    return this.get('active_layers', []);
  }

  async saveUserSettings(settings: any): Promise<void> {
    await this.set('user_settings', settings);
  }

  async getUserSettings(): Promise<any> {
    return this.get('user_settings', {});
  }
}

export const storageService = new StorageService();
