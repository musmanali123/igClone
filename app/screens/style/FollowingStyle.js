import {StyleSheet, Dimensions, Platform} from 'react-native';
import fontFamily from '../../styles/fontFamily';
import colors from '../../styles/colors';

const FollowingStyle = theme => {
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  const styles = StyleSheet.create({
    followerTabMainConatainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    followerTabConatainer: {
      borderBottomWidth: 0.5,
      borderBottomColor: theme.profileImgBorder,
      flex: 1,
      alignItems: 'center',
      paddingBottom: 8,
    },
    followerTabText: {
      fontSize: 14,
      color: theme.userFollowerGrayText,
      fontFamily: fontFamily.regular,
    },
    userImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    userFollowerListContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    followerImageContainer: {flexDirection: 'row', alignItems: 'center'},
    followerUserNameText: {
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
      width: screenWidth / 3,
    },
    userProfileFollowText: {
      fontSize: 12,
      color: theme.text,
      fontFamily: fontFamily.semiBold,
    },
  });
  return styles;
};

export default FollowingStyle;
