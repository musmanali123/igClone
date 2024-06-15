import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import {useTheme} from '../../../../themes/ThemeContext';

const ShowGroupImageCompo = ({userList}) => {
  const latestUser = userList[userList.length - 1];
  const [loading, setLoading] = useState(false);
  const [groupMemberImage, setGroupMemberImage] = useState('');
  const {theme} = useTheme();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('users')
      .doc(latestUser)
      .onSnapshot(snap => {
        if (snap.exists) {
          var data = snap.data();
          setGroupMemberImage(data.imageUrl);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, []);
  return (
    <>
      {loading ? (
        <ActivityIndicator size={24} color={theme.text} />
      ) : (
        <>
          <View>
            <FastImage
              style={styles.profileImage}
              source={{uri: auth().currentUser?.photoURL}}
            />
            <FastImage
              style={styles.groupMemberImage}
              source={
                groupMemberImage === ''
                  ? require('../../../../assets/avatar.png')
                  : {uri: groupMemberImage}
              }
            />
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  profileImage: {width: 50, height: 50, borderRadius: 25},
  groupMemberImage: {
    width: 54,
    height: 54,
    borderRadius: 26,
    position: 'absolute',
    top: 10,
    left: 15,
  },
});

export default ShowGroupImageCompo;
