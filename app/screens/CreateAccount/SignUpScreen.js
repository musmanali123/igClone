import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import colors from '../../styles/colors';
import TopSignUpCompo from './components/TopSignUpCompo';
import GetUserNameComponent from './components/GetUserNameComponent';
import GetUserPasswordComponent from './components/GetUserPasswordComponent';
import GetUserDateOfBirthCompo from './components/GetUserDateOfBirthCompo';
import navigationStrings from '../../navigation/navigationStrings';
import GetUserEmailOrPhoneCompo from './components/GetUserEmailOrPhoneCompo';
import {useTheme} from '../../themes/ThemeContext';
import fontFamily from '../../styles/fontFamily';
import GetUserProfileImage from './components/GetUserProfileImage';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userProfilePicUrl, setUserProfilePicUrl] = useState('');
  const [isEmailSignIn, setIsEmailSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const {theme} = useTheme();
  const handleBackScreens = () => {
    if (selectedIndex == 0) {
      navigation.navigate(navigationStrings.LOGIN_SCREEN);
    } else if (selectedIndex == 10) {
      return null;
    } else {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.loginBackground}}>
        <View style={{backgroundColor: theme.loginBackground, flex: 1}}>
          <View style={styles.container}>
            <TopSignUpCompo onPress={handleBackScreens} />
            {selectedIndex == 0 && (
              <GetUserNameComponent
                fullName={fullName}
                setFullName={setFullName}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                loading={loading}
                setLoading={setLoading}
              />
            )}
            {selectedIndex == 1 && (
              <GetUserPasswordComponent
                password={password}
                setPassword={setPassword}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                loading={loading}
                setLoading={setLoading}
              />
            )}
            {selectedIndex == 2 && (
              <GetUserDateOfBirthCompo
                dateOfBirth={dateOfBirth}
                setDateOfBirth={setDateOfBirth}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                loading={loading}
                setLoading={setLoading}
              />
            )}
            {selectedIndex == 3 && (
              <GetUserProfileImage
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                setUserProfilePicUrl={setUserProfilePicUrl}
                userProfilePicUrl={userProfilePicUrl}
              />
            )}
            {selectedIndex == 4 && (
              <GetUserEmailOrPhoneCompo
                email={email}
                setEmail={setEmail}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                password={password}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                isEmailSignIn={isEmailSignIn}
                setIsEmailSignIn={setIsEmailSignIn}
                setIsCreated={setIsCreated}
                fullName={fullName}
                dateOfBirth={dateOfBirth}
                userProfilePicUrl={userProfilePicUrl}
              />
            )}
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(navigationStrings.LOGIN_SCREEN)
              }>
              <Text style={styles.footerText}>Already have an account?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenComponent>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  footer: {
    flex: 0.07,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.blue,
    fontFamily: fontFamily.semiBold,
  },
});
