import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import fontFamily from '../../styles/fontFamily';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useTheme} from '../../themes/ThemeContext';
import CommentStyle from '../style/CommentStyle';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';

const ShowReplyCompo = ({
  data,
  postId,
  showComment,
  setShowComment,
  switchToScreen,
}) => {
  const {theme} = useTheme();
  const styles = CommentStyle(theme);
  const [userData, setUserData] = useState(null);
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const loggedUser = auth().currentUser.uid;

  var isMoundted = false;
  const getUserData = () => {
    try {
      setLoading(true);
      firestore()
        .collection('users')
        .doc(data.userId)
        .get()
        .then(res => {
          setUserData(res.data());
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          console.log(
            'error in getting user data in reply where show comments: ',
            err,
          );
        });
    } catch (error) {
      setLoading(false);
      console.log(
        'error in getting user data in reply where show comments: ',
        error,
      );
    }
  };

  useEffect(() => {
    isMoundted = true;
    getUserData();
    return () => (isMoundted = false);
  }, [data.userId]);

  function formateTime() {
    const postTime = data.time;
    const currentTime = new Date();
    const timeDiff = currentTime - postTime;
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (seconds < 60) {
      return `now`;
      // return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} min ago`;
    } else if (hours < 24) {
      return `${hours} hour ago`;
    } else if (days === 1) {
      return 'Yesterday';
    } else {
      // Format the postTime to display the date
      const options = {year: 'numeric', month: 'short', day: 'numeric'};
      return postTime.toLocaleDateString(undefined, options);
    }
  }

  const handleLike = async () => {
    const postRef = firestore()
      .collection('posts')
      .doc(data.postId)
      .collection('comments')
      .doc(data.replyCommentId)
      .collection('reply')
      .doc(data.replyId);
    try {
      const postDoc = await postRef.get();
      if (postDoc.exists) {
        const postData = postDoc.data();
        if (postData.hasOwnProperty('likes')) {
          let updatedLikes = [...postData.likes];
          if (postData.likes.includes(loggedUser)) {
            updatedLikes = updatedLikes.filter(id => id !== loggedUser);
          } else {
            updatedLikes.push(loggedUser);
          }
          await postRef.update({likes: updatedLikes});
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const profileNavigationHandler = () => {
    if (data.userId == auth().currentUser.uid) {
      setShowComment(!showComment);
      switchToScreen(4);
    } else {
      setShowComment(!showComment);
      navigation.navigate(navigationStrings.USER_PROFILE, {
        userUid: data.userId,
      });
    }
  };

  return (
    <View style={mystyles.replyContainer}>
      <TouchableOpacity onPress={profileNavigationHandler}>
        <FastImage
          source={{uri: userData?.imageUrl}}
          style={mystyles.userImageStyle}
        />
      </TouchableOpacity>
      <View style={mystyles.replyTextContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[styles.userNameStyle, {fontSize: 11}]}>
            {userData?.fullName}
          </Text>
          <Text
            style={[
              styles.commentTextStyle,
              {
                fontFamily: fontFamily.medium,
                marginLeft: 8,
                color: theme.commentGrayText,
              },
            ]}>
            {' '}
            {formateTime()}
          </Text>
        </View>
        <Text
          style={[styles.commentTextStyle, {fontSize: 11}]}
          numberOfLines={4}>
          {data.text}
        </Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          paddingTop: 2,
        }}>
        <TouchableOpacity
          style={{
            paddingHorizontal: 6,
            paddingVertical: 4,
          }}
          onPress={handleLike}>
          <Image
            source={
              data.likes.includes(loggedUser)
                ? require('../../assets/tab_heart_fill.png')
                : require('../../assets/tab_heart.png')
            }
            style={[
              styles.heartIcon,
              {
                tintColor: data.likes.includes(loggedUser)
                  ? 'red'
                  : theme.commentIconColor,
              },
            ]}
          />
        </TouchableOpacity>
        <Text style={styles.likeCounterText}>{data.likes.length}</Text>
      </View>
    </View>
  );
};

const mystyles = StyleSheet.create({
  replyContainer: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  userImageStyle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  replyTextContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default ShowReplyCompo;
