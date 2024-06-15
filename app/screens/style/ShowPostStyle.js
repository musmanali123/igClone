import {StyleSheet} from 'react-native';
import fontFamily from '../../styles/fontFamily';

const ShowPostStyle = theme => {
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
    UserimgStyle: {
      width: 40,
      height: 40,
      borderRadius: 40 / 2,
    },
    postImage: {
      width: '100%',
      height: 270,
    },
    threeDotIcon: {
      width: 14,
      height: 14,
      resizeMode: 'contain',
      tintColor: theme.text,
    },
    userDetailText: {
      fontSize: 11,
      color: theme.text,
      fontFamily: fontFamily.regular,
    },
    captionText: {
      fontSize: 11,
      color: theme.postCaption,
      fontFamily: fontFamily.regular,
    },
    captionContainer: {
      paddingHorizontal: 14,
      paddingVertical: 4,
    },
    postIconsStyle: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
      tintColor: theme.text,
    },
    postIconsContainer: {
      paddingHorizontal: 4,
      paddingVertical: 6,
    },
    photoNoContainer: {
      position: 'absolute',
      top: 10,
      right: 8,
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 15,
      backgroundColor: '#121212',
      opacity: 8,
    },
    postFistContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    starIcon: {
      width: 16,
      height: 16,
      resizeMode: 'contain',
    },
  });
  return styles;
};

export default ShowPostStyle;
