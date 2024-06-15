import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    return false;
  }
};

export const getLocation = async () => {
  if (Platform.OS === 'android') {
    const granted = await requestLocationPermission();

    if (granted) {
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => {
            resolve(position);
          },
          error => {
            reject(error);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      });
    } else {
      throw new Error('Location permission denied');
    }
  } else {
    // throw new Error('Unsupported platform');
  }
};
