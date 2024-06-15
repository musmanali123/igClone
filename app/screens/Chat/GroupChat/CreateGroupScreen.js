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

export default function CreateGroupScreen() {
  const {theme} = useTheme();
  //   const styles = ChatStyle(theme);
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const [groupName, setGroupName] = useState('');
  const currentUserId = auth().currentUser.uid;
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([currentUserId]);
  const [selectedName, setSelectedName] = useState([]);

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

        setAllUsers(users);
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

  const handleCreateGroup = async () => {
    if (groupName === '') {
      return Alert.alert('Group name is not empty!');
    }
    try {
      setLoading(true);
      // Create a new document in the "chat" collection
      const groupRef = await firestore().collection('chats').add({
        groupName: groupName,
        members: selectedUsers,
        groupAdmin: currentUserId,
        lastMessage: '',
        messageTime: new Date(),
        type: '',
      });
      // Get the ID of the newly created group
      const groupId = groupRef.id;
      setLoading(false);
      navigation.navigate(navigationStrings.GROUP_CHAT_SCREEN, {
        groupId: groupId,
      });
    } catch (error) {
      setLoading(false);
      console.error('Error creating group:', error);
      throw error;
    }
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <TopCreateGroupCompo
            groupName={groupName}
            setGroupName={setGroupName}
            onPress={() => navigation.goBack()}
          />
          <View style={styles.selectedUsersNamesContainer}>
            <Text style={[styles.textStyle, {color: theme.lightblack}]}>
              To:
            </Text>
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
                  onPress={() =>
                    handleAddMemberForGroup(item.id, item.fullName)
                  }
                  selectedUsers={selectedUsers}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={<View style={{marginVertical: 10}} />}
            />
          </View>
          {selectedUsers?.length > 2 && (
            <View style={styles.buttonContainer}>
              <ButtonComponent
                title="Create Group Chat"
                style={styles.buttonStyle}
                onPress={handleCreateGroup}
                loading={laoding}
              />
            </View>
          )}
        </KeyboardAvoidingView>
      </ScreenComponent>
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
