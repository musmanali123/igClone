import {StyleSheet} from 'react-native';
import fontFamily from './fontFamily';

const AuthStyles = theme => {
  const styles = StyleSheet.create({
    heading: {
      fontSize: 22,
      color: theme.text,
      fontFamily: fontFamily.semiBold,
      marginBottom: 18,
      marginTop: 8,
    },
    errorText: {
      fontSize: 12,
      color: theme.red,
      marginTop: 6,
      paddingLeft: 6,
      fontFamily: fontFamily.medium,
    },
    descText: {
      fontSize: 14,
      color: theme.text,
      marginBottom: 14,
      fontFamily: fontFamily.medium,
    },
    userProfileStyle: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    cameraIconContainer: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#d3d3d3',
      position: 'absolute',
      bottom: 4,
      right: 2,
    },
    cameraIcon: {
      width: 18,
      height: 18,
      tintColor: theme.storyBg,
      resizeMode: 'contain',
    },
    profilePicStyle: {
      width: 90,
      height: 90,
      borderRadius: 45,
    },
  });
  return styles;
};

export default AuthStyles;
