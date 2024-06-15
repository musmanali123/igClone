import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import colors from '../styles/colors';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../navigation/navigationStrings';
import useAuth from '../auth/useAuth';
import auth from '@react-native-firebase/auth';
import {useTheme} from '../themes/ThemeContext';
import fontFamily from '../styles/fontFamily';
import {handleGoogleSignIn} from '../utils/googleSignIn';

export default function LoginScreen() {
  const {theme} = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailVerify, setShowEmailVerify] = useState(false);
  const {user, setUser, logout} = useAuth();

  const validateEmail = email => {
    let pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(String(email).toLowerCase());
  };

  const EmailVerifyCheck = async result => {
    try {
      if (result.user.emailVerified) {
        setEmail('');
        setPassword('');
        setLoading(false);
        setUser(auth().currentUser);
        setShowEmailVerify(false);
      } else {
        setShowEmailVerify(true);
        await auth().currentUser.sendEmailVerification();
        setLoading(false);
        logout();
        Alert.alert('Please Verify Your Email to Login!');
      }
    } catch (error) {
      setLoading(false);
      console.log('error in verify user email in login: : ', error);
    }
  };

  const handleLogin = () => {
    setEmailError('');
    setPasswordError('');
    let emailValid = false;

    if (email === '') {
      setEmailError('Email is required!');
    } else {
      if (!validateEmail(email)) {
        setEmailError('Email is invalid!');
        emailValid = false;
      } else {
        setEmailError('');
        emailValid = true;
      }
    }

    if (password === '') {
      setPasswordError('Password is required!');
    } else if (password.length < 6) {
      setPasswordError('Password is invalid!');
    } else {
      if (emailValid && password.length > 5) {
        setLoading(true);
        auth()
          .signInWithEmailAndPassword(email, password)
          .then(result => {
            EmailVerifyCheck(result);
            // setUser(auth().currentUser);
          })
          .catch(error => {
            setLoading(false);

            if (error.code === 'auth/user-not-found') {
              setEmailError('Invalid Email please check your email');
              setLoading(false);
            }
            if (error.code === 'auth/invalid-email') {
              setEmailError('Email is invalid!');
              setLoading(false);
            }
            if (error.code === 'auth/wrong-password') {
              setPasswordError('Password is invalid!');
              setLoading(false);
            }
            if (error.code === 'auth/invalid-credential') {
              setLoading(false);
              Alert.alert('Please enter valid email and password!');
            }

            if (error.code === 'auth/internal-error') {
              setLoading(false);
              Alert.alert('Please enter valid email and password!');
              // setErr(
              //   'please try again later make sure to enter correct email and password',
              // );
            }
            console.log('Error while Login: ', error);
          });
      }
    }
  };

  const handleSignINWithGoogle = async () => {
    try {
      const res = await handleGoogleSignIn();
      if (res) {
        setUser(auth().currentUser);
      }
    } catch (error) {
      console.log(
        'Error in Login Screen inside handleSignINWithGoogle: ',
        error,
      );
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.loginBackground}}>
        {/* <ScrollView style={{flex: 1}}> */}
        <View
          style={[styles.container, {backgroundColor: theme.loginBackground}]}>
          {/* <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : null}> */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.mainContainer}>
              <View style={{marginTop: '20%'}} />
              {/* <View style={{flex: 0.3}} /> */}
              <Image
                source={require('../assets/logo.png')}
                style={[styles.logo, {tintColor: theme.text}]}
              />
              <View style={styles.inputContainer}>
                {showEmailVerify && (
                  <Text
                    style={[
                      styles.errorText,
                      {
                        marginBottom: 6,
                        alignSelf: 'center',
                        color: theme.red,
                      },
                    ]}>
                    Please Verify Your Email to Login!
                  </Text>
                )}
                <TextInput
                  style={[styles.input, {color: theme.text}]}
                  placeholder="Email"
                  value={email}
                  onChangeText={text => setEmail(text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={theme.gray}
                />
                {emailError !== '' && (
                  <Text style={[styles.errorText, {color: theme.red}]}>
                    {emailError}
                  </Text>
                )}
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={[styles.passwordInput, {color: theme.text}]}
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry={isShowPassword}
                    placeholderTextColor={theme.gray}
                  />
                  {password.length > 0 ? (
                    <TouchableOpacity
                      onPress={() => setIsShowPassword(!isShowPassword)}>
                      <Image
                        source={
                          isShowPassword
                            ? require('../assets/view.png')
                            : require('../assets/hide.png')
                        }
                        style={[styles.showHideIcon, {tintColor: theme.light}]}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
                {passwordError !== '' && (
                  <Text style={[styles.errorText, {color: theme.red}]}>
                    {passwordError}
                  </Text>
                )}
              </View>
              <View style={styles.fogotPassContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(navigationStrings.FORGOT_PASSWORD)
                  }>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={handleLogin}>
                  {loading ? (
                    <ActivityIndicator color={colors.white} size={22} />
                  ) : (
                    <Text style={styles.buttonText}>Login</Text>
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={handleSignINWithGoogle}>
                <Image
                  style={styles.facebookIconStyle}
                  source={require('../assets/google.png')}
                />
                <Text style={styles.facebookText}>Log in with Google</Text>
              </TouchableOpacity>
              <View style={styles.OrTextContainer}>
                <View
                  style={[styles.lineStyle, {backgroundColor: theme.gray}]}
                />
                <Text style={[styles.orText, {color: theme.gray}]}>OR</Text>
                <View
                  style={[styles.lineStyle, {backgroundColor: theme.gray}]}
                />
              </View>
              <View style={styles.createAccontContainer}>
                <Text
                  style={[styles.createAccountText, {color: theme.lightText}]}>
                  Don’t have an account?
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(navigationStrings.SIGN_UP_SCREEN)
                  }>
                  <Text style={styles.signUpText}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
          {/* </KeyboardAvoidingView> */}
          <View style={[styles.footer, {borderTopColor: theme.gray}]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={[styles.buttonText, {color: theme.text}]}>
                Instagram оr Facebook
              </Text>
            </View>
          </View>
        </View>
        {/* </ScrollView> */}
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  iconBack: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  footer: {
    // flex: 0.1,
    height: 60,
    borderTopWidth: 1.2,
    borderColor: colors.gray,
    // alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: colors.borderColor,
  },
  logo: {
    width: 182,
    height: 50,
    resizeMode: 'contain',
  },
  input: {
    backgroundColor: colors.borderColor,
    width: '90%',
    height: 36,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    // marginBottom: 12,
    fontSize: 14,
    color: colors.lightBlack,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
  },
  fogotPassContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 14,
  },
  forgotText: {
    fontSize: 12,
    color: colors.blue,
    fontFamily: fontFamily.semiBold,
  },
  buttonStyle: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
    height: 44,
    borderRadius: 6,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 30,
  },
  buttonText: {
    fontSize: 14,
    color: colors.white,
  },
  facebookIconStyle: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  facebookText: {
    fontSize: 14,
    color: colors.skyBlue,
    marginLeft: 12,
    fontFamily: fontFamily.semiBold,
  },
  lineStyle: {
    height: 1,
    backgroundColor: colors.borderColor,
    flex: 1,
  },
  OrTextContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
    paddingHorizontal: 20,
  },
  orText: {
    fontSize: 14,
    color: colors.gray,
    marginHorizontal: 12,
    fontFamily: fontFamily.semiBold,
  },
  createAccontContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createAccountText: {
    fontSize: 14,
    color: colors.gray,
    fontFamily: fontFamily.medium,
  },
  signUpText: {
    fontSize: 14,
    color: colors.skyBlue,
    marginLeft: 6,
    fontFamily: fontFamily.semiBold,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 4,
  },
  passwordInputContainer: {
    width: '90%',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.borderColor,
    borderWidth: 1,
    borderColor: colors.borderColor,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 12,
  },
  passwordInput: {
    flex: 1,
    paddingRight: 6,
    paddingVertical: 3,
  },
  showHideIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.lightBlack,
  },
  toggleThemeButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
});
