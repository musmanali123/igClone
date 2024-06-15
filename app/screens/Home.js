import {View, FlatList, StyleSheet, ScrollView, Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import {useTheme} from '../themes/ThemeContext';
import TopHomeCompo from './components/TopHomeCompo';
import StoryComponent from './components/StoryComponent';
import firestore from '@react-native-firebase/firestore';
import ShowPostsCompo from './components/ShowPostsCompo';
import {getLocation} from '../utils/getUserLocation';
import ShimmerEffectCompo from '../components/ShimmerEffectCompo';
import auth, {firebase} from '@react-native-firebase/auth';

export default function Home({switchToScreen}) {
  const {theme} = useTheme();
  const [postData, setPostData] = useState([]);
  const [laoding, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('time', 'desc')
      .onSnapshot(snap => {
        const allPostData = snap.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        const filteredPostData = allPostData.filter(ele => ele.type === 'post');
        setPostData(filteredPostData);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  // const handleGetLocation = async () => {
  //   try {
  //     const position = await getLocation();

  //     if (position !== undefined && position !== null) {
  //       // console.log('Location of user is: ', position);
  //     }
  //   } catch (error) {
  //     console.log('Error in handleGetLocation in Home screen: ', error);
  //   }
  // };

  const storeFcmTokenToFirestore = async fcmToken => {
    try {
      const userRef = firestore()
        .collection('users')
        .doc(auth().currentUser?.uid);
      const userData = await userRef.get();

      if (userData.exists) {
        const userDataObj = userData.data(); // Access user data using data() method

        if (userDataObj.hasOwnProperty('fcmToken')) {
          // If 'fcmToken' field already exists, update it
          await userRef.update({fcmToken: fcmToken});
        } else {
          // If 'fcmToken' field doesn't exist, set it
          await userRef.set({...userDataObj, fcmToken: fcmToken});
        }
      }
    } catch (error) {
      console.log('Error while storing fcm to user collection: ', error);
    }
  };

  const handleSetFcmToken = async () => {
    try {
      const token = await firebase.messaging().getToken();
      if (token) {
        await storeFcmTokenToFirestore(token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleSetFcmToken();
  }, []);

  return (
    <>
      <ScreenComponent
        style={{
          backgroundColor: theme.bottonTabBg,
          paddingTop: Platform.OS === 'android' ? 0 : 0,
          flex: 1,
        }}
        statusBarBg={theme.bottonTabBg}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <TopHomeCompo />
          <View style={{flex: 1, backgroundColor: theme.background}}>
            <StoryComponent />
            <View style={{flex: 1}}>
              {!laoding ? (
                <FlatList
                  data={postData}
                  renderItem={({item}) => (
                    <ShowPostsCompo
                      item={item}
                      allUrls={item.medialUrls}
                      switchToScreen={switchToScreen}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                />
              ) : (
                <ShimmerEffectCompo />
              )}
            </View>
          </View>
        </ScrollView>
      </ScreenComponent>
    </>
  );
}
