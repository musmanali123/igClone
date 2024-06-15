import {useState, useEffect} from 'react';
import {Platform, Alert} from 'react-native';

import {
  PERMISSIONS,
  requestMultiple,
  openSettings,
  request,
} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

export const getCameraPermission = () => {
  request(
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : PERMISSIONS.ANDROID.CAMERA,
  ).then(result => {
    // setPermissionResult(result)
    console.log(result);
  });
};
