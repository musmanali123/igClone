import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import {useTheme} from '../../themes/ThemeContext';
import galleryStyle from '../CreatePost/galleryStyle';
import {useNavigation} from '@react-navigation/native';
import ButtonComponent from '../CreateAccount/components/ButtonComponent';
import MyIndicator from '../../components/MyIndicator';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import navigationStrings from '../../navigation/navigationStrings';
import Video from 'react-native-video';

export default function CreateReelScreen({route}) {
  const {theme} = useTheme();
  const styles = galleryStyle(theme);
  const navigation = useNavigation();
  const videoPath = route?.params.videoPath;
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [medialUrls, setMediaUrls] = useState([]);
  const [pauseVideo, setPauseVideo] = useState(false);

  const handleUploadPost = allUrls => {
    try {
      firestore()
        .collection('posts')
        .add({
          caption,
          medialUrls: allUrls,
          time: new Date(),
          userUid: auth().currentUser.uid,
          likes: [],
        })
        .then(() => navigation.navigate('TabRoutes'))
        .catch(er => {
          console.log('getting error while uploading post to firestore: ', er);
        });
    } catch (error) {
      console.log('error in handleUploadPost funtion: ', error);
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

  const uploadVideo = async () => {
    setLoading(true);
    const timestamp = Date.now();
    const imageName = `ReelVideos/${timestamp}.mp4`;
    const reference = storage().ref(imageName);
    try {
      let blobVideo = await uriToBlob(videoPath);
      const task = reference.put(blobVideo);
      await task;
      const downloadURL = await reference.getDownloadURL();
      console.log('video downlaod url: ', downloadURL);
      setLoading(false);
      return downloadURL;
    } catch (error) {
      setLoading(false);
      console.error('Error while uploading video of reel : ', error);
      return null;
    }
  };

  const handleSharePost = async () => {
    try {
      const videoDownloadUrl = await uploadVideo();
      if (videoDownloadUrl !== null) {
        setLoading(true);
        firestore()
          .collection('posts')
          .add({
            caption,
            medialUrls: [videoDownloadUrl],
            time: new Date(),
            userUid: auth().currentUser.uid,
            likes: [],
            type: 'reel',
          })
          .then(() => navigation.navigate('TabRoutes'))
          .catch(er => {
            console.log(
              'getting error while uploading post to firestore: ',
              er,
            );
          });
      }
    } catch (error) {
      setLoading(false);
      console.log('error in handle Share Reel funtion: ', error);
    }
  };

  const onBuffer = data => {
    console.log('on Buffer react native video: ', data);
  };
  const videoError = err => {
    console.log('Error react native video: ', err);
  };
  return (
    <>
      <ScreenComponent style={{flex: 1, backgroundColor: theme.background}}>
        <View
          style={[
            styles.cameraContainer,
            {paddingHorizontal: 20, marginBottom: 20},
          ]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/close.png')}
              style={styles.closeIconStyle}
            />
          </TouchableOpacity>
          <Text style={styles.heading}>Create Reel</Text>
        </View>
        <View style={{paddingHorizontal: 30}}>
          <TouchableOpacity onPress={() => setPauseVideo(!pauseVideo)}>
            <Video
              source={{
                uri: videoPath,
              }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 8,
              }}
              onBuffer={onBuffer}
              onError={videoError}
              resizeMode="cover"
              poster="https://e1.pxfuel.com/desktop-wallpaper/802/816/desktop-wallpaper-black-iphone-7-posted-by-michelle-mercado-black-ios.jpg"
              posterResizeMode="cover"
              repeat
              paused={pauseVideo}
            />
            {pauseVideo && (
              <View style={styles.pauseButtonIconContainer}>
                <Image
                  source={require('../../assets/pause-button.png')}
                  style={styles.pauseButtonIcon}
                />
              </View>
            )}
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                marginTop: 12,
                flex: 1,
                justifyContent: 'space-between',
                paddingBottom: 20,
              }}>
              <View
                style={{
                  marginBottom: 20,
                  borderBottomWidth: 0.5,
                  borderBottomColor: theme.placeholderColor,
                }}>
                <TextInput
                  placeholder="Write a caption..."
                  style={styles.createPostTextInput}
                  placeholderTextColor={theme.placeholderColor}
                  multiline
                  maxLength={200}
                  value={caption}
                  onChangeText={text => setCaption(text)}
                />
              </View>
              <ButtonComponent
                title="Share"
                style={{
                  width: '70%',
                  alignSelf: 'center',
                  height: 40,
                  borderRadius: 8,
                }}
                loading={loading}
                textStyle={{fontSize: 12}}
                onPress={handleSharePost}
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ScreenComponent>
    </>
  );
}
