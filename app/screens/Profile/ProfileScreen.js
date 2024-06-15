import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import useAuth from '../../auth/useAuth';
import auth from '@react-native-firebase/auth';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../themes/ThemeContext';
import ProfileStyle from '../style/ProfileStyle';
import firestore from '@react-native-firebase/firestore';
import MyIndicator from '../../components/MyIndicator';
import ProfileGridCompo from './ProfileGridCompo';
import ProfileReelCompo from './ProfileReelCompo';
import ProfileUserTagsCompo from './ProfileUserTagsCompo';
import navigationStrings from '../../navigation/navigationStrings';
import ScreenComponent from '../../components/ScreenComponent';

export default function ProfileScreen() {
  const {theme} = useTheme();
  const styles = ProfileStyle(theme);
  const navigation = useNavigation();
  const [laoding, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userImageUrl, setUserImageUrl] = useState('');
  const [userAllData, setUserAllData] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [userPostsLength, setUserPostsLength] = useState(0);
  const [showUserImageModal, setShowUserImageModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .onSnapshot(snap => {
        if (snap.exists) {
          var data = snap.data();
          setUserAllData(data);
          setUserImageUrl(data.imageUrl);
          setUserName(data.fullName);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, []);

  const {logout} = useAuth();
  const handleLogout = () => {
    if (auth().currentUser) {
      logout();
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.profileBg}}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <TouchableOpacity style={styles.drawerIconContainer}>
                <View style={styles.drawerIcon} />
              </TouchableOpacity>
              <Text style={styles.userName}>{userName}</Text>
              <TouchableOpacity
                style={styles.drawerIconContainer}
                onPress={() => navigation.openDrawer()}>
                <Image
                  source={require('../../assets/drawer_Icon.png')}
                  style={styles.drawerIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.userDetailContainer}>
              <View style={styles.profileImageContainer}>
                <TouchableOpacity
                  onPress={() => {
                    userImageUrl !== '' && setShowUserImageModal(true);
                  }}>
                  <FastImage
                    source={{
                      uri:
                        userImageUrl !== ''
                          ? userImageUrl
                          : 'https://is3-ssl.mzstatic.com/image/thumb/Purple127/v4/f5/ca/fd/f5cafd96-f3a4-8ec1-37b0-2e82f8bdea77/source/512x512bb.jpg',
                    }}
                    style={styles.profileImageStyle}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.followerContainer}>
                <TouchableOpacity style={styles.followingTextContainer}>
                  <Text style={styles.followingContentText}>
                    {userPostsLength}
                  </Text>
                  <Text style={styles.followingContentText1}>Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.followingTextContainer}
                  onPress={() => {
                    userAllData !== null && userAllData.followers.length > 0
                      ? navigation.navigate(
                          navigationStrings.FOLLOWER_FOLLOWING_SCREEN,
                          {
                            followingList: userAllData.following,
                            followerList: userAllData.followers,
                            userName: userName,
                            selectedIndex: 'followers',
                            totalFollowers: userAllData.followers.length,
                            totalFollowing: userAllData.following.length,
                          },
                        )
                      : null;
                  }}>
                  <Text style={styles.followingContentText}>
                    {userAllData !== null ? userAllData.followers.length : '22'}
                  </Text>
                  <Text style={styles.followingContentText1}>Followers</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.followingTextContainer}
                  onPress={() => {
                    userAllData !== null && userAllData.following.length > 0
                      ? navigation.navigate(
                          navigationStrings.FOLLOWER_FOLLOWING_SCREEN,
                          {
                            followingList: userAllData.following,
                            followerList: userAllData.followers,
                            userName: userName,
                            selectedIndex: 'following',
                            totalFollowers: userAllData.followers.length,
                            totalFollowing: userAllData.following.length,
                          },
                        )
                      : null;
                  }}>
                  <Text style={styles.followingContentText}>
                    {userAllData !== null ? userAllData.following.length : '22'}
                  </Text>
                  <Text style={styles.followingContentText1}>Following</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.bioContainer}>
              <Text style={styles.bioText}>
                {userAllData !== null ? userAllData.bio : ''}
              </Text>
            </View>
            <View style={{paddingHorizontal: 24}}>
              <TouchableOpacity
                style={styles.editProfileBtnContainer}
                onPress={() =>
                  navigation.navigate(navigationStrings.EDIT_PROFILE, {
                    userData: userAllData,
                  })
                }>
                <Text style={styles.editProfileBtnText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.profileTabContainer}>
              <TouchableOpacity
                style={[
                  styles.profileTabsIconContainer,
                  {
                    borderColor:
                      selectedTab === 0 ? theme.text : theme.profileImgBorder,
                  },
                ]}
                onPress={() => setSelectedTab(0)}>
                <Image
                  source={require('../../assets/grid.png')}
                  style={[
                    styles.profileTabsIconStyle,
                    {
                      tintColor:
                        selectedTab === 0 ? theme.text : theme.profileGray,
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.profileTabsIconContainer,
                  {
                    borderColor:
                      selectedTab === 1 ? theme.text : theme.profileImgBorder,
                  },
                ]}
                onPress={() => setSelectedTab(1)}>
                <Image
                  source={require('../../assets/reel.png')}
                  style={[
                    styles.profileTabsIconStyle,
                    {
                      tintColor:
                        selectedTab === 1 ? theme.text : theme.profileGray,
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.profileTabsIconContainer,
                  {
                    borderColor:
                      selectedTab === 2 ? theme.text : theme.profileImgBorder,
                  },
                ]}
                onPress={() => setSelectedTab(2)}>
                <Image
                  source={require('../../assets/user_two.png')}
                  style={[
                    styles.profileTabsIconStyle,
                    {
                      tintColor:
                        selectedTab === 2 ? theme.text : theme.profileGray,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
            {selectedTab === 0 && (
              <ProfileGridCompo
                setUserPostsLength={setUserPostsLength}
                userUid={auth().currentUser.uid}
              />
            )}
            {selectedTab === 1 && (
              <ProfileReelCompo userID={auth().currentUser?.uid} />
            )}
            {selectedTab === 2 && <ProfileUserTagsCompo />}
            {showUserImageModal && (
              <Modal style={{backgroundColor: 'transparent'}}>
                <ScreenComponent style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                  <View style={styles.userImageModalContainer}>
                    <TouchableOpacity
                      style={styles.closeIconContainerModal}
                      onPress={() => setShowUserImageModal(false)}>
                      <Image
                        source={require('../../assets/close.png')}
                        style={styles.closeIconModal}
                      />
                    </TouchableOpacity>
                    <FastImage
                      source={{uri: userImageUrl}}
                      style={{width: '96%', height: '90%'}}
                      resizeMode="contain"
                    />
                  </View>
                </ScreenComponent>
              </Modal>
            )}
          </View>
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
