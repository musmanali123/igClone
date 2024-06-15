import {View, Text, Image, StyleSheet, Platform} from 'react-native';
import React from 'react';
import ScreenComponent from '../components/ScreenComponent';
import {useTheme} from '../themes/ThemeContext';
import fontFamily from '../styles/fontFamily';
const SplashScreen = () => {
  const {theme, isDarkMode} = useTheme();
  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.loginBackground}}>
        <View
          style={[styles.container, {backgroundColor: theme.loginBackground}]}>
          <View />
          <Image
            source={require('../assets/instagram.png')}
            style={styles.logo}
          />
          <Text
            style={[
              styles.bottonText,
              {
                color: isDarkMode ? 'white' : theme.blue,
                paddingBottom: Platform.OS === 'android' ? 24 : 4,
              },
            ]}>
            From Meta
          </Text>
        </View>
      </ScreenComponent>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  bottonText: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
  },
});

export default SplashScreen;
