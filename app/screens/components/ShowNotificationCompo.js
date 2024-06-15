import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import {useTheme} from '../../themes/ThemeContext';
import auth from '@react-native-firebase/auth';
import colors from '../../styles/colors';
import firestore from '@react-native-firebase/firestore';
import MyIndicator from '../../components/MyIndicator';
import FastImage from 'react-native-fast-image';

const ShowNotificationCompo = ({data}) => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userImageUrl, setUserImageUrl] = useState('');
  const [userAllData, setUserAllData] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('users')
      .doc(data.senderID)
      .onSnapshot(snap => {
        if (snap.exists) {
          var data = snap.data();
          setUserAllData(data);
          setUserImageUrl(data.imageUrl);
          setUserName(data.fullName);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, []);

  function formatTime() {
    const notificationTime = data?.time.toDate();
    const currentTime = new Date();
    const timeDiff = currentTime - notificationTime;
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `now`;
    } else if (minutes < 60) {
      return `${minutes} min`;
    } else if (hours < 8) {
      return `${hours} hour`;
    } else if (hours < 24 && hours >= 8) {
      return 'Today';
    } else if (days < 7 && days >= 1) {
      return `${days} d`;
    } else if (days === 14) {
      return '2 weeks';
    } else {
      // Format the notificationTime to display the date
      const options = {year: 'numeric', month: 'short', day: 'numeric'};
      return notificationTime.toLocaleDateString(undefined, options);
    }
  }

  const handleNotificationOnPress = async () => {
    try {
      if (data?.isRead == false) {
        await firestore()
          .collection('notifications')
          .doc(data?.notificationID)
          .update({
            isRead: true,
          });
      }
      if (data?.type == 'likePost') {
        navigation.navigate(navigationStrings.SHOW_ALL_USER_POSTS, {
          clickedItem: data?.typeID,
          userUid: auth().currentUser?.uid,
        });
      } else if (data?.type == 'follower') {
        navigation.navigate(navigationStrings.USER_PROFILE, {
          userUid: data?.senderID,
        });
      } else if (data?.type == 'post') {
        navigation.navigate(navigationStrings.SHOW_ALL_USER_POSTS, {
          clickedItem: data?.typeID,
          userUid: data?.senderID,
        });
      } else if (data?.type == 'message') {
        const routeData = {
          chatID: data?.typeID,
        };
        navigation.navigate(navigationStrings.CHAT_SCREEN, routeData);
      } else if (data?.type == 'groupMessage') {
        navigation.navigate(navigationStrings.GROUP_CHAT_SCREEN, {
          groupId: data?.typeID,
        });
      } else {
        return null;
      }
    } catch (error) {
      console.log(
        'Error while user press on notification in Show Notification Compo ',
        error,
      );
    }
  };

  const handleFollower = async () => {
    const userId = data.senderID;
    const userRef = firestore().collection('users').doc(userId);
    const loggedUserId = auth().currentUser.uid;
    try {
      const fuserRef = await userRef.get();
      if (fuserRef.exists) {
        const fuserData = fuserRef.data();

        if (fuserData.hasOwnProperty('followers')) {
          let updatedFollowers = [...fuserData.followers]; // Create a new array
          if (fuserData.followers.includes(loggedUserId)) {
            updatedFollowers = updatedFollowers.filter(
              id => id !== loggedUserId,
            ); // Remove follower
          } else {
            updatedFollowers.push(loggedUserId); // Add follower
          }
          await userRef.update({followers: updatedFollowers}); // Update the followers
        }
      }
    } catch (error) {
      console.log('Error in follower function: ', error);
    }
  };
  const handleFollowing = async () => {
    const userId = data.senderID;
    // userId
    const loggedUserId = auth().currentUser.uid;
    const userRef = firestore().collection('users').doc(loggedUserId);
    try {
      const fuserRef = await userRef.get();
      if (fuserRef.exists) {
        const fuserData = fuserRef.data();

        if (fuserData.hasOwnProperty('following')) {
          let updatedFollowers = [...fuserData.following]; // Create a new array
          if (fuserData.following.includes(userId)) {
            updatedFollowers = updatedFollowers.filter(id => id !== userId); // Remove following
          } else {
            updatedFollowers.push(userId); // Add following
          }
          await userRef.update({following: updatedFollowers}); // Update the following
        }
      }
    } catch (error) {
      console.log('Error in follower function: ', error);
    }
  };

  const handleFollow = async () => {
    await handleFollower();
    await handleFollowing();
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => handleNotificationOnPress()}>
        <View style={{paddingHorizontal: 8}}>
          <FastImage
            source={
              userImageUrl == ''
                ? require('../../assets/avatar.png')
                : {uri: userImageUrl}
            }
            style={styles.userProfileImage}
          />
          {data?.isRead == false && <View style={styles.readUnReadNotif} />}
        </View>
        <View style={styles.notificationTextContainer}>
          <Text style={[styles.notificationText, {color: theme.text}]}>
            <Text style={[styles.userNameStyle, {color: theme.text}]}>
              {userName !== '' ? userName + ' ' : ''}
            </Text>
            {data?.type == 'likePost'
              ? 'Like your post.'
              : data?.type == 'follower'
              ? 'started following you.'
              : data?.type == 'post'
              ? 'added new post.'
              : data?.type == 'message'
              ? 'send you a message. '
              : data?.type == 'groupMessage'
              ? 'send message in group.'
              : ''}
            <Text style={[styles.timeStyle, {color: theme.gary}]}>
              {' ' + formatTime()}
            </Text>
          </Text>
        </View>
        {!!data?.imageUrl &&
        (data?.type == 'likePost' || data?.type == 'likePost') ? (
          <FastImage
            style={{
              width: 36,
              height: 36,
              borderRadius: 6,
            }}
            source={{uri: data?.imageUrl}}
          />
        ) : data?.type == 'follower' ? (
          <TouchableOpacity
            style={[
              styles.btnStyle,
              {
                backgroundColor: userAllData?.followers.includes(
                  auth().currentUser?.uid,
                )
                  ? theme.userProfileGray
                  : theme.userProfileBlue,
              },
            ]}
            onPress={() => handleFollow()}>
            <Text
              style={[
                styles.btnText,
                {
                  color: userAllData?.followers.includes(
                    auth().currentUser?.uid,
                  )
                    ? theme.text
                    : 'white',
                },
              ]}>
              {userAllData?.followers.includes(auth().currentUser?.uid)
                ? 'Following'
                : 'Follow'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyVIEW} />
        )}
      </TouchableOpacity>
      <MyIndicator
        visible={loading}
        backgroundColor={'transparent'}
        size={'small'}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userProfileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userNameStyle: {
    fontSize: 14,
    fontWeight: '700',
  },
  notificationText: {
    fontSize: 13,
    fontWeight: '500',
  },
  timeStyle: {
    fontSize: 12,
    fontWeight: '400',
  },
  notificationTextContainer: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    alignItems: 'flex-start',
  },
  emptyVIEW: {
    width: 50,
    height: '100%',
  },
  btnStyle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.skyBlue,
    borderRadius: 8,
  },
  btnText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white,
  },
  readUnReadNotif: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'red',
    position: 'absolute',
    top: 4,
    right: 2,
  },
});

export default ShowNotificationCompo;
