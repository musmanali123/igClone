import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import {useTheme} from '../../themes/ThemeContext';
import FollowingStyle from '../style/FollowingStyle';
import TopCompoWithHeading from '../../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import ShowFollowerFollowingCompo from './ShowFollowerFollowingCompo';

export default function FollowerAndFollowingScreen({route}) {
  const followersList = route.params?.followerList;
  const followingList = route.params?.followingList;
  const selectedIndexName = route.params?.selectedIndex;
  const totalFollowers = route.params?.totalFollowers;
  const totalFollowing = route.params?.totalFollowing;
  const userName = route.params?.userName;
  const {theme} = useTheme();
  const styles = FollowingStyle(theme);
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(selectedIndexName);

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.profileBg}}>
        <TopCompoWithHeading
          title={userName}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.followerTabMainConatainer}>
          <TouchableOpacity
            style={[
              styles.followerTabConatainer,
              {
                borderColor:
                  selectedIndex === 'followers'
                    ? 'white'
                    : theme.profileImgBorder,
              },
            ]}
            onPress={() => setSelectedIndex('followers')}>
            <Text
              style={[
                styles.followerTabText,
                {
                  color:
                    selectedIndex === 'followers'
                      ? theme.text
                      : theme.userFollowerGrayText,
                },
              ]}>
              {totalFollowers} Followers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.followerTabConatainer,
              {
                borderColor:
                  selectedIndex === 'following'
                    ? 'white'
                    : theme.profileImgBorder,
              },
            ]}
            onPress={() => setSelectedIndex('following')}>
            <Text
              style={[
                styles.followerTabText,
                {
                  color:
                    selectedIndex === 'following'
                      ? theme.text
                      : theme.userFollowerGrayText,
                },
              ]}>
              {totalFollowing} Following
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 12}}>
          <FlatList
            data={selectedIndex === 'followers' ? followersList : followingList}
            renderItem={({item}) => <ShowFollowerFollowingCompo item={item} />}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScreenComponent>
    </>
  );
}
