import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import React, {useState} from 'react';
import ButtonComponent from './ButtonComponent';
import {useTheme} from '../../../themes/ThemeContext';
import AuthStyles from '../../../styles/AuthStyles';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

export default function GetUserProfileImage({
  selectedIndex,
  setSelectedIndex,
  setUserProfilePicUrl,
  userProfilePicUrl,
}) {
  const {theme} = useTheme();
  const styles = AuthStyles(theme);
  const [profilePickError, setProfilePickError] = useState(false);
  const [profilePickErrorText, setProfilePickErrorText] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

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

  const uploadImage = async uri => {
    setLoading(true);
    const timestamp = Date.now();
    const imageName = `profileImages/${timestamp}.jpg`;
    const reference = storage().ref(imageName);

    try {
      let blobImg = await uriToBlob(uri);
      const task = reference.put(blobImg);
      await task;
      const downloadURL = await reference.getDownloadURL();
      setUserProfilePicUrl(downloadURL);
      setLoading(false);
      setSelectedIndex(selectedIndex + 1);
    } catch (error) {
      if (error.code == 'storage/unknown') {
        setLoading(false);
        console.log('error while uploading profile picture: ', error);
        return null;
      }
      console.error('Error uploading image: ', error.message);
      Alert('Image not uploaded');
      setLoading(false);
    }
  };

  const handleNextScreen = () => {
    if (image == '') {
      setProfilePickError(true);
      setProfilePickErrorText('Please select your picture!');
      return null;
    } else {
      setProfilePickError(false);
      setProfilePickErrorText('');
    }
    uploadImage(image);
    // setSelectedIndex(selectedIndex + 1);
  };

  const pickImage = () => {
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
        setImage(response.assets[0].uri);
        setProfilePickError(false);
        setProfilePickErrorText('');
      }
    });
  };

  return (
    <View>
      <Text style={styles.heading}>Select your profile picture!</Text>
      <Text style={styles.descText}>
        Your profile picture is show on your profile
      </Text>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.storyBg,
          }}
          onPress={pickImage}>
          {image !== '' ? (
            <Image source={{uri: image}} style={styles.profilePicStyle} />
          ) : (
            <Image
              source={require('../../../assets/profile_avatar.png')}
              style={styles.profilePicStyle}
            />
          )}
          {image === '' && (
            <View style={styles.cameraIconContainer}>
              <Image
                source={require('../../../assets/camera.png')}
                style={styles.cameraIcon}
              />
            </View>
          )}
        </TouchableOpacity>
        {profilePickError ? (
          <Text style={styles.errorText}>{profilePickErrorText}</Text>
        ) : null}
      </View>

      <View style={{marginTop: 20}}>
        <ButtonComponent
          title="Next"
          onPress={handleNextScreen}
          loading={loading}
        />
        <ButtonComponent
          title="Skip"
          onPress={() => {
            setSelectedIndex(selectedIndex + 1);
          }}
          style={{marginTop: 20}}
        />
      </View>
    </View>
  );
}
