import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';
import ScreenComponent from '../../../components/ScreenComponent';
import {useTheme} from '../../../themes/ThemeContext';
import MyIndicator from '../../../components/MyIndicator';
import TopCompoWithHeading from '../../../components/TopCompoWithHeading';
import fontFamily from '../../../styles/fontFamily';
import navigationStrings from '../../../navigation/navigationStrings';

export default function GroupMembersScreen({route}) {
  const {theme} = useTheme();
  const groupData = route.params?.groupData;
  const membersData = route.params?.membersData;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const currentUserUid = auth().currentUser?.uid;
  const currentUserName = auth().currentUser?.displayName;
  const [groupAdminData, setGroupAdminData] = useState(null);
  var isMounted = false;

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('users')
      .doc(groupData.groupAdmin)
      .onSnapshot(snap => {
        if (snap.exists) {
          var data = snap.data();
          setGroupAdminData(data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, []);

  const profileNavigationHandler = id => {
    if (id == currentUserUid) {
      return null;
    } else {
      navigation.navigate(navigationStrings.USER_PROFILE, {
        userUid: id,
      });
    }
  };

  // userUid

  const RenderItem = ({item}) => {
    return (
      <View style={styles.userDetailContainer}>
        <TouchableOpacity
          style={styles.userDetailMainContainer}
          onPress={() => profileNavigationHandler(item.userUid)}>
          <FastImage
            source={{
              uri:
                item?.imageUrl !== ''
                  ? item?.imageUrl
                  : 'https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg',
            }}
            style={styles.profileImage}
          />
          <View style={styles.userProfileImageCotainer}>
            <Text style={[styles.userName, {color: theme.text}]}>
              {item?.fullName} {item.userUid === currentUserUid ? '(You)' : ''}
            </Text>
            {item?.bio !== '' && (
              <Text style={[styles.bio, {color: theme.userFollowerGrayText}]}>
                {item?.bio.length > 30
                  ? item?.bio.slice(0, 30) + ' ...'
                  : item?.bio}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          onPress={() => navigation.goBack()}
          title="People"
          rightIcon={require('../../../assets/invite.png')}
          rightIconStyle={{tintColor: theme.text}}
          onPressRight={() =>
            navigation.navigate(navigationStrings.ADD_PEOPLE_GROUP_SCREEN, {
              groupData: groupData,
            })
          }
        />
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={[styles.heading, {color: theme.text}]}>Members</Text>
            <View style={[styles.userDetailContainer]}>
              <TouchableOpacity
                style={styles.userDetailMainContainer}
                onPress={() => profileNavigationHandler(groupData?.groupAdmin)}>
                <FastImage
                  source={{
                    uri:
                      groupAdminData?.imageUrl !== ''
                        ? groupAdminData?.imageUrl
                        : 'https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg',
                  }}
                  style={styles.profileImage}
                />
                <View style={styles.userProfileImageCotainer}>
                  <Text style={[styles.userName, {color: theme.text}]}>
                    {groupAdminData?.fullName}
                  </Text>
                  <Text
                    style={[
                      styles.bio,
                      {fontSize: 10, color: theme.gray, fontWeight: '700'},
                    ]}>
                    Admin
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <FlatList
              data={membersData}
              renderItem={({item}) => {
                if (item?.userUid !== groupData?.groupAdmin) {
                  return <RenderItem item={item} />;
                }
              }}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </ScreenComponent>
      <MyIndicator
        visible={loading}
        backgroundColor={theme.loginBackground}
        size={'large'}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    marginTop: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
  },
  bio: {
    fontSize: 10,
    marginTop: 4,
  },
  userDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userDetailMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfileImageCotainer: {
    marginLeft: 12,
  },
});
