import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../themes/ThemeContext';
import colors from '../../styles/colors';
import CommentStyle from '../style/CommentStyle';
import FastImage from 'react-native-fast-image';
import PostData from '../../dummyData/PostData';
import ScreenComponent from '../../components/ScreenComponent';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ShowCommentsCompo from './ShowCommentsCompo';
import fontFamily from '../../styles/fontFamily';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';

const ShowPostOptionModal = ({
  showOptionModal,
  setShowOptionModal,
  postId,
  switchToScreen,
  postUserUid,
  postUserData,
  currentUserAlldata,
  handleSavePost,
  allUrls,
  preCaption,
}) => {
  const {theme} = useTheme();
  const styles = CommentStyle(theme);
  const [laoding, setLoading] = useState(false);
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  const currenUserUid = auth().currentUser?.uid;
  const navigation = useNavigation();

  const handleFollower = async () => {
    const userId = postUserUid;
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
    const userId = postUserUid;
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
  };

  const deletePost = async () => {
    try {
      await firestore().collection('posts').doc(postId).delete();
      setShowOptionModal(!showOptionModal);
    } catch (error) {
      console.log(
        'Error while Deleting the post in Show-Post-Option-Modal Component: ',
        error,
      );
    }
  };

  const handleDeletePost = async () => {
    try {
      if (currenUserUid === postUserUid) {
        Alert.alert('Warning', 'Are you sure to delete this post!', [
          {
            text: 'Yes',
            onPress: deletePost,
          },
          {
            text: 'No',
          },
        ]);
      }
    } catch (error) {
      console.log(
        'Error while Deleting the post in ALERT Modal Show-Post-Option-Modal Component: ',
        error,
      );
    }
  };

  const handleEditPost = () => {
    setShowOptionModal(!showOptionModal);
    try {
      if (currenUserUid === postUserUid) {
        navigation.navigate(navigationStrings.CREATE_POST_SCREEN, {
          allMedia: allUrls,
          preCaption: preCaption,
          screenTitle: 'Edit',
          postId: postId,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToFavorite = async () => {
    try {
      const loggedUserId = auth().currentUser?.uid;
      const userRef = firestore().collection('users').doc(loggedUserId);
      const fuserRef = await userRef.get();
      if (fuserRef.exists) {
        const fuserData = fuserRef.data();

        if (fuserData.hasOwnProperty('favourites')) {
          let updatedFavouriteUsers = [...fuserData.favourites]; // Create a new array
          if (fuserData.favourites.includes(postUserUid)) {
            updatedFavouriteUsers = updatedFavouriteUsers.filter(
              id => id !== postUserUid,
            ); // Remove User id
          } else {
            updatedFavouriteUsers.push(postUserUid); // Add User id
          }
          await userRef.update({favourites: updatedFavouriteUsers}); // Update the User id
        } else {
          // If 'fcmToken' field doesn't exist, set it
          await userRef.set({...fuserData, favourites: [postUserUid]});
        }
      }
    } catch (error) {
      console.log(
        'Error in handleAddToFavorite function in ShowPostOption Modal compo: ',
        error,
      );
    }
  };

  return (
    <>
      <Modal visible={showOptionModal} style={{flex: 1}} transparent>
        <TouchableOpacity
          style={{backgroundColor: 'transparent', height: 200}}
          onPress={() => setShowOptionModal(!showOptionModal)}
        />
        <View style={[styles.container, {backgroundColor: 'transparent'}]}>
          <View
            style={[
              styles.mainContainer,
              {
                height: screenHeight - 200,
                backgroundColor: theme.background,
                borderWidth: 0.2,
                borderColor: theme.profileImgBorder,
              },
            ]}>
            <View style={styles.headerContainer}>
              <Text style={styles.commentHeading}></Text>
              <TouchableOpacity
                style={styles.closeIconContainer}
                onPress={() => setShowOptionModal(!showOptionModal)}>
                <Image
                  source={require('../../assets/close.png')}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
              <View style={{flex: 1, paddingVertical: 8}}>
                <View style={mystyles.btnsContainer}>
                  <View style={{alignItems: 'center'}}>
                    <TouchableOpacity
                      style={[mystyles.saveBtn, {borderColor: theme.light}]}
                      onPress={handleSavePost}>
                      <Image
                        source={
                          currentUserAlldata !== null &&
                          currentUserAlldata.savedPosts.includes(postId)
                            ? require('../../assets/saved_fill.png')
                            : require('../../assets/save.png')
                        }
                        style={[mystyles.saveIcon, {tintColor: theme.text}]}
                      />
                    </TouchableOpacity>
                    <Text style={[styles.commentTextStyle, {fontSize: 12}]}>
                      {currentUserAlldata !== null &&
                      currentUserAlldata.savedPosts.includes(postId)
                        ? 'Saved'
                        : 'Save'}
                    </Text>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <TouchableOpacity
                      style={[mystyles.saveBtn, {borderColor: theme.light}]}>
                      <Image
                        source={require('../../assets/qr-code.png')}
                        style={[mystyles.saveIcon, {tintColor: theme.text}]}
                      />
                    </TouchableOpacity>
                    <Text style={[styles.commentTextStyle, {fontSize: 12}]}>
                      QR code
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    mystyles.viewStyle,
                    {
                      borderTopColor: theme.lightText,
                      borderBottomColor: theme.lightText,
                    },
                  ]}>
                  {postUserUid !== currenUserUid && (
                    <TouchableOpacity
                      style={mystyles.iconTextContainer}
                      onPress={handleAddToFavorite}>
                      <Image
                        source={
                          !currentUserAlldata?.favourites?.includes(postUserUid)
                            ? require('../../assets/favorite.png')
                            : require('../../assets/remove-star.png')
                        }
                        style={[mystyles.saveIcon, {tintColor: theme.text}]}
                      />
                      <Text style={[mystyles.textStyle, {color: theme.text}]}>
                        {currentUserAlldata?.favourites?.includes(postUserUid)
                          ? 'Remove from'
                          : 'Add to'}{' '}
                        Favourites
                      </Text>
                    </TouchableOpacity>
                  )}
                  {postUserUid !== currenUserUid &&
                    postUserData.followers.includes(currenUserUid) && (
                      <TouchableOpacity
                        style={[mystyles.iconTextContainer, {marginTop: 20}]}
                        onPress={handleFollow}>
                        <Image
                          source={require('../../assets/unfollow.png')}
                          style={[mystyles.saveIcon, {tintColor: theme.text}]}
                        />
                        <Text style={[mystyles.textStyle, {color: theme.text}]}>
                          Unfollow
                        </Text>
                      </TouchableOpacity>
                    )}
                </View>

                <View style={{paddingHorizontal: 20, paddingVertical: 20}}>
                  <TouchableOpacity style={mystyles.iconTextContainer}>
                    <Image
                      source={require('../../assets/info.png')}
                      style={[mystyles.saveIcon, {tintColor: theme.text}]}
                    />
                    <Text style={[mystyles.textStyle, {color: theme.text}]}>
                      Why are your seeing this post
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[mystyles.iconTextContainer, {marginVertical: 20}]}>
                    <Image
                      source={require('../../assets/hide.png')}
                      style={[mystyles.saveIcon, {tintColor: theme.text}]}
                    />
                    <Text style={[mystyles.textStyle, {color: theme.text}]}>
                      Hide
                    </Text>
                  </TouchableOpacity>
                  {postUserUid !== currenUserUid && (
                    <TouchableOpacity
                      style={[mystyles.iconTextContainer, {marginBottom: 22}]}
                      onPress={() => {
                        setShowOptionModal(!showOptionModal);
                        navigation.navigate(
                          navigationStrings.ABOUT_ACCOUNT_SCREEN,
                          {userUid: postUserUid},
                        );
                      }}>
                      <Image
                        source={require('../../assets/account_user.png')}
                        style={[mystyles.saveIcon, {tintColor: theme.text}]}
                      />
                      <Text style={[mystyles.textStyle, {color: theme.text}]}>
                        About this account
                      </Text>
                    </TouchableOpacity>
                  )}
                  {postUserUid !== currenUserUid && (
                    <TouchableOpacity style={[mystyles.iconTextContainer]}>
                      <Image
                        source={require('../../assets/report.png')}
                        style={[mystyles.saveIcon, {tintColor: theme.red}]}
                      />
                      <Text style={[mystyles.textStyle, {color: theme.red}]}>
                        Report
                      </Text>
                    </TouchableOpacity>
                  )}
                  {postUserUid === currenUserUid && (
                    <TouchableOpacity
                      style={[mystyles.iconTextContainer]}
                      onPress={() => handleEditPost()}>
                      <Image
                        source={require('../../assets/edit.png')}
                        style={[mystyles.saveIcon, {tintColor: theme.text}]}
                      />
                      <Text style={[mystyles.textStyle, {color: theme.text}]}>
                        Edit
                      </Text>
                    </TouchableOpacity>
                  )}
                  {postUserUid === currenUserUid && (
                    <TouchableOpacity
                      style={[mystyles.iconTextContainer, {marginVertical: 20}]}
                      onPress={() => handleDeletePost()}>
                      <Image
                        source={require('../../assets/delete.png')}
                        style={[mystyles.saveIcon, {tintColor: theme.red}]}
                      />
                      <Text style={[mystyles.textStyle, {color: theme.red}]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const mystyles = StyleSheet.create({
  saveBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  saveIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  viewStyle: {
    paddingVertical: 12,
    marginTop: 6,
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    paddingHorizontal: 20,
  },
  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  textStyle: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    marginLeft: 12,
  },
  iconTextContainer: {flexDirection: 'row', alignItems: 'center'},
});

export default ShowPostOptionModal;
