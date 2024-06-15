import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../../styles/colors';
import TextInputSignUpCompo from './TextInputSignUpCompo';
import ButtonComponent from './ButtonComponent';
import {useTheme} from '../../../themes/ThemeContext';
import AuthStyles from '../../../styles/AuthStyles';
const GetUserPasswordComponent = ({
  password = '',
  setPassword,
  selectedIndex,
  setSelectedIndex,
  loading,
  setLoading,
}) => {
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState('');
  const [showEye, setShowEye] = useState(true);
  const {theme} = useTheme();
  const styles = AuthStyles(theme);
  const handleNextScreen = () => {
    if (password == '') {
      setPasswordError(true);
      setPasswordErrorText('Password is Empty!');
      return null;
    } else {
      setPasswordError(false);
      setPasswordErrorText('');
    }
    if (password.length < 6) {
      setPasswordError(true);
      setPasswordErrorText('Password is less then 6 digits!');
      return null;
    } else {
      setPasswordError(false);
      setPasswordErrorText('');
    }
    setSelectedIndex(selectedIndex + 1);
  };
  return (
    <View>
      <Text style={styles.heading}>Create a password</Text>
      <Text style={styles.descText}>
        Create a password with at least 6 letters or numbers. It should be
        something that other can't guess.
      </Text>
      <TextInputSignUpCompo
        label="Password"
        value={password}
        onChangeText={text => {
          setPassword(text);
          if (text.length > 0) {
            setPasswordError(false);
            setPasswordErrorText('');
          }
        }}
        secureTextEntry={showEye}
        eyeShow={true}
        onPressSecure={() => setShowEye(!showEye)}
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordErrorText}</Text>
      ) : null}
      <View style={{marginTop: 20}}>
        <ButtonComponent title="Next" onPress={handleNextScreen} />
      </View>
    </View>
  );
};

export default GetUserPasswordComponent;
