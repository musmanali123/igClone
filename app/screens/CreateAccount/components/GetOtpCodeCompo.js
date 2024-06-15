import {View, Text, Alert} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import colors from '../../../styles/colors';
import TextInputSignUpCompo from './TextInputSignUpCompo';
import ButtonComponent from './ButtonComponent';
import useAuth from '../../../auth/useAuth';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../../navigation/navigationStrings';
import firestore from '@react-native-firebase/firestore';
import AuthStyles from '../../../styles/AuthStyles';
import {useTheme} from '../../../themes/ThemeContext';

const GetOtpCodeCompo = ({
  verificationId,
  handleUploadUserData,
  phoneNumber,
}) => {
  const [loading, setLoading] = useState(false);
  const {logout, setUser} = useAuth();
  const navigation = useNavigation();
  const {theme} = useTheme();
  const styles = AuthStyles(theme);
  const [inputOtp, setInputOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [otpErrorText, setOtpErrorText] = useState('');

  const handleOtpVerifyCode = async () => {
    if (inputOtp.length == 0) {
      setOtpError(true);
      setOtpErrorText('OTP is not empty!');
      return null;
    } else if (inputOtp.length < 6) {
      setOtpError(true);
      setOtpErrorText(
        'Enter valid 6 number OTP code that is send to your number',
      );
      return null;
    } else {
      try {
        setLoading(true);
        const credential = auth.PhoneAuthProvider.credential(
          verificationId,
          inputOtp,
        );
        await auth().signInWithCredential(credential);
        console.log('User OTP verify successfully.');
        setLoading(false);
        const res = await handleUploadUserData();
        if (res) {
          setLoading(false);
          setUser(auth()?.currentUser);
        } else {
          setLoading(false);
          Alert.alert(
            'Try agin later!',
            'Some thing went wrong while creating your account.',
          );
        }
      } catch (error) {
        if (error.code === 'auth/invalid-verification-code') {
          // Handle the case of an invalid OTP
          setOtpError(true);
          setOtpErrorText('Invalid OTP. Please enter a valid OTP.');
          setLoading(false);
        } else {
          setOtpError(true);
          setOtpErrorText('An error occurred. Please try again later.');
          console.log('ERROR in verify otp of phone number: ', error);
          setLoading(false);
        }
      }
    }
  };

  return (
    <View>
      <Text style={styles.heading}>Enter the confirmation code</Text>
      <Text style={styles.descText}>
        Enter the To confirm your account, enter the code that send to your
        phone number {phoneNumber}
      </Text>
      <TextInputSignUpCompo
        label="Confirmation code"
        value={inputOtp}
        onChangeText={text => {
          setInputOtp(text);
          if (text.length > 0) {
            setOtpError(false);
            setOtpErrorText('');
          }
        }}
        clearIcon={
          inputOtp.length > 0 ? require('../../../assets/close.png') : null
        }
        onPressClear={() => setInputOtp('')}
        autoCapitalize="none"
      />
      {otpError ? <Text style={styles.errorText}>{otpErrorText}</Text> : null}
      <View style={{marginTop: 24}}>
        <ButtonComponent
          title="Next"
          onPress={handleOtpVerifyCode}
          loading={loading}
        />
      </View>
      <View style={{marginTop: 14}}>
        <ButtonComponent
          title="I don't receive the code"
          onPress={() => {}}
          style={{
            backgroundColor: theme.loginBackground,
            borderWidth: 1,
            borderColor: theme.light,
          }}
          textStyle={{color: theme.text}}
        />
      </View>
    </View>
  );
};

export default GetOtpCodeCompo;
