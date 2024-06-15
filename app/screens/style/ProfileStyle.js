import {StyleSheet, Dimensions, Platform} from 'react-native';
import fontFamily from '../../styles/fontFamily';
import colors from '../../styles/colors';

const ProfileStyle = theme => {
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.profileBg,
    },
    userName: {
      fontSize: 12,
      color: theme.text,
      fontFamily: fontFamily.regular,
    },
    drawerIcon: {
      width: 14,
      height: 14,
      resizeMode: 'contain',
      tintColor: theme.text,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginTop: 12,
    },
    drawerIconContainer: {
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    profileImageContainer: {
      width: 90,
      height: 90,
      borderRadius: 45,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.profileImgBorder,
    },
    profileImageStyle: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    followingContentText: {
      color: theme.postCaption,
      fontSize: 15,
      //   fontFamily: fontFamily.medium,
    },
    followingContentText1: {
      color: theme.postCaption,
      fontSize: 12,
      //   fontFamily: fontFamily.regular,
    },
    followingTextContainer: {
      alignItems: 'center',
    },
    userDetailContainer: {
      paddingHorizontal: 20,
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    followerContainer: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    bioContainer: {
      paddingHorizontal: 30,
      marginVertical: 12,
    },
    bioText: {
      width: '80%',
      color: theme.postCaption,
      fontSize: 12,
      fontFamily: fontFamily.regular,
    },
    editProfileBtnContainer: {
      height: 34,
      backgroundColor: theme.background,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0.6,
      borderColor: theme.profileImgBorder,
    },
    editProfileBtnText: {
      fontSize: 12,
      color: theme.text,
      fontFamily: fontFamily.semiBold,
    },
    profileTabsIconStyle: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
      tintColor: theme.profileGray,
    },
    profileTabsIconContainer: {
      flex: 1,
      alignItems: 'center',
      borderBottomWidth: 0.5,
      borderBottomColor: theme.profileImgBorder,
      paddingBottom: 12,
    },
    profileTabContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
    },
    editProfileText: {
      fontSize: 14,
      fontFamily: fontFamily.medium,
      color: theme.text,
    },
    editProfileTextContainer: {
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    editProfileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
    },
    editPofileImageContainer: {
      alignItems: 'center',
      paddingHorizontal: 4,
      paddingVertical: 4,
    },
    userImageStyle: {
      width: 90,
      height: 90,
      borderRadius: 45,
    },
    editProfileUserDetailContainer: {
      marginVertical: 10,
      paddingVertical: 10,
      borderTopWidth: 0.5,
      borderTopColor: theme.profileImgBorder,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.profileImgBorder,
      paddingHorizontal: 20,
    },
    errorText: {
      fontSize: 12,
      color: theme.red,
      fontFamily: fontFamily.regular,
      alignSelf: 'center',
    },
    editProfileDownIconContainer: {
      position: 'absolute',
      right: 0,
      bottom: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    editPofileDownIconStyle: {
      width: 12,
      height: 12,
      resizeMode: 'contain',
      tintColor: theme.text,
    },
    editProfileDownModal: {
      width: '50%',
      backgroundColor: theme.bottonTabBg,
      paddingHorizontal: 12,
      paddingVertical: 14,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: theme.profileImgBorder,
    },
    editProfileGenderText: {
      fontSize: 14,
      color: theme.lightText,
      fontFamily: fontFamily.medium,
      marginLeft: 12,
    },
    userProfileFollowBtn: {
      backgroundColor: theme.userProfileBlue,
      paddingVertical: 6,
      borderRadius: 6,
      alignItems: 'center',
      flex: 1,
    },
    userProfileFollowText: {
      fontSize: 12,
      color: theme.text,
      fontFamily: fontFamily.semiBold,
    },
    userProfileFollowBtnContainer: {
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    userImageModalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeIconContainerModal: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.blue,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 20,
      right: 20,
    },
    closeIconModal: {
      width: 14,
      height: 14,
      resizeMode: 'contain',
      tintColor: 'black',
    },
  });
  return styles;
};

export default ProfileStyle;
