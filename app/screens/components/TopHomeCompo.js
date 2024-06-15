import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../themes/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const TopHomeCompo = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [unReadNotifitions, setUnReadNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('notifications')
      .orderBy('time', 'desc')
      .onSnapshot(snap => {
        const allNotificationsData = snap.docs.map(doc => ({...doc.data()}));
        const filteredNotificationsData = allNotificationsData.filter(
          ele => ele.receiverID === auth().currentUser?.uid,
        );
        let unReadArr = [];
        filteredNotificationsData.forEach(ele => {
          if (ele?.isRead == false) {
            unReadArr.push(ele);
          } else {
            null;
          }
        });
        setUnReadNotifications(unReadArr);
      });

    return () => unsubscribe();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.bottonTabBg,
          borderBottomColor: theme.bottonTabBorderColor,
        },
      ]}>
      <Image
        source={require('../../assets/logo.png')}
        style={[styles.logoStyle, {tintColor: theme.bottonTabIconColor}]}
      />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(navigationStrings.NOTIFICATION_SCREEN)
          }>
          <Image
            source={require('../../assets/tab_heart.png')}
            style={[styles.iconstyle, {tintColor: theme.bottonTabIconColor}]}
          />
          {unReadNotifitions.length > 0 && <View style={styles.dotIcon} />}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(navigationStrings.CHAT_USERS_LIST_SCREEN)
          }>
          <Image
            source={require('../../assets/chat.png')}
            style={[
              styles.iconstyle,
              {marginLeft: 14, tintColor: theme.bottonTabIconColor},
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
    borderBottomWidth: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconstyle: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  logoStyle: {
    width: 90,
    height: 34,
    resizeMode: 'contain',
  },
  dotIcon: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'red',
    position: 'absolute',
    top: 1,
    right: 2,
  },
});

export default TopHomeCompo;
