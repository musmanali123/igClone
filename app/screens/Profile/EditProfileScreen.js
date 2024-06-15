import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import FastImage from 'react-native-fast-image';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../themes/ThemeContext';
import ProfileStyle from '../style/ProfileStyle';
import firestore from '@react-native-firebase/firestore';
import MyIndicator from '../../components/MyIndicator';
import ScreenComponent from '../../components/ScreenComponent';
import fontFamily from '../../styles/fontFamily';
import colors from '../../styles/colors';
import EditProfileTextInputCompo from '../CreateAccount/components/EditProfileTextInputCompo';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export default function EditProfileScreen({route}) {
  const userData = route.params?.userData;
  const {theme} = useTheme();
  const styles = ProfileStyle(theme);
  const navigation = useNavigation();
  const [laoding, setLoading] = useState(false);
  const [userName, setUserName] = useState(userData?.fullName);
  const [userBio, setUserBio] = useState(userData?.bio);
  const [userWebsite, setUserWebsite] = useState(userData?.website);
  const [userGender, setUserGender] = useState(userData?.gender);
  const [userNewImage, setUserNewImage] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [userWebsiteError, setUserWebsiteError] = useState('');
  const [showGenderModal, setShowGenderModal] = useState(false);

  const handleNewProfileImageSelection = () => {
    try {
      const options = {
        title: 'Select Photo',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.assets[0].uri) {
          setUserNewImage(response.assets[0].uri);
        }
      });
    } catch (error) {
      console.log(
        'Error while taking profile pic in edit profile screen from gallery: ',
        error,
      );
    }
  };
  function isURL(str) {
    var pattern = new RegExp(
      '^((ft|htt)ps?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?' + // port
        '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
        '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator
    return pattern.test(str);
  }

  const UpdateWithOutImage = async () => {
    try {
      setLoading(true);
      await auth().currentUser?.updateProfile({
        displayName: userName,
      });
      await firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .update({
          fullName: userName,
          bio: userBio,
          website: userWebsite,
          gender: userGender,
        })
        .then(() => {
          setLoading(false);
          console.log('profile is updated with out image');
          navigation.goBack();
        })
        .catch(er => {
          setLoading(false);
          console.log('error while uopdating data of user in firestore: ', er);
        });
    } catch (error) {
      setLoading(false);

      console.log('error while updating profile: ', error);
    }
  };

  const uriToBlob = uri => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error('uriToBlob failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);

      xhr.send(null);
    });
  };

  const UpdateWithImage = async () => {
    try {
      setLoading(true);

      const isSigned = await GoogleSignin.isSignedIn();
      let ref;
      // if (!isSigned) {
      //   console.log('ddf');
      //   console.log(userData?.imageName);
      //   ref = storage().refFromURL(userData?.imageUrl);
      // } else {
      //   const timestamp = Date.now();
      //   const imageName = `profileImages/${timestamp}.jpg`;
      //   ref = storage().ref(imageName);
      // }
      const timestamp = Date.now();
      const imageName = `profileImages/${timestamp}.jpg`;
      ref = storage().ref(imageName);
      let blobImg = await uriToBlob(userNewImage);
      const task = await ref.put(blobImg);
      const downloadURL = await ref.getDownloadURL();
      await auth().currentUser?.updateProfile({
        displayName: userName,
        photoURL: downloadURL,
      });
      await firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .update({
          fullName: userName,
          imageUrl: downloadURL,
          bio: userBio,
          website: userWebsite,
          gender: userGender,
        })
        .then(() => {
          setLoading(false);
          console.log('profile is updated');
          navigation.goBack();
        })
        .catch(er => {
          setLoading(false);
          console.log('error while uopdating data of user in firestore: ', er);
        });
    } catch (error) {
      setLoading(false);

      console.log('error while updating profile: ', error);
    }
  };

  const handleUpdateProfile = () => {
    if (userName == '') {
      setUserNameError('Please Enter Your Name!');
      return;
    } else {
      setUserNameError('');
    }
    if (userWebsite !== '') {
      const res = isURL(userWebsite);
      console.log('res: ', res);
      if (!res) {
        setUserWebsiteError('Enter valid url of your website!');
        return;
      } else {
        setUserWebsiteError('');
      }
    }
    if (userNewImage == '') {
      setShowGenderModal(false);
      UpdateWithOutImage();
    } else {
      setShowGenderModal(false);
      UpdateWithImage();
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <View style={styles.editProfileHeader}>
          <TouchableOpacity
            style={styles.editProfileTextContainer}
            onPress={() => navigation.goBack()}>
            <Text style={styles.editProfileText}>Cancel</Text>
          </TouchableOpacity>
          <Text
            style={[
              styles.editProfileText,
              {fontFamily: fontFamily.semiBold, fontSize: 15},
            ]}>
            Edit Profile
          </Text>
          <TouchableOpacity
            style={styles.editProfileTextContainer}
            onPress={handleUpdateProfile}>
            <Text style={[styles.editProfileText, {color: colors.blue}]}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                flex: 1,
              }}>
              <View style={{alignItems: 'center', marginTop: 12}}>
                <TouchableOpacity
                  style={styles.editPofileImageContainer}
                  activeOpacity={0.8}
                  onPress={handleNewProfileImageSelection}>
                  <FastImage
                    // source={{
                    //   uri:
                    //     userNewImage !== '' ? userNewImage : userData?.imageUrl,
                    // }}
                    source={{
                      uri:
                        userNewImage !== ''
                          ? userNewImage
                          : userData?.imageUrl !== ''
                          ? userData?.imageUrl
                          : 'https://static.thenounproject.com/png/363640-200.png',
                    }}
                    style={styles.userImageStyle}
                  />
                  <Text
                    style={[
                      styles.editProfileText,
                      {color: colors.blue, marginTop: 8},
                    ]}>
                    Change Profile Photo
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.editProfileUserDetailContainer}>
                <EditProfileTextInputCompo
                  label="Name"
                  placeholder="Enter Name"
                  value={userName}
                  onChangeText={text => setUserName(text)}
                />
                {userNameError.length > 0 && (
                  <Text style={styles.errorText}>{userNameError}</Text>
                )}
                <EditProfileTextInputCompo
                  label="Website"
                  placeholder="Enter Website Url"
                  value={userWebsite}
                  onChangeText={text => setUserWebsite(text)}
                  autoCapitalize="none"
                  keyboardType="url"
                />
                {userWebsiteError.length > 0 && (
                  <Text style={styles.errorText}>{userWebsiteError}</Text>
                )}
                <EditProfileTextInputCompo
                  label="Bio"
                  placeholder="Enter Bio"
                  value={userBio}
                  onChangeText={text => setUserBio(text)}
                />
              </View>
              <View style={{paddingHorizontal: 20, marginTop: 10}}>
                <Text
                  style={[
                    styles.editProfileText,
                    {fontFamily: fontFamily.semiBold, marginBottom: 20},
                  ]}>
                  Private Information
                </Text>
                <EditProfileTextInputCompo
                  label="Email"
                  placeholder="Enter Email"
                  value={userData?.email}
                  editable={false}
                />
                <View style={{marginTop: 8}}>
                  <EditProfileTextInputCompo
                    label="Gender"
                    placeholder="Select Gender"
                    value={userGender}
                    editable={false}
                  />
                  <TouchableOpacity
                    style={styles.editProfileDownIconContainer}
                    onPress={() => setShowGenderModal(!showGenderModal)}>
                    <Image
                      source={
                        showGenderModal
                          ? require('../../assets/upward.png')
                          : require('../../assets/downward.png')
                      }
                      style={styles.editPofileDownIconStyle}
                    />
                  </TouchableOpacity>
                </View>
                {showGenderModal && (
                  <View style={{alignItems: 'flex-end'}}>
                    <View style={styles.editProfileDownModal}>
                      <TouchableOpacity
                        style={myStyles.circleContainer}
                        onPress={() => setUserGender('Male')}>
                        <View
                          style={
                            userGender === 'Male'
                              ? myStyles.fillCircle
                              : myStyles.outlineCircle
                          }
                        />
                        <Text style={styles.editProfileGenderText}>Male</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={myStyles.circleContainer}
                        onPress={() => setUserGender('Female')}>
                        <View
                          style={
                            userGender === 'Female'
                              ? myStyles.fillCircle
                              : myStyles.outlineCircle
                          }
                        />
                        <Text style={styles.editProfileGenderText}>Female</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={myStyles.circleContainer}
                        onPress={() => setUserGender('Other')}>
                        <View
                          style={
                            userGender === 'Other'
                              ? myStyles.fillCircle
                              : myStyles.outlineCircle
                          }
                        />
                        <Text style={styles.editProfileGenderText}>Other</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {/* <View>
                  <Text style={{fontSize: 14, color: theme.text}}>
                    Fcm Token:{' '}
                  </Text>
                  <Text style={{fontSize: 10, color: theme.text}}>
                    {userData?.fcmToken !== undefined
                      ? userData?.fcmToken
                      : 'No fcm token is found'}
                  </Text>
                </View> */}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ScreenComponent>
      <MyIndicator visible={laoding} backgroundColor={theme.authInputColor} />
    </>
  );
}

const myStyles = StyleSheet.create({
  outlineCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: colors.blue,
  },
  circleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fillCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.blue,
  },
});
