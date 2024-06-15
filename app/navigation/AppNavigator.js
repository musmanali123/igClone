import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import TabRoutes from './TabRoutes';
import PhotoCaptureScreen from '../screens/CreatePost/PhotoCaptureScreen';
import CreatePostScreen from '../screens/CreatePost/CreatePostScreen';
import CreateStoryScreen from '../screens/CreateStory/CreateStoryScreen';
import ShowGalleryStoryScreen from '../screens/CreateStory/ShowGalleryStoryScreen';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import ShowAllUserPostsScreen from '../screens/Profile/ShowAllUserPostsScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import FollowerAndFollowingScreen from '../screens/Following/FollowerAndFollowingScreen';
import EditPostScreen from '../screens/CreatePost/EditPostScreen';
import AboutAccountScreen from '../screens/AboutAccountScreen';
import SavedPostsScreen from '../screens/SavedPostsScreen';
import DiscoverPeopleScreen from '../screens/DiscoverPeopleScreen';
import NotificationScreen from '../screens/Notification/NotificationScreen';
import ShowGalleryReelScreen from '../screens/Reels/ShowGalleryReelScreen';
import CreateReelScreen from '../screens/Reels/CreateReelScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import SearchPeopleScreen from '../screens/SearchPeopleScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ChatUsersListScreen from '../screens/Chat/ChatUsersListScreen';
import ChatSearchScreen from '../screens/Chat/ChatSearchScreen';
import CreateGroupScreen from '../screens/Chat/GroupChat/CreateGroupScreen';
import GroupChatScreen from '../screens/Chat/GroupChat/GroupChatScreen';
import GroupDetailScreen from '../screens/Chat/GroupChat/GroupDetailScreen';
import GroupMembersScreen from '../screens/Chat/GroupChat/GroupMembersScreen';
import AddPeopleGroupScreen from '../screens/Chat/GroupChat/AddPeopleGroupScreen';
import VideoCallScreen from '../screens/Chat/VideoCallScreen';
import OnbordingScreen from '../screens/OnbordingScreen';
import BottomSheetScreen from '../screens/BottomSheetScreen';
import FavouriteUsersScreen from '../screens/FavouriteUsersScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerProfile = () => (
  <>
    <Drawer.Navigator
      initialRouteName="TabRoutes"
      screenOptions={{
        // drawerStyle: {
        //   width: wid * 0.7,
        //   alignSelf: 'center',
        // },
        // sceneContainerStyle: {
        //   backgroundColor: '#F2F2F7',
        // },
        headerShown: false,
        drawerPosition: 'right',
        drawerActiveBackgroundColor: 'transparent',
        drawerInactiveBackgroundColor: 'transparent',
        // drawerActiveTintColor: 'red',

        // drawerInactiveTintColor: 'green',
        // overlayColor: 'transparent',
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="TabRoutes"
        component={TabRoutes}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  </>
);
function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="MainTabRoutes">
      <Stack.Screen
        name="MainTabRoutes"
        component={DrawerProfile}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="TabRoutes"
        component={TabRoutes}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PhotoCaptureScreen"
        component={PhotoCaptureScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreatePostScreen"
        component={CreatePostScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateStoryScreen"
        component={CreateStoryScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowGalleryStoryScreen"
        component={ShowGalleryStoryScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowAllUserPostsScreen"
        component={ShowAllUserPostsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FollowerAndFollowingScreen"
        component={FollowerAndFollowingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditPostScreen"
        component={EditPostScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AboutAccountScreen"
        component={AboutAccountScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SavedPostsScreen"
        component={SavedPostsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DiscoverPeopleScreen"
        component={DiscoverPeopleScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowGalleryReelScreen"
        component={ShowGalleryReelScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateReelScreen"
        component={CreateReelScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SearchPeopleScreen"
        component={SearchPeopleScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ExploreScreen"
        component={ExploreScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChatUsersListScreen"
        component={ChatUsersListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChatSearchScreen"
        component={ChatSearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateGroupScreen"
        component={CreateGroupScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GroupChatScreen"
        component={GroupChatScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GroupDetailScreen"
        component={GroupDetailScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GroupMembersScreen"
        component={GroupMembersScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddPeopleGroupScreen"
        component={AddPeopleGroupScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VideoCallScreen"
        component={VideoCallScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OnbordingScreen"
        component={OnbordingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BottomSheetScreen"
        component={BottomSheetScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FavouriteUsersScreen"
        component={FavouriteUsersScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
export default AppNavigator;
