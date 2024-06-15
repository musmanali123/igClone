import {View, Text, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import MyIndicator from '../components/MyIndicator';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import ShowPostsCompo from './components/ShowPostsCompo';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../themes/ThemeContext';
import ShimmerEffectCompo from '../components/ShimmerEffectCompo';

export default function SavedPostsScreen() {
  const {theme} = useTheme();
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const [allSavedPosts, setAllSavedPosts] = useState([]);
  const [postsData, setPostsData] = useState([]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .onSnapshot(snap => {
        if (snap.exists) {
          var data = snap.data();
          setAllSavedPosts(data.savedPosts);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const posts = [];
      for (const postId of allSavedPosts) {
        const postSnapshot = await firestore()
          .collection('posts')
          .doc(postId)
          .get();
        if (postSnapshot.exists) {
          const postData = postSnapshot.data();
          //   posts.push(postData);

          posts.push({...postData, id: postSnapshot.id});
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
      setPostsData(posts);
    };

    if (allSavedPosts.length > 0) {
      fetchPosts();
    }
  }, [allSavedPosts]);

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title="Saved Posts"
          onPress={() => navigation.goBack()}
        />
        <View style={{flex: 1, marginBottom: 50}}>
          {!laoding ? (
            postsData.length > 0 && (
              <FlatList
                data={postsData.reverse()}
                renderItem={({item}) => (
                  <ShowPostsCompo item={item} allUrls={item.medialUrls} />
                )}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
              />
            )
          ) : (
            <ShimmerEffectCompo />
          )}
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
