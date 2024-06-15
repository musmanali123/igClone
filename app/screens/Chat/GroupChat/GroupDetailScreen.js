import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
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

export default function GroupDetailScreen({route}) {
  const {theme} = useTheme();
  const groupData = route.params?.groupData;
  const groupMemberImage = route.params?.groupMemberImage;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const currentUserUid = auth().currentUser?.uid;
  const currentUserName = auth().currentUser?.displayName;
  const [membersData, setMembersData] = useState([]);
  var isMounted = false;

  useEffect(() => {
    isMounted = true;
    getUsersData();
    return () => {
      isMounted = false;
    };
  }, []);

  const getUsersData = async () => {
    try {
      setLoading(true);
      const usersList = groupData.members;
      const usersRef = firestore().collection('users');
      const querySnapshot = await usersRef
        .where(firestore.FieldPath.documentId(), 'in', usersList)
        .get();
      const usersData = [];
      querySnapshot.forEach(doc => {
        usersData.push({...doc.data(), userUid: doc.id});
      });
      setMembersData(usersData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const leaveGroup = async () => {
    try {
      setLoading(true);
      const groupmembers = groupData.members;
      const removeCurrentUser = groupmembers.filter(e => e !== currentUserUid);
      await firestore().collection('chats').doc(groupData.groupId).update({
        members: removeCurrentUser,
      });
      setLoading(false);
      navigation.navigate(navigationStrings.CHAT_USERS_LIST_SCREEN);
    } catch (error) {
      setLoading(false);
      console.error('Error creating group:', error);
      throw error;
    }
  };

  const handleLeaveGroup = () => {
    try {
      Alert.alert('Warning', 'Are you sure to leave this group!', [
        {
          text: 'Yes',
          onPress: leaveGroup,
        },
        {
          text: 'No',
        },
      ]);
    } catch (error) {
      console.log(
        '============ ERROR WHILE Leaving the group in chat ========================',
      );
      console.log(error);
      console.log('====================================');
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading onPress={() => navigation.goBack()} />
        <View style={styles.container}>
          <View>
            <FastImage
              source={{uri: auth().currentUser?.photoURL}}
              style={styles.profileImage}
            />
            <FastImage
              source={{
                uri: groupMemberImage
                  ? groupMemberImage
                  : 'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png',
              }}
              style={styles.profileImagetwo}
            />
          </View>
        </View>
        <View style={{alignItems: 'center', marginTop: 26}}>
          <Text style={[styles.groupNameStyle, {color: theme.text}]}>
            {groupData?.groupName}
          </Text>
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            style={{alignItems: 'center'}}
            onPress={() =>
              navigation.navigate(navigationStrings.ADD_PEOPLE_GROUP_SCREEN, {
                groupData: groupData,
              })
            }>
            <Image
              source={require('../../../assets/invite.png')}
              style={[styles.icon, {tintColor: theme.text}]}
            />
            <Text style={[styles.iconText, {color: theme.text}]}>Add</Text>
          </TouchableOpacity>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../../../assets/tab_search.png')}
              style={[styles.icon, {tintColor: theme.text}]}
            />
            <Text style={[styles.iconText, {color: theme.text}]}>Search</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../../../assets/bell.png')}
              style={[styles.icon, {tintColor: theme.text}]}
            />
            <Text style={[styles.iconText, {color: theme.text}]}>Mute</Text>
          </View>
          <TouchableOpacity
            style={{alignItems: 'center'}}
            onPress={handleLeaveGroup}>
            <Image
              source={require('../../../assets/exit.png')}
              style={[styles.icon, {tintColor: theme.text}]}
            />
            <Text style={[styles.iconText, {color: theme.text}]}>Leave</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 40, paddingHorizontal: 20}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../../assets/invite.png')}
              style={[styles.icon, {tintColor: theme.text}]}
            />
            <TouchableOpacity
              style={{marginLeft: 14}}
              onPress={() =>
                navigation.navigate(navigationStrings.GROUP_MEMBERS_SCREEN, {
                  groupData: groupData,
                  membersData: membersData,
                })
              }>
              <Text style={[styles.heading2, {color: theme.text}]}>People</Text>
              <Text
                style={[styles.desc, {color: theme.gray}]}
                numberOfLines={1}>
                {membersData.map(ele => ele.fullName + ', ')}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Image
              source={require('../../../assets/lock.png')}
              style={[styles.icon, {tintColor: theme.text}]}
            />
            <TouchableOpacity style={{marginLeft: 14}}>
              <Text style={[styles.heading2, {color: theme.text}]}>
                Privacy and safety
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    alignItems: 'center',
    paddingVertical: 14,
  },
  profileImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    borderRadius: 30,
  },
  profileImagetwo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    borderRadius: 30,
    position: 'absolute',
    top: 20,
    left: 20,
  },
  groupNameStyle: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  iconText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 10,
  },
  iconsContainer: {
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  heading2: {
    fontSize: 14,
    fontWeight: '600',
  },
  desc: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});
