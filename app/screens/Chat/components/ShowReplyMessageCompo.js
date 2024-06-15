import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../../styles/colors';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useTheme} from '../../../themes/ThemeContext';
const ShowReplyMessageCompo = ({senderId, messageSender, chatId, replyId}) => {
  const [replyData, setReplyData] = useState();
  const [userName, setUserName] = useState('');
  const currenUserUid = auth().currentUser.uid;
  const {theme} = useTheme();
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .doc(replyId)
      .onSnapshot(snapShot => {
        var data = snapShot.data();
        if (data) {
          setReplyData(data);
          firestore()
            .collection('users')
            .doc(data?.senderID)
            .get()
            .then(snap => {
              var userData = snap.data();
              var name = userData.fullName;
              setUserName(name);
            });
        }
      });

    return () => unsubscribe();
  }, []);
  return (
    <>
      {replyData !== undefined && (
        <View
          style={[
            styles.replyMessageContainer,
            {
              backgroundColor:
                messageSender === senderId ? '#633FCB' : theme.background,
              borderLeftColor:
                messageSender === senderId ? '#262626' : theme.gray,
            },
          ]}>
          <Text
            style={[
              styles.replyheadingText,
              {
                color:
                  messageSender === senderId ? theme.background : theme.text,
              },
            ]}>
            {replyData.senderID == currenUserUid ? 'You' : userName}
          </Text>
          {replyData.type === 'text' ? (
            <View>
              <Text
                style={[
                  styles.text,
                  {
                    color:
                      messageSender === senderId
                        ? colors.LightWhite
                        : theme.gray,
                  },
                ]}>
                {replyData.message.length > 20
                  ? replyData.message.slice(0, 20) + '...'
                  : replyData.message}
              </Text>
            </View>
          ) : replyData.type === 'image' ? (
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../assets/ic_image.png')}
                style={[
                  styles.imageStyle,
                  {
                    tintColor:
                      messageSender === senderId
                        ? colors.LightWhite
                        : colors.black,
                  },
                ]}
              />
              {replyData.extraText !== '' ? (
                <Text
                  style={[
                    styles.text,
                    {
                      color:
                        messageSender === senderId
                          ? colors.LightWhite
                          : colors.black,
                      marginLeft: 8,
                    },
                  ]}>
                  {replyData.extraText.length > 20
                    ? replyData.extraText.slice(0, 20) + '...'
                    : replyData.extraText}
                </Text>
              ) : (
                <Text
                  style={[
                    styles.text,
                    {
                      color:
                        messageSender === senderId
                          ? colors.LightWhite
                          : colors.black,
                      marginLeft: 8,
                    },
                  ]}>
                  Photo
                </Text>
              )}
            </View>
          ) : replyData.type === 'audio' ? (
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../assets/mic.png')}
                style={[
                  styles.imageStyle,
                  {
                    tintColor:
                      messageSender === senderId
                        ? colors.LightWhite
                        : colors.black,
                  },
                ]}
              />
              <Text
                style={[
                  styles.text,
                  {
                    color:
                      messageSender === senderId
                        ? colors.LightWhite
                        : colors.black,
                    marginLeft: 8,
                  },
                ]}>
                Voice
              </Text>
            </View>
          ) : replyData.type === 'file' ? (
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../assets/ic_document.png')}
                style={[
                  styles.imageStyle,
                  {
                    tintColor:
                      messageSender === senderId
                        ? colors.LightWhite
                        : colors.black,
                  },
                ]}
              />
              {replyData.extraText !== '' ? (
                <Text
                  style={[
                    styles.text,
                    {
                      color:
                        messageSender === senderId
                          ? colors.LightWhite
                          : colors.black,
                    },
                  ]}>
                  {replyData.extraText.length > 20
                    ? replyData.extraText.slice(0, 20) + '...'
                    : replyData.extraText}
                </Text>
              ) : (
                <Text
                  style={[
                    styles.text,
                    {
                      color:
                        messageSender === senderId
                          ? colors.LightWhite
                          : colors.black,
                      marginLeft: 8,
                    },
                  ]}>
                  Document
                </Text>
              )}
            </View>
          ) : null}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  replyMessageContainer: {
    backgroundColor: colors.whiteOpacity70,
    borderRadius: 6,
    paddingHorizontal: 6,
    borderLeftWidth: 4,

    paddingVertical: 12,
    marginBottom: 6,
    minWidth: 60,
  },
  replyheadingText: {
    fontSize: 12,
    color: colors.blue,
    fontFamily: 'UberMove-Medium',
  },
  text: {
    fontSize: 14,
    color: colors.black,
    fontFamily: 'UberMove-Medium',
    // marginStart: 5,
  },
  imageStyle: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
});

export default ShowReplyMessageCompo;
