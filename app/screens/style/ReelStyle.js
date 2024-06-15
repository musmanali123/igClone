import {StyleSheet, Dimensions, Platform} from 'react-native';
import fontFamily from '../../styles/fontFamily';
import colors from '../../styles/colors';

const ReelStyle = theme => {
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.profileBg,
    },
    reelTextStyle: {
      fontSize: 18,
      color: colors.white,
      position: 'absolute',
      top: 40,
      left: 14,
      fontFamily: fontFamily.semiBold,
    },
    reelCameraIcon: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
      tintColor: colors.white,
    },
    reelCameraIconContainer: {
      position: 'absolute',
      top: 40,
      right: 14,
    },
  });
  return styles;
};

export default ReelStyle;
