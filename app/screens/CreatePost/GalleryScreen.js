import {
  View,
  Text,
  PermissionsAndroid,
  Alert,
  Platform,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../themes/ThemeContext';
import galleryStyle from './galleryStyle';
import ButtonComponent from '../CreateAccount/components/ButtonComponent';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import MyIndicator from '../../components/MyIndicator';
import ScreenComponent from '../../components/ScreenComponent';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {launchImageLibrary} from 'react-native-image-picker';

export default function GalleryScreen({switchToScreen}) {
  const {theme} = useTheme();
  const styles = galleryStyle(theme);
  const [media, setMedia] = useState([]);
  const [pickedImage, setPickedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectMultiple, setSelectMultiple] = useState(false);
  const [selectAllUri, setSelectAllUri] = useState([]);
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

    let params = {first: 20, assetType: 'All'};
    CameraRoll.getPhotos(params)
      .then(res => {
        setMedia(res.edges);
        setPickedImage(res.edges[0].node.image.uri);
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
        setPickedImage(response.assets[0].uri);
      }
    });
  };

  const handleMultipleMediaSelection = item => {
    if (selectAllUri.includes(item)) {
      const updatedSelection = selectAllUri.filter(
        selectedUri => selectedUri !== item,
      );
      setSelectAllUri(updatedSelection);
    } else {
      setSelectAllUri([...selectAllUri, item]);
    }
  };

  const imagePressed = item => {
    if (selectMultiple) {
      handleMultipleMediaSelection(item.node.image.uri);
    } else {
      setPickedImage(item.node.image.uri);
    }
  };

  const renderItem = ({item}) => {
    const isSelected = selectAllUri.includes(item.node.image.uri);
    let indexOfSelected = 0;
    if (isSelected) {
      let ind = selectAllUri.indexOf(item.node.image.uri);
      indexOfSelected = ind + 1;
    }
    return (
      <View style={{paddingHorizontal: 2}}>
        <TouchableOpacity onPress={() => imagePressed(item)}>
          <Image
            source={{uri: item.node.image.uri}}
            style={styles.allImagesStyle}
            resizeMode="cover"
          />
          {selectMultiple && isSelected && (
            <View style={styles.selectedMediaIndexContainer}>
              <Text style={styles.indextext}>{indexOfSelected}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const handleNextScreen = () => {
    let allImages = [];
    if (selectMultiple) {
      //   console.log(
      //     'handle next screen in this select multiple is true: >>>>>>>>>>   ',
      //     selectAllUri,
      //   );
      switchToScreen(0);
      navigation.navigate(navigationStrings.CREATE_POST_SCREEN, {
        allMedia: selectAllUri,
      });
    } else {
      switchToScreen(0);
      allImages.push(pickedImage);
      //   console.log('single image is selected here: ', allImages);
      navigation.navigate(navigationStrings.CREATE_POST_SCREEN, {
        allMedia: allImages,
      });
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
                onPress={() => switchToScreen(0)}>
                <Image
                  source={require('../../assets/close.png')}
                  style={styles.closeIconStyle}
                />
              </TouchableOpacity>
              <Text style={styles.heading}>New Post</Text>
            </View>
            <TouchableOpacity
              style={styles.nextContainer}
              onPress={handleNextScreen}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          </View>
          {media.length > 0 ? (
            <View style={styles.pickedImageContainer}>
              {pickedImage !== '' && (
                <Image
                  source={{uri: pickedImage}}
                  style={styles.pickedImageStyle}
                />
              )}
            </View>
          ) : (
            <View style={{paddingLeft: 12}}>
              <TouchableOpacity
                style={{paddingHorizontal: 12, paddingVertical: 6}}
                onPress={() =>
                  navigation.navigate(navigationStrings.PHOTO_CAPTURE_SCREEN, {
                    screenName: 'gallery',
                  })
                }>
                <Image
                  source={require('../../assets/camera.png')}
                  style={styles.closeIconStyle}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.recentTextContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {media.length > 0 && (
                <Text style={[styles.recentText, {color: colors.black}]}>
                  Recents
                </Text>
              )}
              <TouchableOpacity
                style={styles.recentAllTextContainer}
                onPress={() => pickImage()}>
                <Text style={[styles.recentText, {color: colors.black}]}>
                  All
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cameraContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(navigationStrings.SHOW_GALLERY_STORY)
                }>
                <Text style={styles.reelStoryText}>Story</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  marginHorizontal: 8,
                }}
                onPress={() =>
                  navigation.navigate(navigationStrings.SHOW_GALLERY_REEL)
                }>
                <Text style={[styles.reelStoryText]}>Reel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.cameraMainContainer,
                  {
                    backgroundColor: selectMultiple
                      ? colors.blue
                      : colors.lightBlackTwo,
                  },
                ]}
                onPress={() => setSelectMultiple(!selectMultiple)}>
                <Image
                  source={require('../../assets/multiple.png')}
                  style={styles.cameraIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cameraMainContainer, {marginLeft: 8}]}
                onPress={() =>
                  navigation.navigate(navigationStrings.PHOTO_CAPTURE_SCREEN, {
                    screenName: 'gallery',
                  })
                }>
                <Image
                  source={require('../../assets/camera.png')}
                  style={styles.cameraIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1, paddingHorizontal: 8, marginTop: 12}}>
            <FlatList
              data={media}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              numColumns={3}
              ItemSeparatorComponent={<View style={{marginVertical: 2}} />}
              // columnWrapperStyle={{
              //   justifyContent: 'space-between',
              //   // margin: 4,
              // }}
            />
          </View>
        </View>
      </ScreenComponent>
      <MyIndicator visible={loading} />
    </>
  );
}
