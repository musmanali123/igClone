import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../themes/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import navigationStrings from '../../navigation/navigationStrings';
import Video from 'react-native-video';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const ProfileReelCompo = ({userID}) => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [laoding, setLoading] = useState(false);
  const [allReel, setAllReel] = useState([]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('time', 'desc')
      .onSnapshot(snap => {
        const allPostData = snap.docs
          .map(doc => ({...doc.data(), id: doc.id}))
          .filter(post => post.userUid === userID && post.type === 'reel');
        setAllReel(allPostData);
        setLoading(false);
      });
    return () => unsubscribe();
  }, []);

  const renderItem = ({item}) => {
    return (
      <>
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(navigationStrings.SHOW_ALL_USER_POSTS, {
                clickedItem: item,
                userUid: userID,
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
            data={allReel}
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

export default ProfileReelCompo;
