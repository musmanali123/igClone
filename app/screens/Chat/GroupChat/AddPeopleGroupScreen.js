import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ChatStyle from '../../style/ChatStyle';
import ScreenComponent from '../../../components/ScreenComponent';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import MyIndicator from '../../../components/MyIndicator';
import {useNavigation} from '@react-navigation/native';
import colors from '../../../styles/colors';
import {useTheme} from '../../../themes/ThemeContext';
import TopCreateGroupCompo from './components/TopCreateGroupCompo';
import ButtonComponent from '../../CreateAccount/components/ButtonComponent';
import ShowAllUsersCreateGroupCompo from './components/ShowAllUsersCreateGroupCompo';
import navigationStrings from '../../../navigation/navigationStrings';
import TopCompoWithHeading from '../../../components/TopCompoWithHeading';

export default function AddPeopleGroupScreen({route}) {
  const {theme} = useTheme();
  const groupData = route.params?.groupData;
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const currentUserId = auth().currentUser.uid;
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedName, setSelectedName] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .onSnapshot(snapshot => {
        const users = [];
        snapshot.forEach(doc => {
          const userData = doc.data();
          const userId = doc.id;
          if (userId !== currentUserId) {
            users.push({...userData, id: userId});
          }
        });
        const filterd = users.filter(e => !groupData.members.includes(e.id));
        setAllUsers(filterd);
      });

    return () => unsubscribe();
  }, []);

  const handleAddMemberForGroup = (memId, memName) => {
    const uid = memId;
    // Check if the user is already selected, if yes, remove them; otherwise, add them to the selectedUsers array
    if (selectedUsers.includes(uid)) {
      const updatedUsers = selectedUsers.filter(
        selectedUid => selectedUid !== uid,
      );
      setSelectedUsers(updatedUsers);
    } else {
      setSelectedUsers([...selectedUsers, uid]);
    }
    if (selectedName.includes(memName)) {
      const updatedUsersName = selectedName.filter(
        selectedN => selectedN !== memName,
      );
      setSelectedName(updatedUsersName);
    } else {
      setSelectedName([...selectedName, memName]);
    }
  };

  const handleAddMemeberInGroup = async () => {
    try {
      //   setLoading(true);
      //   const groupRef = await firestore().collection('chats').add({
      //     groupName: groupName,
      //     members: selectedUsers,
      //     groupAdmin: currentUserId,
      //     lastMessage: '',
      //     messageTime: new Date(),
      //     type: '',
      //   });
      //   const groupId = groupRef.id;
      //   setLoading(false);
      //   navigation.navigate(navigationStrings.GROUP_CHAT_SCREEN, {
      //     groupId: groupId,
      //   });
      setLoading(true);
      const groupmembers = groupData.members;
      groupmembers.push(...selectedUsers);
      await firestore().collection('chats').doc(groupData.groupId).update({
        members: groupmembers,
      });
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.error('Error creating group:', error);
      throw error;
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title="Add People"
          onPress={() => navigation.goBack()}
          rightTitle={selectedUsers?.length > 0 ? 'Done' : ''}
          onPressRightTitle={() => handleAddMemeberInGroup()}
        />
        <View style={styles.selectedUsersNamesContainer}>
          <Text style={[styles.textStyle, {color: theme.lightblack}]}>To:</Text>
          <FlatList
            data={selectedName}
            renderItem={({item}) => (
              <View
                style={[
                  styles.selectUserContainer,
                  {backgroundColor: theme.chatTextInputBg},
                ]}>
                <Text style={[styles.userNameStyle, {color: theme.text}]}>
                  {item}
                </Text>
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={{flex: 1}}>
          <FlatList
            data={allUsers}
            renderItem={({item}) => (
              <ShowAllUsersCreateGroupCompo
                item={item}
                onPress={() => handleAddMemberForGroup(item.id, item.fullName)}
                selectedUsers={selectedUsers}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={<View style={{marginVertical: 10}} />}
          />
        </View>
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
  buttonStyle: {
    backgroundColor: colors.lightBlue,
    borderRadius: 6,
    width: '90%',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  textStyle: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 12,
  },
  userNameStyle: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedUsersNamesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    // backgroundColor: 'red',
  },
  selectUserContainer: {
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
  },
});
