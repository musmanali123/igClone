import {StyleSheet} from 'react-native';
import fontFamily from '../../styles/fontFamily';
import colors from '../../styles/colors';

const ProfileDrawerStyle = theme => {
  const styles = StyleSheet.create({
    itemDetailContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      //   marginTop: 24,
      //   paddingHorizontal: 14,
    },
    logoutText: {
      fontSize: 14,
      fontFamily: fontFamily.medium,
      marginLeft: 12,
      color: theme.text,
    },
    logoutIconStyle: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
      tintColor: theme.text,
    },
    headerContainer: {
      backgroundColor: 'white',
      paddingVertical: 50,
      alignItems: 'center',
    },
    userNameText: {
      fontSize: 14,
      color: theme.text,
      fontFamily: fontFamily.semiBold,
    },
  });
  return styles;
};

export default ProfileDrawerStyle;
