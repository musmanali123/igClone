import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import firestore from '@react-native-firebase/firestore';
import MyIndicator from '../components/MyIndicator';
import {useTheme} from '../themes/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import ShowSearchPostCompo from './components/ShowSearchPostCompo';
import navigationStrings from '../navigation/navigationStrings';

export default function SearchScreen() {
  const {theme} = useTheme();
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const [allPostsData, setAllPostsData] = useState();

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
        setAllPostsData(allPostData);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          <View style={styles.searchBarContainer}>
            <TouchableOpacity
              style={[
                styles.searchIconsContainer,
                {backgroundColor: theme.userProfileGray},
              ]}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate(navigationStrings.SEARCH_PEOPLE_SCREEN)
              }>
              <Image
                source={require('../assets/tab_search.png')}
                style={[styles.searchIcon, {tintColor: theme.light}]}
              />
              <Text style={[styles.text, {color: theme.commentGrayText}]}>
                Search
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.findPoepleIconContainer}
              onPress={() =>
                navigation.navigate(navigationStrings.DISCOVER_PEOPLE_SCREEN)
              }>
              <Image
                source={require('../assets/find_people.png')}
                style={[styles.findPoepleIcon, {tintColor: theme.text}]}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={allPostsData}
            renderItem={({item, index}) => (
              <ShowSearchPostCompo item={item} index={index} />
            )}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </ScrollView>
      </ScreenComponent>
      <MyIndicator
        visible={laoding}
        backgroundColor={theme.loginBackground}
        size={'large'}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 12,
  },
  searchIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  findPoepleIconContainer: {
    width: 40,
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
  findPoepleIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});
