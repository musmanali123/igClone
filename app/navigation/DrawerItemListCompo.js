import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import fontFamily from '../styles/fontFamily';
import {useTheme} from '../themes/ThemeContext';

const DrawerItemListCompo = ({image, title = '', onPress, style}) => {
  const {theme} = useTheme();
  return (
    <TouchableOpacity
      style={{...styles.itemContainer, ...style}}
      activeOpacity={0.5}
      onPress={onPress}>
      <Image
        source={image}
        style={[styles.iconStyle, {tintColor: theme.text}]}
      />
      <Text style={[styles.textStyle, {color: theme.text}]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  textStyle: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    marginLeft: 12,
  },
});

export default DrawerItemListCompo;
