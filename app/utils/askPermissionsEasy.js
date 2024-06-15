import {useState, useEffect} from 'react';
import {Platform, Alert} from 'react-native';

import {
  PERMISSIONS,
  requestMultiple,
  openSettings,
} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

export default askPermissionsEasy = () => {
  const [areAllPermissionsAllowed, setAreAllPermissionsAllowed] =
    useState(false);
  const [sdkVersion, setSdkVersion] = useState(28);

  useEffect(() => {
    getSDKVersion();
  }, []);

  const getSDKVersion = async () => {
    var apiVersion = await DeviceInfo.getApiLevel();
    setSdkVersion(apiVersion);
  };

  const requestPermissionn = async () => {
    const permissions =
      Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY]
        : [
            PERMISSIONS.ANDROID.CAMERA,
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          ];
    console.log('permisions is: ', permissions);
    const result = await requestMultiple(permissions);

    if (Platform.OS === 'ios') {
      if (
        result[PERMISSIONS.IOS.CAMERA] === 'granted' &&
        result[PERMISSIONS.IOS.PHOTO_LIBRARY] === 'granted'
      ) {
        console.log('ios permissions are allowed');
        setAreAllPermissionsAllowed(true);
        return true;
      } else {
        console.log('ios permissions not allowed');
        Alert.alert(
          'Permissions Rejected',
          'Permissions are required in order to Capture/Pick Images.',
          [
            {
              text: 'Allow',
              onPress: () =>
                openSettings().catch(() => console.log('cannot open settings')),
            },
            {
              text: 'Dismiss',
              onPress: () => console.log('Dismiss Pressed'),
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
        setAreAllPermissionsAllowed(false);
        return false;
      }
    } else {
      if (sdkVersion < 28) {
        if (
          result[PERMISSIONS.ANDROID.CAMERA] === 'granted' &&
          result[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === 'granted' &&
          result[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'granted'
        ) {
          console.log('android permission is allowed');
          setAreAllPermissionsAllowed(true);
          return true;
        } else {
          console.log('android permission is not allowed');
          Alert.alert(
            'Permissions Rejected',
            'Permissions are required in order to Capture/Pick Images.',
            [
              {
                text: 'Allow',
                onPress: () =>
                  openSettings().catch(() =>
                    console.log('cannot open settings'),
                  ),
              },
              {
                text: 'Dismiss',
                onPress: () => console.log('Dismiss Pressed'),
                style: 'cancel',
              },
            ],
            {cancelable: false},
            //on clicking out side, Alert will not dismiss
          );
          setAreAllPermissionsAllowed(false);
          return false;
        }
      } else {
        if (result[PERMISSIONS.ANDROID.CAMERA] === 'granted') {
          console.log('android permission is allowed');
          setAreAllPermissionsAllowed(true);
          return true;
        }
      }
    }
  };

  return {requestPermissionn, areAllPermissionsAllowed};
};
