import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {LogBox} from 'react-native';
import MainNavigator from './app/navigation/MainNavigator';
import {ThemeProvider} from './app/themes/ThemeContext';
import SplashScreen from './app/screens/SplashScreen';
import {
  requestUserPermission,
  notificationListner,
} from './app/utils/notificationServices';
import DeepLinkHandler from './app/components/DeepLinkHandler';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  LogBox.ignoreLogs([
    'new NativeEventEmitter',
    'FinishedLoading',
    'FinishedLoadingURL',
    'FinishedPlaying',
  ]);
  useEffect(() => {
    requestUserPermission();
    notificationListner();
    setTimeout(() => {
      setSplashDone(true);
    }, 2000);
  }, []);
  return (
    <>
      <ThemeProvider>
        {splashDone ? <MainNavigator /> : <SplashScreen />}
        <DeepLinkHandler />
      </ThemeProvider>
    </>
  );
}
  