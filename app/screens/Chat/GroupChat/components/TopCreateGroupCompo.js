import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../../themes/ThemeContext';
import colors from '../../../../styles/colors';

const TopCreateGroupCompo = ({onPress, groupName, setGroupName}) => {
  const {theme} = useTheme();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.backIconContainer}>
        <Image
          source={require('../../../../assets/back.png')}
          style={[styles.backIcon, {tintColor: theme.text}]}
        />
      </TouchableOpacity>
      <TextInput
        placeholder="Name your group"
        placeholderTextColor={theme.gray}
        style={[styles.input, {color: theme.text}]}
        value={groupName}
        onChangeText={text => {
          if (text.trim().length) {
            setGroupName(text);
          } else {
            setGroupName('');
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backIconContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    paddingHorizontal: 14,
  },
});

export default TopCreateGroupCompo;
