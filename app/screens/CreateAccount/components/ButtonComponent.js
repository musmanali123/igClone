import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';

const ButtonComponent = ({
  title = '',
  style,
  onPress,
  textStyle,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      style={{...styles.buttonContainer, ...style}}
      activeOpacity={0.5}
      onPress={onPress}
      disabled={loading}>
      {loading ? (
        <ActivityIndicator size={16} color={colors.white} />
      ) : (
        <Text style={{...styles.buttonText, ...textStyle}}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.blue,
    borderRadius: 22,
    alignItems: 'center',
    height: 46,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: colors.white,
    fontFamily: fontFamily.medium,
  },
});

export default ButtonComponent;
