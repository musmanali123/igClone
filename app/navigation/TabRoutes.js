import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Image, Platform} from 'react-native';
import {useTheme} from '../themes/ThemeContext';
import BottomTabStyle from './style/BottomTabStyle';
import Home from '../screens/Home';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import GalleryScreen from '../screens/CreatePost/GalleryScreen';
import auth from '@react-native-firebase/auth';
import FastImage from 'react-native-fast-image';
import ReelsScreen from '../screens/Reels/ReelsScreen';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import navigationStrings from './navigationStrings';

const TabRoutes = ({route}) => {
  const screenNo = route.params?.screenNo;
  const {theme} = useTheme();
  const styles = BottomTabStyle(theme);
  const [selectedScreen, setSelectedScreen] = useState(
    screenNo !== undefined ? screenNo : 0,
  );
  const userProfilePic = auth().currentUser.photoURL;
  const switchToScreen = screenIndex => {
    setSelectedScreen(screenIndex);
  };

  const navigation = useNavigation();

  useEffect(() => {
    handleKillStateNotification();
  }, []);

  const handleKillStateNotification = () => {
    // this code is used for kill mode of app mean app in kill state
    try {
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Notification from quit state in TAB ROUTES:',
              remoteMessage,
            );
            if (
              !!remoteMessage?.data &&
              remoteMessage?.data?.type == 'follower'
            ) {
              setTimeout(() => {
                navigation.navigate(navigationStrings.USER_PROFILE, {
                  userUid: remoteMessage?.data?.typeID,
                });
              }, 100);
            }
            if (
              !!remoteMessage?.data &&
              remoteMessage?.data?.type == 'message'
            ) {
              const routeData = {
                chatID: remoteMessage?.data?.typeID,
              };
              setTimeout(() => {
                navigation.navigate(navigationStrings.CHAT_SCREEN, routeData);
              }, 100);
            }

            if (
              !!remoteMessage?.data &&
              remoteMessage?.data?.type == 'groupMessage'
            ) {
              setTimeout(() => {
                navigation.navigate(navigationStrings.GROUP_CHAT_SCREEN, {
                  groupId: remoteMessage?.data?.typeID,
                });
              }, 100);
            }
            if (
              !!remoteMessage?.data &&
              remoteMessage?.data?.type == 'likePost'
            ) {
              console.log('..............Hello..............');
              const clickedItem = remoteMessage?.data?.typeID;
              const userUid = auth().currentUser?.uid;
              setTimeout(() => {
                navigation.navigate(navigationStrings.SHOW_ALL_USER_POSTS, {
                  clickedItem: clickedItem,
                  userUid: userUid,
                });
              }, 100);
            }
          }
        });
    } catch (error) {
      console.log(
        'Error handling kill state notification in TabRoutes file: ',
        error,
      );
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        {/* {selectedScreen === 0 && <Home switchToScreen={switchToScreen} />}
        {selectedScreen === 1 && <SearchScreen />}
        {selectedScreen === 2 && (
          <GalleryScreen switchToScreen={switchToScreen} />
        )}
        {selectedScreen === 3 && (
          <ReelsScreen switchToScreen={switchToScreen} />
        )}
        {selectedScreen === 4 && <ProfileScreen />} */}
        {selectedScreen === 0 ? (
          <Home switchToScreen={switchToScreen} />
        ) : selectedScreen === 1 ? (
          <SearchScreen />
        ) : selectedScreen === 2 ? (
          <GalleryScreen switchToScreen={switchToScreen} />
        ) : selectedScreen === 3 ? (
          <ReelsScreen switchToScreen={switchToScreen} />
        ) : selectedScreen === 4 ? (
          <ProfileScreen />
        ) : null}
      </View>
      <View style={styles.bottomTabContainer}>
        <TouchableOpacity
          onPress={() => switchToScreen(0)}
          style={styles.iconContainer}>
          <Image
            source={
              selectedScreen === 0
                ? require('../assets/tab_home_fill.png')
                : require('../assets/tab_home.png')
            }
            style={styles.iconStyle}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => switchToScreen(1)}
          style={styles.iconContainer}>
          <Image
            source={
              selectedScreen === 1
                ? require('../assets/tab_search_fill.png')
                : require('../assets/tab_search.png')
            }
            style={styles.iconStyle}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => switchToScreen(2)}
          style={styles.iconContainer}>
          <Image
            source={
              selectedScreen === 2
                ? require('../assets/tab_plus.png')
                : require('../assets/tab_plus.png')
            }
            style={styles.iconStyle}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => switchToScreen(3)}
          style={styles.iconContainer}>
          <Image
            source={
              selectedScreen === 3
                ? require('../assets/reel.png')
                : require('../assets/reel.png')
            }
            style={styles.iconStyle}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => switchToScreen(4)}
          style={[styles.iconContainer]}>
          {userProfilePic !== null &&
          userProfilePic !== undefined &&
          userProfilePic !== '' ? (
            <FastImage
              source={{uri: userProfilePic}}
              style={styles.userProfilePicStyle}
            />
          ) : (
            <Image
              source={require('../assets/user.png')}
              style={styles.iconStyle}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TabRoutes;
