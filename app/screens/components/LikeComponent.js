import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useTheme} from '../../themes/ThemeContext';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  sendNotificationToAll,
  sendSingleNotification,
} from '../../utils/sendNotification';

const LikeComponent = ({
  postId,
  postLikes,
  iconStyle,
  iconContianerStyle,
  postUserData,
}) => {
  const {theme} = useTheme();
  const [liked, setLiked] = useState(false);
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('posts')
      .doc(postId)
      .onSnapshot(snapshot => {
        if (snapshot.exists) {
          const postData = snapshot.data();
          setPostData(postData);
          if (
            postData.likes &&
            postData.likes.includes(auth().currentUser.uid)
          ) {
            setLiked(true);
          } else {
            setLiked(false);
          }
        }
      });

    return () => unsubscribe();
  }, []);

  const handleLike = async () => {
    const loggedUser = auth().currentUser;
    const postRef = firestore().collection('posts').doc(postId);
    try {
      const postDoc = await postRef.get();
      if (postDoc.exists) {
        const postData = postDoc.data();
        if (postData.hasOwnProperty('likes')) {
          if (postData.likes && postData.likes.includes(loggedUser.uid)) {
            await postRef.update({
              likes: firestore.FieldValue.arrayRemove(loggedUser.uid),
            });
            setLiked(false);
          } else {
            // User hasn't liked the post, so like it
            await postRef.update({
              likes: firestore.FieldValue.arrayUnion(loggedUser.uid),
            });
            setLiked(true);
            const title = `${auth().currentUser?.displayName} Like your post`;
            const body = '';
            const imageUrl = postData?.medialUrls[0];
            const type = 'likePost';
            const typeID = postId;
            const senderID = auth()?.currentUser.uid;
            const receiverID = postUserData?.id;
            const fcmToken = postUserData?.fcmToken;
            sendSingleNotification(
              senderID,
              receiverID,
              title,
              body,
              imageUrl,
              type,
              typeID,
              fcmToken,
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={{...styles.postIconsContainer, ...iconContianerStyle}}
        onPress={handleLike}>
        {/* <Image
          source={
            liked
              ? require('../../assets/tab_heart_fill.png')
              : require('../../assets/tab_heart.png')
          }
          style={[
            styles.postIconsStyle,
            {tintColor: liked ? 'red' : theme.text},
          ]}
        /> */}
        <Image
          source={
            postLikes.includes(auth().currentUser.uid)
              ? require('../../assets/tab_heart_fill.png')
              : require('../../assets/tab_heart.png')
          }
          style={[
            styles.postIconsStyle,
            {
              tintColor: postLikes.includes(auth().currentUser.uid)
                ? 'red'
                : theme.text,
            },
            iconStyle,
          ]}
        />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  postIconsStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  postIconsContainer: {
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
});

export default LikeComponent;
