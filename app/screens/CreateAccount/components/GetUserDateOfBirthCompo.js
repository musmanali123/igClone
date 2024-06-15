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
import ShowDateBirthComopent from './ShowDateBirthComopent';
import {useTheme} from '../../../themes/ThemeContext';
import AuthStyles from '../../../styles/AuthStyles';

const GetUserDateOfBirthCompo = ({
  dateOfBirth,
  setDateOfBirth,
  selectedIndex,
  setSelectedIndex,
  loading,
  setLoading,
}) => {
  const [dateOfBirthError, setDateOfBirthError] = useState(false);
  const [dateOfBirthErrorText, setDateOfBirthErrorText] = useState('');
  const {theme} = useTheme();
  const styles = AuthStyles(theme);

  const handleNextScreen = () => {
    if (dateOfBirth == '') {
      setDateOfBirthError(true);
      setDateOfBirthErrorText('Please Select Date of birth!');
      return null;
    } else {
      setDateOfBirthError(false);
      setDateOfBirthErrorText('');
    }
    setSelectedIndex(selectedIndex + 1);
  };
  return (
    <View>
      <Text style={styles.heading}>What's your date of birth?</Text>
      <Text style={styles.descText}>
        Use your own date of birth, even if this account is for a business, a
        pet or something else. No one will see this unless you choose to share
        it.
      </Text>
      <ShowDateBirthComopent
        label="Date of birth"
        dateOfBirth={dateOfBirth}
        setDateOfBirth={setDateOfBirth}
      />
      {dateOfBirthError ? (
        <Text style={styles.errorText}>{dateOfBirthErrorText}</Text>
      ) : null}
      <View style={{marginTop: 20}}>
        <ButtonComponent title="Next" onPress={handleNextScreen} />
      </View>
    </View>
  );
};

export default GetUserDateOfBirthCompo;
