import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../themes/ThemeContext';
import firestore from '@react-native-firebase/firestore';
import MyIndicator from '../../components/MyIndicator';
import navigationStrings from '../../navigation/navigationStrings';
import ReelStyle from '../style/ReelStyle';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import ShowReelVideoCompo from '../components/ShowReelVideoCompo';

export default function ReelsScreen({switchToScreen}) {
  const {theme} = useTheme();
  const styles = ReelStyle(theme);
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const [reelData, setReelData] = useState([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  var isMounted = false;

  useEffect(() => {
    isMounted = true;
    getPostData();
    return () => {
      isMounted = false;
    };
  }, []);

  const getPostData = () => {
    try {
      setLoading(true);
      firestore()
        .collection('posts')
        .orderBy('time', 'desc')
        .onSnapshot(snap => {
          var temp = [];
          if (snap.docs.length > 0) {
            var doc = snap.docs;
            doc.forEach(each => {
              temp.push({...each.data(), id: each.id});
            });
            const filteredReelData = temp.filter(ele => ele.type === 'reel');
            setReelData(filteredReelData);
            setLoading(false);
            // console.log('reel length: ', temp.length);
          } else {
            setLoading(false);
          }
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const onChangeIndex = ({index}) => {
    setCurrentReelIndex(index);
  };

  return (
    <>
      <View style={styles.container}>
        <SwiperFlatList
          contentContainerStyle={{paddingBottom: 70}}
          pagingEnabled
          vertical
          data={reelData}
          renderItem={({item, index}) => (
            <ShowReelVideoCompo
              item={item}
              index={index}
              currentReelIndex={currentReelIndex}
              switchToScreen={switchToScreen}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          onChangeIndex={onChangeIndex}
        />
        <Text style={styles.reelTextStyle}>Reels</Text>
        <TouchableOpacity
          style={styles.reelCameraIconContainer}
          onPress={() =>
            navigation.navigate(navigationStrings.SHOW_GALLERY_REEL)
          }>
          <Image
            source={require('../../assets/camera.png')}
            style={styles.reelCameraIcon}
          />
        </TouchableOpacity>
      </View>
      <MyIndicator
        visible={laoding}
        backgroundColor={theme.loginBackground}
        size={'large'}
      />
    </>
  );
}

const myStyles = StyleSheet.create({});
