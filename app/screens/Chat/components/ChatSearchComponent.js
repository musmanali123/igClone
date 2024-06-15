import {View, Text, StyleSheet, Image, TextInput} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';

const ChatSearchComponent = ({value = '', onChangeText, onSubmitEditing}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/ic_search.png')}
        style={styles.iconStyle}
      />
      <TextInput
        style={styles.inputStyle}
        placeholder="Search"
        placeholderTextColor={colors.gray}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderColor,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconStyle: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    marginRight: 10,
  },
  inputStyle: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
    fontFamily: 'UberMove-Medium',
    paddingVertical: 10,
  },
});

export default ChatSearchComponent;
