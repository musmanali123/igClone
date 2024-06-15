import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import MyIndicator from '../../components/MyIndicator';
import navigationStrings from '../../navigation/navigationStrings';
import FastImage from 'react-native-fast-image';
import fontFamily from '../../styles/fontFamily';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../themes/ThemeContext';
import FollowingStyle from '../style/FollowingStyle';

const ShowFollowerFollowingCompo = ({item, screenName, getUsersData}) => {
  const [userName, setUserName] = useState('');
  const [userImageUrl, setUserImageUrl] = useState('');
  const [userAllData, setUserAllData] = useState(null);
  const {theme} = useTheme();
  const styles = FollowingStyle(theme);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(item)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          var doc = documentSnapshot.data();
          setUserAllData(doc);
          setUserName(doc.fullName);
          setUserImageUrl(doc.imageUrl);
        }
      });
    return () => unsubscribe();
  }, [item]);

  const handleFollower = async () => {
    const userId = item;
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
            ); // Remove like
          } else {
            updatedFollowers.push(loggedUserId); // Add like
          }
          await userRef.update({followers: updatedFollowers}); // Update the likes
          // setFollowerCount(updatedFollowers.length);
        }
      }
    } catch (error) {
      console.log('Error in follower function: ', error);
    }
  };
  const handleFollowing = async () => {
    const userId = item;
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
            updatedFollowers = updatedFollowers.filter(id => id !== userId); // Remove like
          } else {
            updatedFollowers.push(userId); // Add like
          }
          await userRef.update({following: updatedFollowers}); // Update the likes
          // setFollowerCount(updatedFollowers.length);
        }
      }
    } catch (error) {
      console.log('Error in follower function: ', error);
    }
  };

  const handleFollow = async () => {
    await handleFollower();
    await handleFollowing();
    if (screenName !== undefined && screenName == 'discover') {
      getUsersData();
    }
  };

  const profileNavigationHandler = () => {
    if (item == auth().currentUser.uid) {
      // switchToScreen(4);
    } else {
      navigation.navigate(navigationStrings.USER_PROFILE, {
        userUid: item,
      });
    }
  };

  return (
    <View style={styles.userFollowerListContainer}>
      <TouchableOpacity
        style={styles.followerImageContainer}
        onPress={profileNavigationHandler}>
        <FastImage
          source={
            userImageUrl == ''
              ? require('../../assets/avatar.png')
              : {uri: userImageUrl}
          }
          style={styles.userImage}
        />
        <Text style={styles.followerUserNameText}>{userName}</Text>
      </TouchableOpacity>
      {auth().currentUser.uid !== item && (
        <TouchableOpacity
          style={[
            styles.userProfileFollowBtn,
            {
              backgroundColor:
                userAllData !== null &&
                userAllData.followers.includes(auth().currentUser?.uid)
                  ? theme.userProfileGray
                  : theme.userProfileBlue,
            },
          ]}
          onPress={handleFollow}
          activeOpacity={0.6}>
          <Text
            style={[
              styles.userProfileFollowText,
              {
                color:
                  userAllData !== null &&
                  userAllData.followers.includes(auth().currentUser?.uid)
                    ? theme.text
                    : 'white',
              },
            ]}>
            {userAllData !== null &&
            userAllData.followers.includes(auth().currentUser?.uid)
              ? 'Following'
              : 'follow'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ShowFollowerFollowingCompo;
