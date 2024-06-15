import {View, Text, FlatList} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import MyIndicator from '../../components/MyIndicator';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import TopCompoWithHeading from '../../components/TopCompoWithHeading';
import ShowPostsCompo from '../components/ShowPostsCompo';
import {useTheme} from '../../themes/ThemeContext';
import {useNavigation} from '@react-navigation/native';

export default function ShowAllUserPostsScreen({route}) {
  const {theme} = useTheme();
  const [allUserPosts, setAllUserPosts] = useState([]);
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const clickedItem = route.params?.clickedItem;
  const userUid = route.params?.userUid;

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('time', 'desc')
      .onSnapshot(snap => {
        // const allPostData = snap.docs
        //   .map(doc => ({...doc.data(), id: doc.id}))
        //   .filter(post => post.userUid === userUid && post.type === 'post');
        if (clickedItem !== undefined) {
          const allUserPostData = snap.docs
            .map(doc => ({...doc.data(), id: doc.id}))
            .filter(
              post => post.userUid === userUid && post.id !== clickedItem.id,
            );

          const selectPost = snap.docs
            .map(doc => ({...doc.data(), id: doc.id}))
            .filter(post => post.id === clickedItem.id);
          const finalAllData = selectPost.concat(allUserPostData);

          setAllUserPosts(finalAllData);
        } else {
          const allPostData = snap.docs
            .map(doc => ({...doc.data(), id: doc.id}))
            .filter(post => post.userUid === userUid);
          setAllUserPosts(allPostData);
        }
        setLoading(false);
      });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title="Posts"
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
      <MyIndicator visible={laoding} />
    </>
  );
}
