import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Modal,
  Button,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import MyIndicator from './MyIndicator';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {useTheme} from '../themes/ThemeContext';
import FastImage from 'react-native-fast-image';
import navigationStrings from '../navigation/navigationStrings';

const {height, width} = Dimensions.get('screen');

const ShowFavouriteUsersCompo = ({data, handleAddToFavorite}) => {
  const {theme} = useTheme();
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const [favUserAllData, setFavUserAllData] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('users')
      .doc(data)
      .onSnapshot(snap => {
        if (snap.exists) {
          var data = snap.data();
          setFavUserAllData(data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, [data]);

  const profileNavigationHandler = data => {
    if (data == auth().currentUser?.uid) {
      return null;
    } else {
      navigation.navigate(navigationStrings.USER_PROFILE, {
        userUid: data,
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.userDataContainer}
      activeOpacity={0.6}
      onPress={() => profileNavigationHandler(data)}>
      <FastImage
        style={styles.profileImage}
        source={{
          uri:
            // favUserAllData?.imageUrl !== null && favUserAllData?.imageUrl !== ''
            !!favUserAllData && favUserAllData?.imageUrl
              ? favUserAllData?.imageUrl
              : 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png',
        }}
      />
      <View
        style={{
          marginLeft: 20,
          //   backgroundColor: 'red',
          justifyContent: 'center',
        }}>
        <Text style={[styles.userNameStyle, {color: theme.text}]}>
          {favUserAllData?.fullName}
        </Text>
        {favUserAllData?.bio !== null && favUserAllData?.bio !== '' && (
          <Text style={[styles.bioText, {color: theme.userFollowerGrayText}]}>
            {favUserAllData?.bio.length > 20
              ? favUserAllData?.bio.slice(0, 20) + ' ...'
              : favUserAllData?.bio}
          </Text>
        )}
        <Text style={[styles.bioText, {color: theme.userFollowerGrayText}]}>
          {favUserAllData?.followers.length} Followers
        </Text>
      </View>
      <View style={styles.addRemoveContainer}>
        <TouchableOpacity
          onPress={() => handleAddToFavorite(data)}
          style={[styles.addRemoveBtn, {backgroundColor: theme.gray2}]}>
          <Text style={{color: theme.text}}>Remove</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
  userDataContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    aligndatas: 'center',
    marginBottom: 16,
    // justifyContent: 'space-between',
  },
  userNameStyle: {
    fontSize: 12,
  },
  bioText: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
  profileImage: {width: 60, height: 60, borderRadius: 30},
  addRemoveContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  addRemoveBtn: {
    // paddingHorizontal: 12,
    // paddingVertical: 8,
    borderRadius: 6,
    width: width / 4.5,
    height: height * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ShowFavouriteUsersCompo;
