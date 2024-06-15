import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MyIndicator from '../../components/MyIndicator';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../themes/ThemeContext';
import ChatSearchTopCompo from './components/ChatSearchTopCompo';
import navigationStrings from '../../navigation/navigationStrings';
import fontFamily from '../../styles/fontFamily';
import generateChatId from '../../components/GenerateChatId';
import ShowPreviousSearchUserCompo from './components/ShowPreviousSearchUserCompo';

export default function ChatSearchScreen() {
  const {theme} = useTheme();
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [userData, setUserData] = useState([]);
  const currentUserId = auth().currentUser?.uid;
  const [allUsers, setAllUsers] = useState([]);
  const [showCrossIcon, setShowCrossIcon] = useState(false);
  const [previousSearched, setPreviousSearched] = useState([]);
  var isMoundted = false;

  useEffect(() => {
    isMoundted = true;
    getPreviousSearchUserList();
    return () => (isMoundted = false);
  }, []);

  const getPreviousSearchUserList = () => {
    try {
      setLoading(true);
      setPreviousSearched([]);
      firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .onSnapshot(snap => {
          if (snap.exists) {
            var data = snap.data();
            setPreviousSearched(data.searchPeople);
            setLoading(false);
            // console.log('get user data funtion is called');
          } else {
            setLoading(false);
            // console.log('get user data funtion is not called');
          }
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

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
        });

        setAllUsers(users);
      });

    return () => unsubscribe();
  }, []);

  const addSearchInUserCollection = async searchUserId => {
    const userRef = firestore().collection('users').doc(currentUserId);
    try {
      if (searchUserId !== currentUserId) {
        const fuserRef = await userRef.get();
        if (fuserRef.exists) {
          const fuserData = fuserRef.data();

          if (fuserData.hasOwnProperty('searchPeople')) {
            let updatedsearchPeople = [...fuserData.searchPeople];
            if (fuserData.searchPeople.includes(searchUserId)) {
            } else {
              updatedsearchPeople.push(searchUserId); // Add search user id
            }
            await userRef.update({searchPeople: updatedsearchPeople}); // Update search people array
          }
        }
      }
    } catch (error) {
      console.log('Error in follower function: ', error);
    }
  };

  const profileNavigationHandler = async item => {
    await addSearchInUserCollection(item.id);
    if (item.id == auth().currentUser.uid) {
      return null;
    } else {
      const routeData = generateChatId(currentUserId, item.id);
      navigation.navigate(navigationStrings.CHAT_SCREEN, routeData);
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
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <ChatSearchTopCompo
          onPress={() => navigation.goBack()}
          searchText={searchText}
          setSearchText={setSearchText}
          showCrossIcon={showCrossIcon}
          setShowCrossIcon={setShowCrossIcon}
        />
        <View style={{flex: 1, marginTop: 12}}>
          {searchText === '' && previousSearched.length > 0 && (
            <>
              <View style={{paddingHorizontal: 20}}>
                <Text style={[styles.text, {color: theme.text}]}>Recent</Text>
                <FlatList
                  data={previousSearched}
                  renderItem={({item}) => (
                    <ShowPreviousSearchUserCompo
                      item={item}
                      getPreviousSearchUserList={getPreviousSearchUserList}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={<View style={{marginVertical: 10}} />}
                />
              </View>
            </>
          )}
          <FlatList
            data={userData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={<View style={{marginVertical: 10}} />}
          />
        </View>
      </ScreenComponent>
      <MyIndicator
        visible={laoding}
        backgroundColor={theme.loginBackground}
        size={'large'}
      />
    </>
  );
}

const styles = StyleSheet.create({
  profileImage: {width: 50, height: 50, borderRadius: 25},
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
  text: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    marginBottom: 20,
  },
});
