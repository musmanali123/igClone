import {Text, FlatList, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import TopCompoWithHeading from '../../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../themes/ThemeContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MyIndicator from '../../components/MyIndicator';
import ShowNotificationCompo from '../components/ShowNotificationCompo';

export default function NotificationScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unReadNotifitions, setUnReadNotifications] = useState([]);
  const [readNotifitions, setReadNotifications] = useState([]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('notifications')
      .orderBy('time', 'desc')
      .onSnapshot(snap => {
        const allNotificationsData = snap.docs.map(doc => ({...doc.data()}));
        const filteredNotificationsData = allNotificationsData.filter(
          ele => ele.receiverID === auth().currentUser?.uid,
        );
        let unReadArr = [];
        let readArr = [];
        filteredNotificationsData.forEach(ele => {
          if (ele?.isRead == false) {
            unReadArr.push(ele);
          } else if (ele?.isRead == true) {
            readArr.push(ele);
          } else {
            null;
          }
        });
        setUnReadNotifications(unReadArr);
        setReadNotifications(readArr);
        setNotifications(filteredNotificationsData);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title="Notification"
          onPress={() => navigation.goBack()}
        />
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          {unReadNotifitions.length > 0 && (
            <Text style={[styles.text, {color: theme.text}]}>New</Text>
          )}
          <FlatList
            data={notifications}
            renderItem={({item}) => {
              return (
                item?.isRead == false && <ShowNotificationCompo data={item} />
              );
            }}
            // renderItem={({item}) => <ShowNotificationCompo data={item} />}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
          {readNotifitions.length > 0 && unReadNotifitions.length > 0 && (
            <Text style={[styles.text, {color: theme.text}]}>Previous</Text>
          )}
          <FlatList
            data={notifications}
            renderItem={({item}) => {
              return (
                item?.isRead == true && <ShowNotificationCompo data={item} />
              );
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </ScrollView>
      </ScreenComponent>
      <MyIndicator
        visible={loading}
        backgroundColor={theme.loginBackground}
        size={'large'}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    paddingLeft: 12,
    marginBottom: 12,
  },
});
