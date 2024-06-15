import {
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import {useTheme} from '../../themes/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import Video from 'react-native-video';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const ProfileGridCompo = ({setUserPostsLength, userUid}) => {
  const {theme} = useTheme();
  const [laoding, setLoading] = useState(false);
  const [allUserPosts, setAllUserPosts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('time', 'desc')
      .onSnapshot(snap => {
        const allPostData = snap.docs
          .map(doc => ({...doc.data(), id: doc.id}))
          .filter(post => post.userUid === userUid);
        setUserPostsLength(allPostData.length);
        setAllUserPosts(allPostData);
        setLoading(false);
      });
    return () => unsubscribe();
  }, [userUid]);

  const renderItem = ({item}) => {
    return (
      <>
        {item.type == 'post' ? (
          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(navigationStrings.SHOW_ALL_USER_POSTS, {
                  clickedItem: item,
                  userUid: userUid,
                })
              }>
              <FastImage
                source={{uri: item.medialUrls[0]}}
                style={styles.reelAndImageStyle}
                resizeMode="cover"
              />
            </TouchableOpacity>
            {item.medialUrls.length > 1 && (
              <Image
                source={require('../../assets/multiple.png')}
                style={styles.multipleImageIcon}
              />
            )}
          </View>
        ) : (
          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(navigationStrings.SHOW_ALL_USER_POSTS, {
                  clickedItem: item,
                  userUid: userUid,
                })
              }>
              <Video
                style={styles.reelAndImageStyle}
                source={{uri: item.medialUrls[0]}}
                resizeMode="cover"
                poster="https://e1.pxfuel.com/desktop-wallpaper/802/816/desktop-wallpaper-black-iphone-7-posted-by-michelle-mercado-black-ios.jpg"
                posterResizeMode="cover"
                repeat
              />
              <Image
                source={require('../../assets/reel_fill.png')}
                style={styles.reelIcon}
              />
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  return (
    <>
      <View style={{paddingVertical: 12, flex: 1, marginBottom: 50}}>
        {!!laoding ? (
          <ActivityIndicator size={24} color={theme.gray} />
        ) : (
          <FlatList
            data={allUserPosts}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  reelIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    position: 'absolute',
    top: 10,
    right: 8,
    tintColor: 'snow',
  },
  reelAndImageStyle: {
    width: screenWidth / 3 - 4,
    height: screenHeight * 0.15,
    margin: 2,
    borderRadius: 2,
  },
  multipleImageIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: 'white',
    position: 'absolute',
    top: 10,
    right: 8,
  },
});

export default ProfileGridCompo;
