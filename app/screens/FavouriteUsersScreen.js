import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Modal,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import {useTheme} from '../themes/ThemeContext';
import firestore from '@react-native-firebase/firestore';
import MyIndicator from '../components/MyIndicator';
import fontFamily from '../styles/fontFamily';
import ShimmerEffectCompo from '../components/ShimmerEffectCompo';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import ShowFavouriteUsersCompo from '../components/ShowFavouriteUsersCompo';
import navigationStrings from '../navigation/navigationStrings';

export default function FavouriteUsersScreen() {
  const {theme} = useTheme();
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const [currentUserAllData, setCurrentUserAllData] = useState(null);
  const [favoriteUsers, setFavoriteUser] = useState([]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .onSnapshot(snap => {
        if (snap.exists) {
          var data = snap.data();
          setCurrentUserAllData(data);
          if (data.hasOwnProperty('favourites')) {
            const favorites = data.favourites;
            setFavoriteUser(favorites);
          }
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, []);

  const handleAddToFavorite = async otherUserUid => {
    try {
      const loggedUserId = auth().currentUser?.uid;
      const userRef = firestore().collection('users').doc(loggedUserId);
      const fuserRef = await userRef.get();
      if (fuserRef.exists) {
        const fuserData = fuserRef.data();

        if (fuserData.hasOwnProperty('favourites')) {
          let updatedFavouriteUsers = [...fuserData.favourites]; // Create a new array
          if (fuserData.favourites.includes(otherUserUid)) {
            updatedFavouriteUsers = updatedFavouriteUsers.filter(
              id => id !== otherUserUid,
            ); // Remove User id
          } else {
            updatedFavouriteUsers.push(otherUserUid); // Add User id
          }
          await userRef.update({favourites: updatedFavouriteUsers}); // Update the User id
        } else {
          // If 'fcmToken' field doesn't exist, set it
          await userRef.set({...fuserData, favourites: [otherUserUid]});
        }
      }
    } catch (error) {
      console.log(
        'Error in handleAddToFavorite function in ShowPostOption Modal compo: ',
        error,
      );
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title="Favourites"
          onPress={() => navigation.goBack()}
          rightIcon={require('../assets/ic_plus.png')}
          rightIconStyle={{width: 16, height: 16, tintColor: theme.gray}}
          onPressRight={() =>
            navigation.navigate(navigationStrings.SEARCH_PEOPLE_SCREEN, {
              screenName: 'FavouriteUsersScreen',
            })
          }
        />
        {favoriteUsers?.length > 0 && (
          <FlatList
            data={favoriteUsers}
            renderItem={({item}) => (
              <ShowFavouriteUsersCompo
                data={item}
                handleAddToFavorite={handleAddToFavorite}
              />
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </ScreenComponent>
      <MyIndicator
        visible={laoding}
        backgroundColor={theme.loginBackground}
        size={'large'}
      />
    </>
  );
}
