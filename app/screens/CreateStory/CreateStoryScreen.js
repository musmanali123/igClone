import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import {useTheme} from '../../themes/ThemeContext';
import galleryStyle from '../CreatePost/galleryStyle';
import {useNavigation} from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function CreateStoryScreen({route}) {
  const {theme} = useTheme();
  const styles = galleryStyle(theme);
  const navigation = useNavigation();
  const [allmedialUrls, setAllMediaUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const medialUrls = route.params?.allMedia;

  const handleUploadStory = allUrls => {
    try {
      firestore()
        .collection('story')
        .add({
          stories: allUrls,
          time: new Date(),
          userUid: auth().currentUser.uid,
          likes: [],
          seen: [],
          user_image: auth().currentUser.photoURL,
          user_name: auth().currentUser.displayName,
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

  const uploadImages = async newImages => {
    setLoading(true);
    try {
      let allUrls = [];
      await Promise.all(
        newImages.map(async image => {
          let blobMedia = await uriToBlob(image);
          const timestamp = Date.now();
          const postId = `story_${timestamp}`;
          const imageRef = storage().ref(`storyImages/${postId}.jpg`);
          await imageRef.put(blobMedia);
          const downloadURL = await imageRef.getDownloadURL();
          allUrls.push({story_image: downloadURL});
          // setAllMediaUrls(prevData => [...prevData, downloadURL]);
        }),
      );
      setLoading(false);
      handleUploadStory(allUrls);
    } catch (error) {
      console.error('Error uploading images: ', error);
      setLoading(false);
    }
  };

  const handleShareStory = async () => {
    try {
      await uploadImages(medialUrls);
    } catch (error) {
      console.log('error in handleSharePost funtion: ', error);
    }
  };

  return (
    <>
      <ScreenComponent style={{flex: 1, backgroundColor: theme.background}}>
        <View style={{alignItems: 'center'}}>
          <FlatList
            data={medialUrls}
            renderItem={({item}) => {
              return (
                <Image
                  source={{uri: item}}
                  style={[
                    styles.createStoryImage,
                    {
                      marginRight: medialUrls.length > 1 ? 8 : 0,
                      marginLeft: medialUrls.length > 1 ? 4 : 0,
                    },
                  ]}
                />
              );
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity
            style={[
              styles.forwardIconContainer,
              {position: 'absolute', top: 10, left: 14},
            ]}
            onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/backward.png')}
              style={styles.forwardIcon}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: 'flex-end',
            marginTop: 20,
            paddingHorizontal: 20,
          }}>
          <TouchableOpacity
            style={styles.forwardIconContainer}
            onPress={handleShareStory}>
            {loading ? (
              <ActivityIndicator size={16} color={theme.background} />
            ) : (
              <Image
                source={require('../../assets/forward.png')}
                style={styles.forwardIcon}
              />
            )}
          </TouchableOpacity>
        </View>
      </ScreenComponent>
    </>
  );
}
