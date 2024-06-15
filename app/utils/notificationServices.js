import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PermissionsAndroid, Platform} from 'react-native';
import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import constants from '../constants/constants';
import {onDisplayNotificationNotifee} from './notifeeHandler';
import navigationStrings from '../navigation/navigationStrings';
import NavigationService from '../navigation/NavigationService';

export async function requestUserPermission() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Authorization status:', authStatus);
      if (Platform.OS === 'android') {
        const grants = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (grants === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('permision is grandted for Android');
          getFcmToken();
        }
      } else {
        getFcmToken();
      }
    }
  } catch (error) {
    console.error(
      'Error for requesting permission in notification services file:',
      error,
    );
  }
}

export const handleSetFcmToken = async () => {
  try {
    const token = await firebase.messaging().getToken();
    if (token) {
      await storeFcmTokenToFirestore(token);
    }
  } catch (error) {
    console.log(error);
  }
};

const storeFcmTokenToFirestore = async fcmToken => {
  try {
    const userRef = firestore()
      .collection('users')
      .doc(auth().currentUser?.uid);
    const userData = await userRef.get();

    if (userData.exists) {
      const userDataObj = userData.data(); // Access user data using data() method

      if (userDataObj.hasOwnProperty('fcmToken')) {
        // If 'fcmToken' field already exists, update it
        await userRef.update({fcmToken: fcmToken});
      } else {
        // If 'fcmToken' field doesn't exist, set it
        await userRef.set({...userDataObj, fcmToken: fcmToken});
      }
    }
  } catch (error) {
    console.log('Error while storing fcm to user collection: ', error);
  }
};

const getFcmToken = async () => {
  // let oldFcmToken = await AsyncStorage.getItem('fcmToken');
  // if (!oldFcmToken) {
  //   try {
  //     const fcmToken = await messaging().getToken();
  //     if (fcmToken) {
  //       console.log('new generated fcm token is: ', fcmToken);
  //       await AsyncStorage.setItem('fcmToken', fcmToken);
  //       await storeFcmTokenToFirestore(fcmToken);
  //       constants.fcmToken = fcmToken;
  //     }
  //   } catch (error) {
  //     console.log(
  //       'Error in notificationServices file while setting fcm token to async storage: ',
  //       error,
  //     );
  //   }
  // } else {
  //   constants.fcmToken = oldFcmToken;
  //   // await storeFcmTokenToFirestore(oldFcmToken);
  //   console.log('Old fcm token is: ', oldFcmToken)'
  // }
  try {
    const fcmToken = await firebase.messaging().getToken();
    await storeFcmTokenToFirestore(fcmToken);
  } catch (error) {
    console.log('Error while getting fcm token');
  }
};

export const notificationListner = async () => {
  // this is for handling notification in background state
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    if (auth().currentUser?.uid) {
      console.log('user is logged in');
      if (!!remoteMessage?.data && remoteMessage?.data?.type == 'follower') {
        setTimeout(() => {
          NavigationService.navigate(navigationStrings.USER_PROFILE, {
            userUid: remoteMessage?.data?.typeID,
          });
        }, 100);
      }
      if (!!remoteMessage?.data && remoteMessage?.data?.type == 'message') {
        const routeData = {
          chatID: remoteMessage?.data?.typeID,
        };
        setTimeout(() => {
          NavigationService.navigate(navigationStrings.CHAT_SCREEN, routeData);
        }, 100);
      }

      if (
        !!remoteMessage?.data &&
        remoteMessage?.data?.type == 'groupMessage'
      ) {
        setTimeout(() => {
          NavigationService.navigate(navigationStrings.GROUP_CHAT_SCREEN, {
            groupId: remoteMessage?.data?.typeID,
          });
        }, 100);
      }

      if (!!remoteMessage?.data && remoteMessage?.data?.type == 'likePost') {
        const clickedItem = remoteMessage?.data?.typeID;
        const userUid = auth().currentUser?.uid;
        setTimeout(() => {
          NavigationService.navigate(navigationStrings.SHOW_ALL_USER_POSTS, {
            clickedItem: clickedItem,
            userUid: userUid,
          });
        }, 100);
      }
    }
  });

  // this is for handling notification in foreground state (mean app is opened)
  messaging().onMessage(async remoteMessage => {
    console.log('Notification foreground:', remoteMessage.notification);
    await onDisplayNotificationNotifee(remoteMessage?.notification);
  });

  // Check whether an initial notification is available
  // below code is used for kill mode of app mean app in kill state
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );
        if (auth().currentUser?.uid) {
          console.log('user is logged in');
          if (
            !!remoteMessage?.data &&
            remoteMessage?.data?.type == 'follower'
          ) {
            setTimeout(() => {
              NavigationService.navigate(navigationStrings.USER_PROFILE, {
                userUid: remoteMessage?.data?.typeID,
              });
            }, 2000);
          }
          if (!!remoteMessage?.data && remoteMessage?.data?.type == 'message') {
            const routeData = {
              chatID: remoteMessage?.data?.typeID,
            };
            setTimeout(() => {
              NavigationService.navigate(
                navigationStrings.CHAT_SCREEN,
                routeData,
              );
            }, 2000);
          }

          if (
            !!remoteMessage?.data &&
            remoteMessage?.data?.type == 'groupMessage'
          ) {
            setTimeout(() => {
              NavigationService.navigate(navigationStrings.GROUP_CHAT_SCREEN, {
                groupId: remoteMessage?.data?.typeID,
              });
            }, 2000);
          }

          if (
            !!remoteMessage?.data &&
            remoteMessage?.data?.type == 'likePost'
          ) {
            const clickedItem = remoteMessage?.data?.typeID;
            const userUid = auth().currentUser?.uid;
            setTimeout(() => {
              NavigationService.navigate(
                navigationStrings.SHOW_ALL_USER_POSTS,
                {
                  clickedItem: clickedItem,
                  userUid: userUid,
                },
              );
            }, 2000);
          }
        }
      }
    });
};
