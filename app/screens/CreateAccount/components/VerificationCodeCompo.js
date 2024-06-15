import {View, Text} from 'react-native';
import React, {useState} from 'react';
import colors from '../../../styles/colors';
import TextInputSignUpCompo from './TextInputSignUpCompo';
import ButtonComponent from './ButtonComponent';
import styles from '../CommonSignUpStyle';

const VerificationCodeCompo = ({
  fullName,
  setFullName,
  selectedIndex,
  setSelectedIndex,
  loading,
  setLoading,
}) => {
  const [fullNameError, setFullNameError] = useState(false);
  const [fullNameErrorText, setFullNameErrorText] = useState('');

  const handleNextScreen = () => {
    if (fullName == '') {
      setFullNameError(true);
      setFullNameErrorText('Full Name is required!');
      return null;
    } else {
      setFullNameError(false);
      setFullNameErrorText('');
    }
    setSelectedIndex(selectedIndex + 1);
  };
  return (
    <View>
      <Text style={styles.heading}>What's your name?</Text>
      <TextInputSignUpCompo
        label="Full name"
        value={fullName}
        onChangeText={text => {
          setFullName(text);
          if (text.length > 0) {
            setFullNameError(false);
            setFullNameErrorText('');
          }
        }}
        clearIcon={
          fullName.length > 0 ? require('../../../assets/close.png') : null
        }
        onPressClear={() => setFullName('')}
      />
      {fullNameError ? (
        <Text style={styles.errorText}>{fullNameErrorText}</Text>
      ) : null}
      <View style={{marginTop: 20}}>
        <ButtonComponent title="Next" onPress={handleNextScreen} />
      </View>
    </View>
  );
};

export default VerificationCodeCompo;
