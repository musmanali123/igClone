import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const getFirstElementIndex = lineNumber => {
  const itemsPerLine = 3; // 3 items per line
  const firstElementIndex = lineNumber * itemsPerLine;
  return firstElementIndex;
};

const getLineNumber = index => {
  const lineNumber = Math.floor(index / 3);
  return lineNumber;
};

const ShowSearchPostCompo = ({item, index}) => {
  const lineNumber = getLineNumber(index);
  const firstIndexOFEverLine = getFirstElementIndex(lineNumber);
  const navigation = useNavigation();
  return (
    <View
      style={[
        styles.imagesContainer,
        {
          paddingLeft: firstIndexOFEverLine == index ? 0 : 1,
        },
      ]}>
      {item.type == 'post' ? (
        <TouchableOpacity
          style={styles.imageReelContainer}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate(navigationStrings.EXPLORE_SCREEN, {
              type: 'post',
              postId: item.id,
            })
          }>
          <FastImage
            source={{uri: item.medialUrls[0]}}
            style={styles.imageStyle}
          />
          {item.medialUrls.length > 1 && (
            <Image
              source={require('../../assets/multiple.png')}
              style={styles.reelIcon}
            />
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.imageReelContainer]}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate(navigationStrings.EXPLORE_SCREEN, {
              type: 'reel',
              postId: item.id,
            })
          }>
          <Video
            style={styles.imageStyle}
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  imagesContainer: {
    width: screenWidth / 3,
    alignItems: 'center',
    paddingVertical: 1,
    paddingLeft: 1,
    height: screenHeight * 0.15,
  },
  imageReelContainer: {
    width: '100%',
    height: '100%',
  },
  reelIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: 'snow',
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default ShowSearchPostCompo;
