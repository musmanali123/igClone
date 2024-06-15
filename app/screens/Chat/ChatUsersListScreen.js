import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import TopCompoWithHeading from '../../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import {useTheme} from '../../themes/ThemeContext';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MyIndicator from '../../components/MyIndicator';
import ShowAlreadyChatCompo from './components/ShowAlreadyChatCompo';
import ButtonComponent from '../CreateAccount/components/ButtonComponent';

export default function ChatUsersListScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [laoding, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [filteredChatsArray, setFilteredChatsArray] = useState([]);
  const [allChatsData, setAllChatsData] = useState([]);
  var isMounted = false;

  const getUsersList = async () => {
    try {
      setLoading(true);
      const tempArray = [];
      const fdata = await firestore().collection('users').get();
      fdata.forEach(doc => {
        tempArray.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      if (tempArray.length) {
        setUsersList(tempArray);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getGroupData = chatData => {
    try {
      firestore()
        .collection('chats')
        .where('members', 'array-contains', auth().currentUser?.uid)
        .get()
        .then(res => {
          let tem = [];
          res.docs.map(ele => {
            let finalGroupData = {...ele.data(), groupId: ele.id};
            tem.push(finalGroupData);
          });
          let mergeArr = chatData.concat(tem);
          // const timeBasedMes = mergeArr.filter(e => console.log(e.type));
          const sortedChatData = mergeArr.sort(
            (a, b) => b.messageTime - a.messageTime,
          );
          // console.log('sorted chat data is: ', sortedChatData);
          setAllChatsData(mergeArr);
        })
        .catch(err => console.log(err));
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const getChatsData = () => {
    try {
      firestore()
        .collection('chats')
        .orderBy('messageTime', 'desc')
        .onSnapshot(documentSnapshot => {
          var chattingArray = [];
          var doc = documentSnapshot.docs;
          doc.forEach(each => {
            if (each.id.includes(auth().currentUser.uid)) {
              chattingArray.push({
                chatID: each.id,
                ...each.data(),
              });
            }
          });
          isMounted = true;
          if (isMounted) {
            setFilteredChatsArray(chattingArray);
            getGroupData(chattingArray);
            setLoading(false);
          }
        });
    } catch (error) {
      console.log('error in getting user chat list screen: ', error);
    }
  };

  useEffect(() => {
    isMounted = true;
    getUsersList();
    getChatsData();
    // getGroupData();
    return () => (isMounted = false);
  }, []);

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title={auth().currentUser?.displayName}
          onPress={() => navigation.goBack()}
          rightIcon={require('../../assets/create-group-icon.png')}
          rightIconStyle={{width: 28, height: 28, tintColor: theme.text}}
          onPressRight={() =>
            navigation.navigate(navigationStrings.CREATE_GROUP_SCREEN)
          }
        />
        <View style={styles.searchBarContainer}>
          <TouchableOpacity
            style={[
              styles.searchIconsContainer,
              {backgroundColor: theme.userProfileGray},
            ]}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(navigationStrings.CHAT_SEARCH_SCREEN)
            }>
            <Image
              source={require('../../assets/tab_search.png')}
              style={[styles.searchIcon, {tintColor: theme.light}]}
            />
            <Text style={[styles.text, {color: theme.commentGrayText}]}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          <FlatList
            data={allChatsData}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{width: '100%', paddingBottom: 50}}
            renderItem={({item}) => {
              // console.log('data is: ', item);
              return (
                <ShowAlreadyChatCompo
                  data={item}
                  onPress={() => {
                    item.chatID !== undefined
                      ? navigation.navigate(navigationStrings.CHAT_SCREEN, item)
                      : navigation.navigate(
                          navigationStrings.GROUP_CHAT_SCREEN,
                          {
                            groupId: item.groupId,
                          },
                        );
                  }}
                />
                // <Text style={{color: 'white'}}>
                //   {item.messageTime.toDate().toDateString()}
                // </Text>
              );
            }}
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
  searchIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 12,
  },
  searchIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    paddingHorizontal: 14,
  },
});
