import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useColorScheme} from 'react-native';
import {lightTheme, darkTheme} from './themeColors';

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const defaultTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(defaultTheme == 'dark');
  let isMounted = false;
  useEffect(() => {
    isMounted = true;
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (isMounted && savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme from AsyncStorage:', error);
      }
    };

    loadTheme();
    return () => (isMounted = false);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    // Save the updated theme in AsyncStorage
    AsyncStorage.setItem('theme', newMode ? 'dark' : 'light').catch(error => {
      console.error('Error saving theme to AsyncStorage:', error);
    });
  };

  const theme = isDarkMode ? darkTheme : lightTheme; // Define your light and dark themes

  return (
    <ThemeContext.Provider value={{isDarkMode, toggleTheme, theme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
