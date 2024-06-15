import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import {useTheme} from '../../themes/ThemeContext';
import galleryStyle from './galleryStyle';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import colors from '../../styles/colors';
import navigationStrings from '../../navigation/navigationStrings';

export default function PhotoCaptureScreen({route}) {
  const {theme} = useTheme();
  const styles = galleryStyle(theme);
  const [selectedImage, setSelectedImage] = useState('');
  const navigation = useNavigation();
  const screenName = route.params?.screenName;
  console.log('screen Name is: ', screenName);

  const handleCameraLaunch = () => {
    try {
      const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      };

      launchCamera(options, response => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.error) {
          console.log('Camera Error: ', response.error);
        } else {
          // console.log('response: ', response);
          let imageUri = response.uri || response.assets?.[0]?.uri;
          setSelectedImage(imageUri);
        }
      });
    } catch (error) {
      console.log(
        'Error while capture photo of user in photo capture screen: ',
        error,
      );
    }
  };

  useEffect(() => {
    handleCameraLaunch();
  }, []);

  const handleNextScreen = () => {
    if (screenName === 'gallery') {
      if (selectedImage !== '') {
        let allImages = [];
        allImages.push(selectedImage);
        navigation.navigate(navigationStrings.CREATE_POST_SCREEN, {
          allMedia: allImages,
        });
      }
    } else if (screenName === 'story') {
      if (selectedImage !== '') {
        let imgs = [];
        imgs.push(selectedImage);
        navigation.navigate(navigationStrings.CREATE_STORY_SCREEN, {
          allMedia: imgs,
        });
      }
    } else {
      return null;
    }
  };

  return (
    <>
      <ScreenComponent style={{flex: 1, backgroundColor: theme.background}}>
        <View style={myStyles.topContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={myStyles.iconContainer}>
            <Image
              source={require('../../assets/close.png')}
              style={[styles.closeIconStyle, {width: 18, height: 18}]}
            />
          </TouchableOpacity>
          {selectedImage !== '' && (
            <TouchableOpacity
              style={myStyles.iconContainer}
              onPress={handleNextScreen}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
        {selectedImage !== '' && (
          <View style={{alignItems: 'center', marginTop: 12}}>
            <Image
              source={{uri: selectedImage}}
              style={{width: '90%', height: 200}}
            />
          </View>
        )}
      </ScreenComponent>
    </>
  );
}

const myStyles = StyleSheet.create({
  topContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {paddingHorizontal: 8, paddingVertical: 4},
});
