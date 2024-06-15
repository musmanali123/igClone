import {View, Text, TextInput} from 'react-native';
import React from 'react';
import {useTheme} from '../../../themes/ThemeContext';
import ProfileStyle from '../../style/ProfileStyle';

const EditProfileTextInputCompo = ({
  label = '',
  value,
  onChangeText,
  placeholder = '',
  ...props
}) => {
  const {theme} = useTheme();
  const styles = ProfileStyle(theme);
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
      <Text style={{color: theme.text, flex: 0.25}}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme.profileImgBorder}
        value={value}
        onChangeText={onChangeText}
        style={{
          borderBottomWidth: 0.5,
          borderBottomColor: theme.profileImgBorder,
          flex: 1,
          paddingTop: 6,
          paddingBottom: 12,
          paddingHorizontal: 4,
          color: theme.text,
          fontSize: 14,
        }}
        {...props}
      />
    </View>
  );
};

export default EditProfileTextInputCompo;
