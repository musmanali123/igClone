import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MyIndicator from '../components/MyIndicator';
import {useNavigation} from '@react-navigation/native';
import SearchStyle from './style/SearchStyle';
import fontFamily from '../styles/fontFamily';
import navigationStrings from '../navigation/navigationStrings';
import {useTheme} from '../themes/ThemeContext';
const {height, width} = Dimensions.get('screen');

export default function SearchPeopleScreen({route}) {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const [searchText, setSearchText] = useState('');
  const [userData, setUserData] = useState([]);
  const currentUserId = auth().currentUser?.uid;
  const [allUsers, setAllUsers] = useState([]);
  const [showCrossIcon, setShowCrossIcon] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);
  const screenName = route?.params?.screenName;

  const searchPeople = async () => {
    try {
      const filtered = allUsers.filter(user => {
        return user.fullName.toLowerCase().includes(searchText.toLowerCase());
      });
      setUserData(filtered);
    } catch (error) {
      console.log(
        'Error in while Searching users in Search People Screen: ',
        error,
      );
    }
  };
  useEffect(() => {
    if (searchText !== '') {
      searchPeople();
    } else {
      setUserData([]);
    }
  }, [searchText]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .onSnapshot(snapshot => {
        const users = [];
        snapshot.forEach(doc => {
          const userData = doc.data();
          const userId = doc.id;
          if (userId !== currentUserId) {
            users.push({...userData, id: userId});
          }
          if (userId == currentUserId) {
            setCurrentUserData({...userData, id: userId});
          }
        });

        setAllUsers(users);
      });

    return () => unsubscribe();
  }, []);

  const profileNavigationHandler = item => {
    if (item.id == auth().currentUser.uid) {
      return null;
    } else {
      navigation.navigate(navigationStrings.USER_PROFILE, {
        userUid: item.id,
      });
    }
  };

  const handleAddToFavorite = async otherUserUid => {
    try {
      const loggedUserId = auth().currentUser?.uid;
      const userRef = firestore().collection('users').doc(loggedUserId);
      const fuserRef = await userRef.get();
      if (fuserRef.exists) {
        const fuserData = fuserRef.data();

        if (fuserData.hasOwnProperty('favourites')) {
          let updatedFavouriteUsers = [...fuserData.favourites]; // Create a new array
          if (fuserData.favourites.includes(otherUserUid)) {
            updatedFavouriteUsers = updatedFavouriteUsers.filter(
              id => id !== otherUserUid,
            ); // Remove User id
          } else {
            updatedFavouriteUsers.push(otherUserUid); // Add User id
          }
          await userRef.update({favourites: updatedFavouriteUsers}); // Update the User id
        } else {
          // If 'fcmToken' field doesn't exist, set it
          await userRef.set({...fuserData, favourites: [otherUserUid]});
        }
      }
    } catch (error) {
      console.log(
        'Error in handleAddToFavorite function in ShowPostOption Modal compo: ',
        error,
      );
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.userDataContainer}
        activeOpacity={0.6}
        onPress={() => profileNavigationHandler(item)}>
        <FastImage
          style={styles.profileImage}
          source={{
            uri:
              item.imageUrl !== ''
                ? item.imageUrl
                : 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png',
          }}
        />
        <View style={{marginLeft: 20}}>
          <Text style={[styles.userNameStyle, {color: theme.text}]}>
            {item?.fullName}
          </Text>
          {item.bio !== '' && (
            <Text style={[styles.bioText, {color: theme.userFollowerGrayText}]}>
              {item?.bio.length > 20
                ? item?.bio.slice(0, 20) + ' ...'
                : item?.bio}
            </Text>
          )}
          <Text style={[styles.bioText, {color: theme.userFollowerGrayText}]}>
            {item?.followers.length} Followers
          </Text>
        </View>
        {screenName !== undefined && screenName == 'FavouriteUsersScreen' && (
          <View style={styles.addRemoveIconContainer}>
            <TouchableOpacity
              onPress={() => handleAddToFavorite(item.id)}
              style={[styles.addRemoveBtn, {backgroundColor: theme.gray2}]}>
              <Text style={{color: theme.text}}>
                {!!currentUserData &&
                currentUserData?.favourites?.includes(item.id)
                  ? 'Remove'
                  : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <View style={styles.topHeaderContainer}>
          <TouchableOpacity
            style={styles.backIconContainer}
            onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/back.png')}
              style={[styles.backIcon, {tintColor: theme.text}]}
            />
          </TouchableOpacity>
          <View
            style={[
              styles.searchBarContainer,
              {backgroundColor: theme.userProfileGray},
            ]}>
            <Image
              source={require('../assets/tab_search_fill.png')}
              style={{
                width: 14,
                height: 14,
                resizeMode: 'contain',
                tintColor: theme.commentGrayText,
              }}
            />
            <TextInput
              placeholder="Search"
              style={[styles.input, {color: theme.text}]}
              placeholderTextColor={theme.commentGrayText}
              value={searchText}
              onChangeText={text => {
                if (text.trim().length) {
                  setSearchText(text);
                  setShowCrossIcon(true);
                } else {
                  setSearchText('');
                  setShowCrossIcon(false);
                }
              }}
              autoCapitalize="none"
            />
            {showCrossIcon && (
              <TouchableOpacity
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                  alignItems: 'center',
                }}
                onPress={() => {
                  setSearchText('');
                  setShowCrossIcon(false);
                }}>
                <Image
                  source={require('../assets/close.png')}
                  style={[
                    styles.closeIconStyle,
                    {tintColor: theme.commentGrayText},
                  ]}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {userData.length > 0 && (
          <View
            style={{
              marginTop: 12,
              height: 0.2,
              backgroundColor: theme.placeholderColor,
            }}
          />
        )}
        <View style={{flex: 1, marginTop: 12}}>
          <FlatList
            data={userData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={<View style={{marginVertical: 10}} />}
          />
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  topHeaderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 8,
    paddingRight: 20,
    marginTop: 6,
  },
  backIconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  searchBarContainer: {
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
    paddingLeft: 12,
  },
  closeIconStyle: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },
  profileImage: {width: 70, height: 70, borderRadius: 35},
  userDataContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
  addRemoveIconContainer: {
    flex: 1,
    alignItems: 'flex-end',
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
