import {View, Text, Switch} from 'react-native';
import React, {useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import {useTheme} from '../themes/ThemeContext';
import SettingStyle from './style/SettingStyle';
import {useNavigation} from '@react-navigation/native';

export default function SettingScreen() {
  const {theme, toggleTheme, isDarkMode} = useTheme();
  const styles = SettingStyle(theme);
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title="Setting"
          onPress={() => navigation.goBack()}
        />
        <View style={{alignItems: 'flex-end', paddingHorizontal: 20}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.themeModeText}>
              {isDarkMode ? 'Dark' : 'Light'} Theme
            </Text>
            <Switch
              trackColor={{false: '#EDF2FE', true: '#12212F'}}
              thumbColor={isEnabled ? '#12212F' : '#EDF2FE'}
              ios_backgroundColor="#12212F"
              onValueChange={toggleSwitch}
              value={isDarkMode}
              onChange={toggleTheme}
            />
          </View>
        </View>
      </ScreenComponent>
    </>
  );
}
