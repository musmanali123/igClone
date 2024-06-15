import {StyleSheet} from 'react-native';
import fontFamily from '../../styles/fontFamily';

const BottomTabStyle = theme => {
  const styles = StyleSheet.create({
    bottomTabContainer: {
      height: 70,
      backgroundColor: theme.bottonTabBg,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingHorizontal: 28,
      position: 'absolute',
      width: '100%',
      bottom: 0,
      borderTopWidth: 0.2,
      borderColor: theme.bottonTabBorderColor,
      paddingTop: 6,
    },
    iconStyle: {
      width: 22,
      height: 22,
      resizeMode: 'contain',
      tintColor: theme.bottonTabIconColor,
    },
    iconContainer: {
      paddingHorizontal: 18,
      paddingVertical: 5,
    },
    userProfilePicStyle: {
      width: 28,
      height: 28,
      borderRadius: 14,
    },
  });
  return styles;
};

export default BottomTabStyle;
