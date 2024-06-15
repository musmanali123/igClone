import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';
import {useTheme} from '../../../themes/ThemeContext';
import fontFamily from '../../../styles/fontFamily';

const TextInputSignUpCompo = ({
  label = '',
  placeholder = '',
  value = '',
  onChangeText,
  secureTextEntry = false,
  clearIcon = null,
  onPressClear,
  eyeShow = false,
  onPressSecure,
  ...props
}) => {
  const {theme} = useTheme();
  return (
    <View
      style={[
        styles.inputContainer,
        {borderColor: theme.light, backgroundColor: theme.authInputColor},
      ]}>
      <View style={{flex: 1}}>
        <Text style={styles.labelStyle}>{label}</Text>
        <TextInput
          style={[styles.input, {color: theme.text}]}
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          {...props}
        />
      </View>
      <View style={styles.inputMainContainer}>
        {clearIcon !== null ? (
          <TouchableOpacity onPress={onPressClear}>
            <Image
              source={clearIcon}
              style={[styles.clearIconStyle, {tintColor: theme.text}]}
            />
          </TouchableOpacity>
        ) : null}
        {eyeShow ? (
          secureTextEntry ? (
            <TouchableOpacity onPress={onPressSecure}>
              <Image
                source={require('../../../assets/view.png')}
                style={styles.showHideIcon}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onPressSecure}>
              <Image
                source={require('../../../assets/hide.png')}
                style={styles.showHideIcon}
              />
            </TouchableOpacity>
          )
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.signUpBordercolor,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors.signUpInput,
    flexDirection: 'row',
  },
  input: {
    paddingVertical: 4,
    fontSize: 14,
    color: colors.black,
    paddingRight: 6,
  },
  inputMainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelStyle: {
    fontSize: 14,
    color: colors.signUpBordercolor,
    fontFamily: fontFamily.medium,
  },
  clearIconStyle: {
    width: 14,
    height: 14,
  },
  showHideIcon: {
    width: 22,
    height: 22,
    tintColor: colors.signUpBordercolor,
  },
});

export default TextInputSignUpCompo;
