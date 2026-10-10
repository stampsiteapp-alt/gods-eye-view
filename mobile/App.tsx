/**
 * Root React Native App Component
 * Initializes Capacitor, plugins, and navigation
 */

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { IonReactRouter } from '@ionic/react-router';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import HomeScreen from './screens/HomeScreen';
import { MOBILE_CONFIG } from './config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MOBILE_CONFIG.ui.backgroundColor,
  },
});

const App: React.FC = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Set status bar
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({
          color: MOBILE_CONFIG.ui.backgroundColor,
        });

        // Hide splash screen after a brief delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await SplashScreen.hide();
      } catch (error) {
        console.error('App initialization error:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <HomeScreen />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
