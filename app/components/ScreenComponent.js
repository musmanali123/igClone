import {StyleSheet, SafeAreaView, Platform, StatusBar} from 'react-native';
import React from 'react';
import {useTheme} from '../themes/ThemeContext';

export default function ScreenComponent({style, children, statusBarBg = null}) {
  const {theme, isDarkMode} = useTheme();
  return (
    <>
      <StatusBar
        backgroundColor={statusBarBg == null ? theme.background : statusBarBg}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <SafeAreaView style={[styles.screen, style]}>{children}</SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
});
