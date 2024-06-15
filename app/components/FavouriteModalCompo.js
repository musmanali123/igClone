import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import React from 'react';
import colors from '../styles/colors';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../navigation/navigationStrings';
import {useTheme} from '../themes/ThemeContext';
import fontFamily from '../styles/fontFamily';

const FavouriteModalCompo = ({showFavouriteModal, setShowFavouriteModal}) => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  return (
    <>
      <Modal visible={showFavouriteModal} style={{flex: 1}} transparent>
        <View style={styles.container}>
          <View style={[styles.modalContainer, {backgroundColor: theme.gray2}]}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../assets/animated-star.png')}
                style={styles.imageStyle}
              />
              <Text style={[styles.heading, {color: theme.text}]}>
                Favourites
              </Text>
              <Text style={[styles.subHeading, {color: theme.gray}]}>
                New post from your favourites will appear higher in feed.
              </Text>
            </View>
            <View style={styles.bottomBtnContainer}>
              <TouchableOpacity
                style={[styles.btn, {borderTopColor: theme.gray}]}
                onPress={() => {
                  navigation.navigate(navigationStrings.FAVOURITE_USERS_SCREEN);
                  setShowFavouriteModal(false);
                }}>
                <Text style={styles.heading2}>Manage Favourites</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, {borderTopColor: theme.gray}]}
                onPress={() => setShowFavouriteModal(false)}>
                <Text style={[styles.heading2, {color: theme.text}]}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(60, 60, 60,0.4)',
  },
  modalContainer: {
    backgroundColor: colors.white,
    width: '66%',
    height: '40%',
    borderRadius: 14,
  },
  imageStyle: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: '8%',
  },
  heading: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    marginVertical: '6%',
    color: colors.black,
  },
  subHeading: {
    width: '70%',
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.grey,
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 22,
  },
  bottomBtnContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heading2: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    color: colors.blue2,
  },
  btn: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 0.2,

    marginBottom: 2,
  },
});

export default FavouriteModalCompo;
