import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import fontFamily from '../../../../styles/fontFamily';
import {useTheme} from '../../../../themes/ThemeContext';
import colors from '../../../../styles/colors';
import ChatStyle from '../../../style/ChatStyle';

const ShowAllUsersCreateGroupCompo = ({item, onPress, selectedUsers}) => {
  const {theme} = useTheme();
  const globalStyles = ChatStyle(theme);
  return (
    <>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.5}
        onPress={onPress}>
        <View
          style={styles.userDataContainer}
          activeOpacity={0.6}
          onPress={() => {}}>
          <FastImage
            style={styles.profileImage}
            source={{
              uri:
                item.imageUrl !== ''
                  ? item.imageUrl
                  : 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png',
            }}
          />
          <View style={{marginLeft: 20}}>
            <Text style={[styles.userNameStyle, {color: theme.text}]}>
              {item?.fullName}
            </Text>
            {item.bio !== '' && (
              <Text
                style={[styles.bioText, {color: theme.userFollowerGrayText}]}>
                {item?.bio.length > 20
                  ? item?.bio.slice(0, 20) + ' ...'
                  : item?.bio}
              </Text>
            )}
          </View>
        </View>
        <View
          style={
            selectedUsers.includes(item.id)
              ? styles.tickIconContainerFill
              : globalStyles.tickIconContainerOutline
          }>
          {selectedUsers.includes(item.id) && (
            <Image
              source={require('../../../../assets/check.png')}
              style={[styles.tickIcon, {tintColor: theme.background}]}
            />
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userNameStyle: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
  },
  bioText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  tickIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  tickIconContainerFill: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ShowAllUsersCreateGroupCompo;
