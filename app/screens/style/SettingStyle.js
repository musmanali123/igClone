import {StyleSheet, Dimensions, Platform} from 'react-native';
import fontFamily from '../../styles/fontFamily';
import colors from '../../styles/colors';

const SettingStyle = theme => {
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  const styles = StyleSheet.create({
    themeModeText: {
      fontSize: 14,
      fontFamily: fontFamily.medium,
      color: theme.lightText,
      marginRight: 12,
    },
  });
  return styles;
};

export default SettingStyle;
