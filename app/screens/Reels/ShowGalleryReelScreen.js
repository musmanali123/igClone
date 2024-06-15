import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import galleryStyle from '../CreatePost/galleryStyle';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import MyIndicator from '../../components/MyIndicator';
import ScreenComponent from '../../components/ScreenComponent';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {useTheme} from '../../themes/ThemeContext';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export default function ShowGalleryReelScreen() {
  const {theme} = useTheme();
  const styles = galleryStyle(theme);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectMultiple, setSelectMultiple] = useState(false);
  const [selectVideoUri, setVideoUri] = useState('');
  const navigation = useNavigation();

  async function hasAndroidPermission() {
    const getCheckPermissionPromise = () => {
      if (Platform.Version >= 33) {
        return Promise.all([
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          ),
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ),
        ]).then(
          ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
            hasReadMediaImagesPermission && hasReadMediaVideoPermission,
        );
      } else {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
    };

    const hasPermission = await getCheckPermissionPromise();
    if (hasPermission) {
      return true;
    }
    const getRequestPermissionPromise = () => {
      if (Platform.Version >= 33) {
        return PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]).then(
          statuses =>
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
      }
    };

    return await getRequestPermissionPromise();
  }

  async function savePicture() {
    setLoading(true);
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      setLoading(false);
      return;
    }

    let params = {
      first: 20,
      assetType: 'Videos',
      includes: ['fileSize', 'playableDuration'],
    };
    CameraRoll.getPhotos(params)
      .then(res => {
        setMedia(res.edges);
        setLoading(false);
      })
      .catch(err => {
        console.log('error is: ', err);
        setLoading(false);
      });

    // CameraRoll.getAlbums(params)
    //   .then(res => {
    //     console.log('album result is: ', res);
    //   })
    //   .catch(err => {
    //     console.log('error while getting album: ', err);
    //   });
  }

  useEffect(() => {
    savePicture();
  }, []);

  const imagePressed = item => {
    const videoPath = item.node.image.uri;
    navigation.navigate(navigationStrings.CREATE_REEL_SCREEN, {
      videoPath: videoPath,
    });
  };

  const renderItem = ({item}) => {
    return (
      <View style={{padding: 4}}>
        <TouchableOpacity onPress={() => imagePressed(item)}>
          <Image
            source={{uri: item.node.image.uri}}
            style={[styles.allImagesStyle, {height: 200}]}
            resizeMode="cover"
          />
          <Image
            source={require('../../assets/video_button.png')}
            style={styles.videoIconStyle}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const handleNextScreen = () => {};

  const handleRecordVideo = () => {
    try {
      const options = {
        mediaType: 'video',
        videoQuality: 'medium',
        durationLimit: 60,
        thumbnail: true,
        allowsEditing: true,
      };

      launchCamera(options, response => {
        if (response.didCancel) {
          console.log('User cancelled video picker');
          return true;
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.warn('User tapped custom button: ', response.customButton);
        } else {
          let videoUri = response.uri || response.assets?.[0]?.uri;
          if (videoUri !== undefined && videoUri !== null && videoUri !== '') {
            navigation.navigate(navigationStrings.CREATE_REEL_SCREEN, {
              videoPath: videoUri,
            });
          }
        }
      });
    } catch (error) {
      console.log(
        'Error while recording video for reel in Gallery Reel Screen: ',
        error,
      );
    }
  };

  const handleGetAllVideos = () => {
    try {
      const options = {
        title: 'Select Video',
        storageOptions: {
          skipBackup: true,
          path: 'videos',
        },
        mediaType: 'video',
        durationLimit: 60,
      };

      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.assets[0].uri) {
          let videoUri = response?.assets[0]?.uri;
          console.log('video uri is: ', videoUri);
          if (videoUri !== undefined && videoUri !== null && videoUri !== '') {
            navigation.navigate(navigationStrings.CREATE_REEL_SCREEN, {
              videoPath: videoUri,
            });
          }
        }
      });
    } catch (error) {
      console.log(
        'Error while recording video for reel in Gallery Reel Screen: ',
        error,
      );
    }
  };

  return (
    <>
      <ScreenComponent style={{flex: 1, backgroundColor: theme.background}}>
        <View style={{flex: 1}}>
          <View style={styles.headerContainer}>
            <View style={styles.headingIconContainer}>
              <TouchableOpacity
                style={styles.headingiconImageContainer}
                onPress={() => navigation.goBack()}>
                <Image
                  source={require('../../assets/close.png')}
                  style={styles.closeIconStyle}
                />
              </TouchableOpacity>
              <Text style={styles.heading}>Add Reel</Text>
            </View>
            {selectVideoUri !== '' && (
              <TouchableOpacity
                style={styles.nextContainer}
                onPress={handleNextScreen}>
                <Text style={styles.nextText}>Next</Text>
              </TouchableOpacity>
            )}
          </View>
          {media.length > 0 ? (
            <View style={styles.recentTextContainer}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.recentText, {color: colors.black}]}>
                  Recents
                </Text>
                <TouchableOpacity
                  style={{
                    marginLeft: 4,
                    paddingHorizontal: 8,
                  }}
                  onPress={handleGetAllVideos}>
                  <Text style={[styles.recentText, {color: colors.black}]}>
                    All
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.cameraContainer}>
                <TouchableOpacity
                  style={[styles.cameraMainContainer, {marginLeft: 8}]}
                  // onPress={() =>
                  //   navigation.navigate(navigationStrings.PHOTO_CAPTURE_SCREEN)
                  // }
                  onPress={handleRecordVideo}>
                  <Image
                    source={require('../../assets/camera.png')}
                    style={styles.cameraIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={myStyles.cameraContainer}>
              <TouchableOpacity
                style={myStyles.cameraTouchablOpacticty}
                onPress={() =>
                  navigation.navigate(navigationStrings.PHOTO_CAPTURE_SCREEN)
                }>
                <Image
                  source={require('../../assets/camera.png')}
                  style={[myStyles.cameraIcon, {tintColor: theme.text}]}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={{flex: 1, paddingHorizontal: 8, marginTop: 12}}>
            <FlatList
              data={media}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              numColumns={3}
              ItemSeparatorComponent={<View style={{marginVertical: 2}} />}
              //   columnWrapperStyle={{
              //     justifyContent: 'space-between',
              //   }}
            />
          </View>
        </View>
      </ScreenComponent>
      <MyIndicator visible={loading} />
    </>
  );
}

const myStyles = StyleSheet.create({
  cameraContainer: {
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
  cameraTouchablOpacticty: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  cameraIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
