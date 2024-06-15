import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../styles/colors';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../themes/ThemeContext';

const screenWidth = Dimensions.get('screen').width;

const ShimmerEffectCompo = ({laoding}) => {
  const {theme, isDarkMode} = useTheme();
  const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
  let darkShimmer = ['#929292', '#797979', '#83878C'];
  let lightShimmer = ['#6D6D6D', '#565656', '#616161'];
  let shimmerColors = !isDarkMode ? darkShimmer : lightShimmer;

  const renderItem = () => {
    return (
      <View>
        <View style={styles.container}>
          <ShimmerPlaceHolder
            style={styles.image}
            shimmerColors={shimmerColors}
          />
          <View style={styles.textContainer}>
            <ShimmerPlaceHolder
              shimmerColors={shimmerColors}
              style={styles.text1}
            />
            <ShimmerPlaceHolder
              shimmerColors={shimmerColors}
              style={styles.text2}
            />
          </View>
        </View>
        <ShimmerPlaceHolder
          style={styles.mainImage}
          shimmerColors={shimmerColors}
        />
      </View>
    );
  };

  return (
    <>
      <ScrollView
        style={{flex: 1, marginTop: 12, paddingHorizontal: 4}}
        showsVerticalScrollIndicator={false}>
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={<View style={{marginVertical: 8}} />}
          scrollEnabled={false}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  text1: {
    height: 10,
    width: '45%',
    borderRadius: 2,
  },
  text2: {
    height: 10,
    borderRadius: 2,
    marginTop: 8,
    width: '80%',
  },
  textContainer: {
    marginLeft: 12,
  },
  mainImage: {
    width: screenWidth,
    height: 190,
    borderRadius: 2,
    marginVertical: 12,
  },
});

export default ShimmerEffectCompo;
