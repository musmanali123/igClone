import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import TopCompoWithHeading from '../../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../themes/ThemeContext';
import auth from '@react-native-firebase/auth';
import {
  ZegoUIKitPrebuiltCall,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

export default function VideoCallScreen({route}) {
  const {theme} = useTheme();
  const receiverData = route.params?.userData;
  const callID = route.params?.callID;
  const navigation = useNavigation();
  const currentUserUid = auth().currentUser.uid;
  const currentUserName = auth().currentUser.displayName;
  const randomUserID = String(Math.floor(Math.random() * 100000));
  console.log('....Call id is..... ', callID);
  //   let callID = currentUserUid + receiverData.id;
  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <TopCompoWithHeading
          title="Video Calling"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <Text style={{color: theme.text}}>Video Call Screen</Text>
          <ZegoUIKitPrebuiltCall
            appID={609564819}
            appSign={
              '7470e8a0e558b0159724bd9d285c337ea3dc7294556681f147026dc4d5b29fc0'
            }
            userID={currentUserUid} // userID can be something like a phone number or the user id on your own user system.
            userName={currentUserName}
            callID={callID} // callID can be any unique string.
            config={{
              // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
              ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
              onOnlySelfInRoom: () => {
                navigation.goBack();
              },
              onHangUp: () => {
                navigation.goBack();
              },
            }}
          />
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
