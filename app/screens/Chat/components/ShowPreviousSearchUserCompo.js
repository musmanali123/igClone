import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MyIndicator from '../../../components/MyIndicator';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../../navigation/navigationStrings';
import fontFamily from '../../../styles/fontFamily';
import generateChatId from '../../../components/GenerateChatId';
import {useTheme} from '../../../themes/ThemeContext';

const ShowPreviousSearchUserCompo = ({item, getPreviousSearchUserList}) => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const currentUserId = auth().currentUser.uid;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(item)
      .onSnapshot(snap => {
        if (snap.exists) {
          var data = snap.data();
          setUserData({...data, id: snap.id});
        }
      });
    return () => unsubscribe();
  }, []);

  const removeSearchInUserCollection = async searchUserId => {
    const userRef = firestore().collection('users').doc(currentUserId);
    try {
      if (searchUserId !== currentUserId) {
        const fuserRef = await userRef.get();
        if (fuserRef.exists) {
          const fuserData = fuserRef.data();

          if (fuserData.hasOwnProperty('searchPeople')) {
            let updatedsearchPeople = [...fuserData.searchPeople];
            if (fuserData.searchPeople.includes(searchUserId)) {
              updatedsearchPeople = updatedsearchPeople.filter(
                id => id !== searchUserId,
              );
            }
            await userRef.update({searchPeople: updatedsearchPeople}); // Update search people array
            getPreviousSearchUserList();
          }
        }
      }
    } catch (error) {
      console.log('Error in follower function: ', error);
    }
  };

  const profileNavigationHandler = async userId => {
    if (userId == auth().currentUser.uid) {
      return null;
    } else {
      const routeData = generateChatId(currentUserId, userId);
      navigation.navigate(navigationStrings.CHAT_SCREEN, routeData);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.userDataContainer}
          activeOpacity={0.6}
          onPress={() => profileNavigationHandler(item)}>
          <FastImage
            style={styles.profileImage}
            source={{
              uri:
                userData?.imageUrl !== ''
                  ? userData?.imageUrl
                  : 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png',
            }}
          />
          <View style={{marginLeft: 20}}>
            <Text style={[styles.userNameStyle, {color: theme.text}]}>
              {userData?.fullName}
            </Text>
            {userData?.bio !== '' && (
              <Text
                style={[styles.bioText, {color: theme.userFollowerGrayText}]}>
                {userData?.bio.length > 20
                  ? userData?.bio.slice(0, 20) + ' ...'
                  : userData?.bio}
              </Text>
            )}
            <Text style={[styles.bioText, {color: theme.userFollowerGrayText}]}>
              {userData?.followers.length} Followers
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingHorizontal: 4,
            paddingVertical: 12,
          }}
          onPress={() => removeSearchInUserCollection(item)}>
          <Image
            source={require('../../../assets/close.png')}
            style={[styles.crossIcon, {tintColor: theme.gray}]}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImage: {width: 50, height: 50, borderRadius: 25},
  userDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userNameStyle: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
  },
  bioText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  crossIcon: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },
});

export default ShowPreviousSearchUserCompo;
