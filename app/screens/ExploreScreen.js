import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../navigation/navigationStrings';
import {useTheme} from '../themes/ThemeContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MyIndicator from '../components/MyIndicator';
import ShowPostsCompo from './components/ShowPostsCompo';

export default function ExploreScreen({route}) {
  const {type, postId} = route?.params;
  const {theme} = useTheme();
  const [laoding, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const navigation = useNavigation();
  const userUid = auth().currentUser?.uid;
  const [allUserPosts, setAllUserPosts] = useState([]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('time', 'desc')
      .onSnapshot(snap => {
        const allPostData = snap.docs
          .map(doc => ({...doc.data(), id: doc.id}))
          .filter(post => post.id !== postId && post.type == type);

        const selectPost = snap.docs
          .map(doc => ({...doc.data(), id: doc.id}))
          .filter(post => post.id === postId && post.type == type);
        const farr = selectPost.concat(allPostData);
        setAllUserPosts(farr);
        setLoading(false);
      });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title="Explore"
          onPress={() => navigation.goBack()}
        />
        <View style={{flex: 1, marginBottom: 50}}>
          <FlatList
            data={allUserPosts}
            renderItem={({item}) => (
              <ShowPostsCompo item={item} allUrls={item.medialUrls} />
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
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
