/**
 * Home Screen for mobile app
 * Entry point after splash screen
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { apiService } from '../services/ApiService';
import { storageService } from '../services/StorageService';
import { MOBILE_CONFIG } from '../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MOBILE_CONFIG.ui.backgroundColor,
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: MOBILE_CONFIG.ui.primaryColor,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#0a1f2e',
    borderRadius: 8,
    borderColor: MOBILE_CONFIG.ui.primaryColor,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MOBILE_CONFIG.ui.primaryColor,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#ccc',
    marginVertical: 4,
  },
  enabledBadge: {
    color: '#00ff00',
  },
  disabledBadge: {
    color: '#ff6b6b',
  },
});

export const HomeScreen: React.FC = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [mapState, setMapState] = useState<any>(null);

  useEffect(() => {
    const initializeApp = async () => {
      // Get enabled providers
      const enabledProviders = apiService.getEnabledProviders();
      setProviders(enabledProviders);

      // Load saved map state
      const savedState = await storageService.getMapState();
      setMapState(savedState);
    };

    initializeApp();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.header}>Gods Eye View Mobile</Text>

        {/* Map Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Globe</Text>
          <Text style={styles.statusText}>Cesium.js 3D Earth</Text>
          <Text style={styles.statusText}>Press to launch interactive map</Text>
        </View>

        {/* Active Layers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Layers</Text>
          <Text style={styles.statusText}>✈️ Live Flights</Text>
          <Text style={styles.statusText}>🚢 Vessels</Text>
          <Text style={styles.statusText}>🛰️ Satellites</Text>
          <Text style={styles.statusText}>🌍 Earthquakes</Text>
          <Text style={styles.statusText}>🔥 Active Fires</Text>
        </View>

        {/* Providers Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Providers</Text>
          {providers.length > 0 ? (
            providers.map((provider) => (
              <Text
                key={provider.name}
                style={[
                  styles.statusText,
                  provider.enabled
                    ? styles.enabledBadge
                    : styles.disabledBadge,
                ]}
              >
                {provider.enabled ? '✓' : '✗'} {provider.name}
              </Text>
            ))
          ) : (
            <Text style={styles.statusText}>
              Loading provider status...
            </Text>
          )}
        </View>

        {/* Voice Control */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voice Control</Text>
          <Text style={styles.statusText}>
            {MOBILE_CONFIG.providers.openai.enabled
              ? '✓ OpenAI Realtime Connected'
              : '✗ OpenAI API Key Required'}
          </Text>
          <Text style={styles.statusText}>
            Say: "Take me to New York"
          </Text>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Text style={styles.statusText}>Theme: {MOBILE_CONFIG.ui.theme}</Text>
          <Text style={styles.statusText}>
            App Version: {MOBILE_CONFIG.app.version}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
