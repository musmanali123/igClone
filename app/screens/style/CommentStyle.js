import {StyleSheet, Dimensions, Platform} from 'react-native';
import fontFamily from '../../styles/fontFamily';
import colors from '../../styles/colors';

const CommentStyle = theme => {
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: theme.paginationColor,
    },
    mainContainer: {
      width: '100%',
      height: screenHeight - 100,
      backgroundColor: theme.commentBg,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingVertical: 20,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 12,
      borderBottomWidth: 0.2,
      borderBottomColor: theme.lightText,
      paddingHorizontal: 16,
    },
    closeIcon: {
      width: 12,
      height: 12,
      resizeMode: 'contain',
      tintColor: theme.text,
    },
    commentHeading: {
      fontSize: 12,
      color: theme.text,
      fontFamily: fontFamily.semiBold,
      paddingHorizontal: 8,
      paddingVertical: 6,
    },
    closeIconContainer: {
      paddingHorizontal: 8,
      paddingVertical: 6,
    },
    addCommentContainer: {
      //   position: 'absolute',
      //   zIndex: 1,
      //   bottom: 8,
      height: 70,
      width: '100%',
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderTopWidth: 0.2,
      borderTopColor: theme.lightText,
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileImageStyle: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    addCommentIcon: {
      width: 12,
      height: 12,
      resizeMode: 'contain',
      tintColor: colors.white,
    },
    addCommentIconContainer: {
      width: 40,
      height: 30,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.blue,
    },
    input: {
      flex: 1,
      paddingVertical: Platform.OS === 'ios' ? 12 : 4,
      paddingHorizontal: 12,
      color: theme.text,
      fontSize: 14,
    },
    commentsContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    heartIcon: {
      width: 14,
      height: 14,
      resizeMode: 'contain',
      tintColor: theme.commentIconColor,
    },
    likeCounterText: {
      fontSize: 12,
      color: theme.commentGrayText,
      fontFamily: fontFamily.regular,
    },
    userNameStyle: {
      fontSize: 12,
      color: theme.text,
      fontFamily: fontFamily.regular,
    },
    commentTextStyle: {
      fontSize: 10,
      color: theme.text,
      fontFamily: fontFamily.regular,
    },
    replyContainer: {
      backgroundColor: theme.replyCommentBg,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
    },
    replyText: {
      color: theme.replyCommentText,
      paddingHorizontal: 8,
      paddingVertical: 8,
    },
    replyCloseIcon: {
      width: 10,
      height: 10,
      resizeMode: 'contain',
      tintColor: theme.replyCommentIconColor,
    },
  });
  return styles;
};

export default CommentStyle;
