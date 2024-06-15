import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useTheme} from '../../../themes/ThemeContext';

const ChatSearchTopCompo = ({
  onPress,
  searchText,
  setSearchText,
  showCrossIcon,
  setShowCrossIcon,
}) => {
  const {theme} = useTheme();
  return (
    <View style={[styles.container, {borderBottomColor: theme.gray}]}>
      <TouchableOpacity style={styles.backIconContainer} onPress={onPress}>
        <Image
          source={require('../../../assets/back.png')}
          style={[styles.backIcon, {tintColor: theme.text}]}
        />
      </TouchableOpacity>
      <TextInput
        placeholder="Search"
        placeholderTextColor={theme.gray}
        style={[styles.input, {color: theme.text}]}
        value={searchText}
        onChangeText={text => {
          if (text.trim().length) {
            setSearchText(text);
            setShowCrossIcon(true);
          } else {
            setSearchText('');
            setShowCrossIcon(false);
          }
        }}
        autoCapitalize="none"
      />
      {showCrossIcon && (
        <TouchableOpacity
          style={{
            paddingVertical: 6,
            paddingHorizontal: 14,
            alignItems: 'center',
          }}
          onPress={() => {
            setSearchText('');
            setShowCrossIcon(false);
          }}>
          <Image
            source={require('../../../assets/close.png')}
            style={[styles.closeIconStyle, {tintColor: theme.commentGrayText}]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 0.3,
    paddingTop: 6,
  },
  backIconContainer: {
    paddingHorizontal: 12,
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
    paddingHorizontal: 8,
    fontSize: 14,
  },
  closeIconStyle: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },
});

export default ChatSearchTopCompo;
