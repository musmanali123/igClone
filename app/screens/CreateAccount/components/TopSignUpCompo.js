import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useTheme} from '../../../themes/ThemeContext';

const TopSignUpCompo = ({onPress, style}) => {
  const {theme} = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: 10,
        ...style,
      }}>
      <TouchableOpacity
        style={styles.backIconMainContainer}
        onPress={onPress}
        activeOpacity={0.6}>
        <Image
          source={require('../../../assets/back.png')}
          style={[styles.backIcon, {tintColor: theme.text}]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  backIconMainContainer: {
    paddingVertical: 4,
    paddingRight: 6,
  },
});

export default TopSignUpCompo;
