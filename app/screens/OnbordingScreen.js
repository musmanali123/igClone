import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import React, {useState, useRef} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import {useTheme} from '../themes/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import colors from '../styles/colors';

const {width, height} = Dimensions.get('screen');

export default function OnbordingScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [currentIndex, setcurrentIndex] = useState(0);
  const scrollx = useRef(new Animated.Value(0)).current;
  const ref = useRef();

  const data = [
    {
      img: require('../assets/loevelOfLocation.png'),
      title: 'Level of locations',
      subtitle: [
        'No border and no crown completely free to view!',
        'No border with gold crown only address and name hidden from non-premium members',
        'Gold border with black crown premium member exclusive - all information hidden from non premium members',
      ],
    },
    {
      img: require('../assets/homePage.png'),
      title: 'Home page',
      subtitle: [
        'Top tab is a selection of random featured locations.',
        '“Near me” are the locations closest to you, ordered by their distance from your current location!',
        '“ As seen on social media” are the locations we have recently posted on any of our social medias so they are easy to find!',
        '“Featured: Category” is the featured category for that month and is selected based on the season or what has gained popularity on our app in recent times.',
        '“Recently Added” are locations that we have recently added to the app.',
        '“Visited Places” is a collection of all the locations that you have identified that you have visited already!',
      ],
    },
    {
      img: require('../assets/categoriesOnboarding.png'),
      title: 'Categories',
      subtitle: [
        'Search for location titles using the search bar',
        'View all locations or select one you would like to browse!',
        'Use the “Sort By” filter to order it alphabetically, newest to oldest, oldest to newest, or filter it by state!',
      ],
    },
    {
      img: require('../assets/map.png'),
      title: 'Map',
      subtitle: [
        'This is where you can view all the locations on our app, spread across the entire country!',
        'Filter locations by selecting any specific category',
        'Click on any location marker to see a preview of the location before clicking it to read more about it.',
      ],
    },
    {
      img: require('../assets/profile.png'),
      title: 'Profile',
      subtitle: [
        'View and edit your profile username, photo and bio',
        'View your favourited, visited, planned to visit and uploaded locations linked to your profile',
      ],
    },
    {
      img: require('../assets/sideMenu.png'),
      title: 'When viewing a location',
      subtitle: [
        'Favourite the location,',
        'Read reviews and comments/leave your own',
        'Identify whether you “want to go” or you have “been there” before.',
        'Get directions from your current location',
        'View all details about the location, including its current distance from you in driving kilometers',
        'View the nearest locations to this location so you can plan to visit multiple places in one trip!',
        'Submit your own photos for approval, or report an issue with the location.',
      ],
    },
    {
      img: require('../assets/sideMenuLast.png'),
      title: 'Side menu',
      subtitle: [
        'The profile you are signed into',
        '“Add a location” of your own!  Come up with a name, title and description, pick the categories it is relevant to and identify its location on the map!  Include some of your own photos of that location and await approval.',
        'Request a specific location you would like to see featured on our app, or a general area you would like for us to cover.',
      ],
    },
  ];
  const handleSwipe = index => {
    ref?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
  };

  const Indicators = ({data, scrollx}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 30,
          alignSelf: 'center',
        }}>
        {data.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollx.interpolate({
            inputRange,
            outputRange: [10, 30, 10],
            extrapolate: 'clamp',
          });
          const opacity = scrollx.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
          });
          const scalex = scrollx.interpolate({
            inputRange,
            outputRange: [0.2, 1.4, 0.2],
            extrapolate: 'clamp',
          });
          colorInterpolate = scalex.interpolate({
            inputRange: [0, 1],
            outputRange: [colors.btnColor, colors.primaryGreen],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              style={{
                width: dotWidth,
                height: 10,
                borderRadius: 5,
                backgroundColor: colorInterpolate,
                marginHorizontal: 3,
                opacity: opacity,
              }}
              key={i.toString()}
            />
          );
        })}
      </View>
    );
  };

  return (
    <ScreenComponent style={{backgroundColor: theme.background}}>
      <View
        style={{
          flex: 1,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.exitBtn]}>
          <Text style={styles.btnText}>Exit</Text>
        </TouchableOpacity>

        <FlatList
          ref={ref}
          data={data}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          scrollEventThrottle={32}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollx}}}],
            {useNativeDriver: false},
          )}
          onMomentumScrollEnd={ev => {
            const currentIndex = Math.floor(
              ev.nativeEvent.contentOffset.x / width,
            );
            setcurrentIndex(currentIndex);
          }}
          // onScroll={(e) => {
          //   const x = e.nativeEvent.contentOffset.x;
          //   setcurrentIndex((x / Dimensions.get("screen").width).toFixed(0));
          // }}
          renderItem={({item}) => {
            return (
              <Animated.View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  width: Dimensions.get('screen').width,
                }}>
                <Image
                  resizeMode="contain"
                  style={styles.img}
                  source={item.img}
                />
                <Text style={styles.title}>{item.title}</Text>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={item.subtitle}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => {
                    return (
                      <View
                        style={[
                          styles.txtDotView,
                          {width: Dimensions.get('screen').width},
                        ]}>
                        <View style={styles.txtDot} />
                        <Text style={styles.subtitle}>{item}</Text>
                      </View>
                    );
                  }}
                />
              </Animated.View>
            );
          }}
        />
        <View style={styles.dotContainer}>
          <Indicators scrollx={scrollx} data={data} />
        </View>
        <View style={{}}>
          <View style={styles.bottomView}>
            {currentIndex > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  if (currentIndex !== 0) handleSwipe(currentIndex - 1);
                }}
                style={styles.bottomButton}>
                <Text style={[styles.btnText, {color: colors.black}]}>
                  Prevoius
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.emptyBottomButton} />
            )}

            <TouchableOpacity
              style={[
                styles.bottomButton,
                {backgroundColor: colors.primaryGreen},
              ]}
              onPress={() => {
                if (currentIndex < data.length - 1) {
                  // next
                  handleSwipe(currentIndex + 1);
                } else {
                  navigation.goBack();
                }
              }}>
              <Text style={[styles.btnText, {color: colors.lavender}]}>
                {currentIndex < data.length - 1 ? 'Next' : 'Finish'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenComponent>
  );
}

const styles = StyleSheet.create({
  exitBtn: {
    height: 40,
    width: '15%',
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.btnColor,
    borderRadius: 5,
  },
  btnText: {
    fontSize: 16,
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  bottomButton: {
    height: 40,
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.btnColor,
    borderRadius: 5,
  },
  img: {
    maxHeight: '80%',
    maxWidth: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    marginLeft: 10,
    color: colors.onbordingTextColor,
  },
  dotContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  dots: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  txtDotView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 7,
    marginBottom: 7,
  },
  txtDot: {
    height: 10,
    width: 10,
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: colors.primaryGreen,
  },
  emptyBottomButton: {
    height: 40,
    width: '30%',
    borderRadius: 5,
  },
});
