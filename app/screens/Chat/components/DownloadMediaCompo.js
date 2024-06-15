import {
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import React from 'react';
import {useTheme} from '../../../themes/ThemeContext';
import RNFetchBlob from 'rn-fetch-blob';

const DownloadMediaCompo = ({url, mediaType}) => {
  const {theme} = useTheme();

  const checkPermission = async () => {
    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission

    if (Platform.OS === 'ios') {
      downloadImage();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'App needs access to your storage to download Photos and Videos!',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          console.log('Storage Permission Granted.');
          downloadImage();
        } else {
          // If permission denied then show alert
          Alert.alert('Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log(err);
      }
    }
  };

  const downloadImage = () => {
    // Main function to download the image

    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = url;
    // Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    const fileName =
      mediaType == 'image'
        ? 'image_' + Math.floor(date.getTime() + date.getSeconds() / 2) + '.jpg'
        : 'video_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          '.mp4';
    const destPath = RNFetchBlob.fs.dirs.DownloadDir + '/' + fileName;

    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        // path:
        //   PictureDir +
        //   '/image_' +
        //   Math.floor(date.getTime() + date.getSeconds() / 2) +
        //   ext,
        path: destPath,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        // console.log('res -> ', JSON.stringify(res));
        mediaType == 'image'
          ? Alert.alert('Image Downloaded Successfully.')
          : Alert.alert('Video Downloaded Successfully.');
      });
  };

  const getExtention = filename => {
    // To get the file extension
    let extention = /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
    return extention;
  };

  return (
    <>
      <TouchableOpacity
        style={{position: 'absolute', top: 10, right: 20}}
        onPress={downloadImage}>
        <Image
          source={require('../../../assets/download.png')}
          style={{
            width: 20,
            height: 20,
            tintColor: theme.text,
          }}
        />
      </TouchableOpacity>
    </>
  );
};

export default DownloadMediaCompo;
