import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ChatStyle from '../style/ChatStyle';
import ScreenComponent from '../../components/ScreenComponent';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import MyIndicator from '../../components/MyIndicator';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../themes/ThemeContext';
import TopChatComponent from './components/TopChatComponent';
import AddNewMessageCompo from './components/AddNewMessageCompo';
import ShowMessagesComponent from './components/ShowMessagesComponent';
import ShowDateMessagesCompo from './components/ShowDateMessagesCompo';
import askPermissionsEasy from '../../utils/askPermissionsEasy';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import colors from '../../styles/colors';
import Video from 'react-native-video';
import SoundRecorder from 'react-native-sound-recorder';
import SoundPlayer from 'react-native-sound-player';
import BackgroundTimer from 'react-native-background-timer';
import RecordingComponent from './components/RecordingComponent';
import {sendSingleNotification} from '../../utils/sendNotification';

export default function ChatScreen({route}) {
  const routeData = route?.params;
  const {theme} = useTheme();
  const styles = ChatStyle(theme);
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const currentUserUid = auth().currentUser.uid;
  const [idForReceiver, setIDForReceiver] = useState('');
  const [receiverData, setReceiverData] = useState(null);
  const [newTextMessage, setNewTextMessage] = useState('');
  const [selectedMedia, setSelectedMedia] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyId, setReplyId] = useState('');
  const [replyMessageType, setReplyMessageType] = useState('');
  const [replyUserUid, setReplyUserUid] = useState('');
  const [sendShow, setSendShow] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [recordingModal, setRecordingModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [receiverName, setReceiverName] = useState('');
  const askingPermission = askPermissionsEasy();
  var isMounted = false;

  useEffect(() => {
    isMounted = true;
    getChatMessage();
    getUserData();
    return () => {
      isMounted = false;
    };
  }, []);

  const getChatMessage = () => {
    try {
      setLoading(true);
      firestore()
        .collection('chats')
        .doc(routeData.chatID)
        .collection('messages')
        .orderBy('time', 'asc')
        .onSnapshot(snapshot => {
          const newMessages = snapshot.docs.map(doc => ({
            ...doc.data(),
            _id: doc.id,
            isPlaying: false,
            time: doc.data().time.toDate(),
          }));
          // setMessages(newMessages);
          formatMessages(newMessages);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.log(
        "error while fetching chat message's from firestore in chat screen: ",
        error,
      );
    }
  };

  const getUserData = () => {
    try {
      setLoading(true);
      var separate = routeData.chatID.split('&');
      var id1 = separate[0];
      var id2 = separate[1];
      var receiverID = '';
      if (id1 !== auth().currentUser.uid) {
        receiverID = id1;
      } else {
        receiverID = id2;
      }
      setIDForReceiver(receiverID);
      firestore()
        .collection('users')
        .doc(receiverID)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot.exists) {
            var doc = documentSnapshot.data();
            setReceiverData({...doc, id: documentSnapshot.id});
            setReceiverName(doc?.fullName);
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
    } catch (error) {
      setLoading(false);
      console.log(
        "error while fetching receiver data for chat message's in chat screen: ",
        error,
      );
    }
  };

  // Function to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const formatMessages = messages => {
    const formattedList = [];
    let currentDate = null;
    messages.forEach(message => {
      const messageDate = message.time;
      if (!currentDate || !isSameDay(currentDate, messageDate)) {
        formattedList.push({
          id: `separator_${message._id}`,
          isSeparator: true,
          date: messageDate,
        });
        currentDate = messageDate;
      }
      formattedList.push(message);
    });
    // return formattedList;
    setMessages(formattedList);
  };

  const pickImage = async () => {
    setLoading(true);
    // const value = await askingPermission.requestPermissionn();
    const value = true;
    if (value) {
      const options = {
        title: 'Select Photo',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
        mediaType: 'mixed',
      };

      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
          setLoading(false);
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          setLoading(false);
        } else {
          let mediaUri = response.uri || response.assets?.[0]?.uri;
          let mediaType = response.assets?.[0]?.type;
          setSelectedMedia(mediaUri);
          setSelectedMediaType(mediaType);
          setLoading(false);
          setShowMediaModal(true);
        }
      });
    }
  };

  const captureImage = async () => {
    setLoading(true);
    // const value = await askingPermission.requestPermissionn();
    const value = true;
    if (value) {
      const options = {
        title: 'Click Photo or Record Video',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
        mediaType: 'mixed',
      };

      launchCamera(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
          setLoading(false);
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          setLoading(false);
        } else {
          let mediaUri = response.uri || response.assets?.[0]?.uri;
          let mediaType = response.assets?.[0]?.type;
          setSelectedMedia(mediaUri);
          setSelectedMediaType(mediaType);
          setLoading(false);
          if (mediaUri !== undefined && mediaUri !== null && mediaUri !== '') {
            setShowMediaModal(true);
          }
        }
      });
    }
  };

  const cencelImage = () => {
    setSelectedMedia('');
    setSelectedMediaType('');
    setShowMediaModal(false);
  };

  const onStartRecord = async () => {
    if (Platform.OS === 'android') {
      const grants = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );

      if (grants === PermissionsAndroid.RESULTS.GRANTED) {
        SoundRecorder.start(
          SoundRecorder.PATH_CACHE + '/' + Date.now() + '.mp4',
        )
          .then(function () {})
          .catch(function (error) {
            console.log('error', error);
          });
      }
    } else {
      SoundRecorder.start(SoundRecorder.PATH_CACHE + '/' + Date.now() + '.mp4')
        .then(function () {})
        .catch(function (error) {
          console.log('error', error);
        });
    }
  };

  const onStopRecord = async () => {
    SoundRecorder.stop()
      .then(function (result) {
        var path = result.path;
        let voiceDuration = result.duration;
        // confirmAndSendMesssage(path, '', true);
        confirmAndSendMesssage(path, voiceDuration, true);
      })
      .catch(function (error) {
        console.log('error', error);
      });
  };

  const startPlaying = item => {
    var temp = messages;
    temp.forEach(each => {
      if (item.message === each.message) {
        each.isPlaying = true;
      } else {
        each.isPlaying = false;
      }
    });

    setMessages([...temp]);
  };

  const stopPlaying = item => {
    var temp = messages;
    temp.forEach(each => {
      if (item.message === each.message) {
        each.isPlaying = false;
      }
    });
    setMessages([...temp]);
    SoundPlayer.stop();
    BackgroundTimer.stopBackgroundTimer();
  };

  const swipeToReply = itemReply => {
    let replyMessage = '';
    if (itemReply.type === 'text') {
      setReplyMessageType('text');
      replyMessage =
        itemReply.message.length > 20
          ? itemReply.message.slice(0, 20) + '...'
          : itemReply.message;
    } else if (itemReply.type === 'audio') {
      setReplyMessageType('audio');
      replyMessage = 'Reply to Vocie!';
    } else if (itemReply.type === 'image') {
      setReplyMessageType('image');
      replyMessage = 'Reply to Image!';
    } else if (itemReply.type === 'video') {
      setReplyMessageType('video');
      replyMessage = 'Reply to Video!';
    } else {
      setReplyMessageType('file');
      replyMessage = 'Reply to file';
    }
    setReplyId(itemReply._id);
    setReplyText(replyMessage);
    setReplyUserUid(itemReply.senderID);
  };

  const closeReply = () => {
    setReplyId('');
    setReplyText('');
    setReplyMessageType('');
    setReplyUserUid('');
  };

  const uriToBlob = uri => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error('uriToBlob failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);

      xhr.send(null);
    });
  };

  const confirmAndSendMesssage = async (filePath, extraText, ifAudio) => {
    setLoading(true);
    // const childPath = 'chatImages/' + Date.now() + '.png';
    let childPath = '';
    let mediaType = '';
    if (selectedMediaType.startsWith('image')) {
      childPath = 'chatImages/' + Date.now() + '.jpg';
      mediaType = 'image';
    } else if (selectedMediaType.startsWith('video')) {
      childPath = 'chatVideos/' + Date.now() + '.mp4';
      mediaType = 'video';
    } else {
      childPath = 'chatImages/' + Date.now() + '.jpg';
      mediaType = '';
    }

    // storage()
    //   .ref(childPath)
    //   .putFile(selectedMedia === '' ? filePath : selectedMedia)
    //   .then(snapshot => {
    //     storage()
    //       .ref(childPath)
    //       .getDownloadURL()
    //       .then(url => {
    //         if (ifAudio !== true) {
    //           setSelectedMedia(url);
    //         } else {
    //           // console.log('uploaded file url is     ', url);
    //         }
    //         if (selectedMedia !== '') {
    //           sendMessage(url, mediaType, extraText, false);
    //         } else {
    //           sendMessage(url, 'file', extraText, ifAudio);
    //         }
    //       });
    //   })
    //   .catch(e => {
    //     console.log('uploading image error => ', e);
    //     setLoading(false);
    //   });

    try {
      let bloabMedia;
      if (selectedMedia !== '') {
        let res = await uriToBlob(selectedMedia);
        bloabMedia = res;
      }

      const snapshot = storage().ref(childPath);
      selectedMedia === ''
        ? await snapshot.putFile(filePath)
        : await snapshot.put(bloabMedia);
      const url = await storage().ref(childPath).getDownloadURL();

      if (!ifAudio) {
        setSelectedMedia(url);
      } else {
        // console.log('uploaded file url is     ', url);
      }

      if (selectedMedia !== '') {
        sendMessage(url, mediaType, extraText, false);
      } else {
        sendMessage(url, 'file', extraText, ifAudio);
      }
    } catch (error) {
      console.log('uploading image error => ', error);
      setLoading(false);
    }
  };

  const sendMessage = (txt, type, extraText, ifAudio) => {
    setLoading(true);
    if (type !== 'text') {
    }

    setNewTextMessage('');
    if (extraText === undefined) {
      extraText = '';
    }
    if (ifAudio === true) {
      type = 'audio';
    }

    var lastSendMessage = '';
    var idForMessagesCollection = firestore()
      .collection('chats')
      .doc(routeData.chatID)
      .collection('messages')
      .doc().id;

    lastSendMessage = txt;

    var allIDs = routeData.chatID.split('&');
    var senderID = '';
    var receiverID = '';
    if (allIDs[0] === auth().currentUser.uid) {
      senderID = allIDs[0];
      receiverID = allIDs[1];
    } else {
      senderID = allIDs[1];
      receiverID = allIDs[0];
    }

    firestore().collection('chats').doc(routeData.chatID).set(
      {
        lastMessage: lastSendMessage,
        messageTime: new Date(),
        type: type,
      },
      {merge: true},
    );

    var chatData;

    if (replyId !== '') {
      chatData = {
        message: lastSendMessage,
        time: new Date(),
        senderID: senderID,
        receiverID: receiverID,
        chatID: routeData.chatID,
        isRead: false,
        type: type,
        extraText: extraText,
        replyId: replyId,
      };
    } else {
      chatData = {
        message: lastSendMessage,
        time: new Date(),
        senderID: senderID,
        receiverID: receiverID,
        chatID: routeData.chatID,
        isRead: false,
        type: type,
        extraText: extraText,
      };
    }

    firestore()
      .collection('chats')
      .doc(routeData.chatID)
      .collection('messages')
      .doc(idForMessagesCollection)
      .set(chatData, {merge: true})
      .then(() => {
        setLoading(false);
        setNewTextMessage('');
        setSendShow(false);
        setSelectedMedia('');
        setSelectedMediaType('');
        setShowMediaModal(false);
        closeReply();
        handleSendNotification(
          lastSendMessage,
          receiverID,
          routeData.chatID,
          type,
        );

        // setNotification();
      })
      .catch(err => {
        setLoading(false);
        console.log('Error in uploading messages: ', err);
      });
  };

  const handleSendNotification = (
    lastSendMessage,
    receiverID,
    typeID,
    msgType,
  ) => {
    let bodyNotifi = '';
    let messageType = '';
    if (msgType == 'text') {
      bodyNotifi = lastSendMessage;
      messageType = 'message';
    } else {
      bodyNotifi = msgType;
      messageType = msgType;
    }
    let senderName = auth().currentUser?.displayName;
    const title = `${senderName} send you ${messageType}`;
    const body = bodyNotifi;
    const imageUrl = auth().currentUser?.photoURL;
    const type = 'message';
    // const typeID = typeID;
    const senderID = auth()?.currentUser.uid;
    // const receiverID = receiverID;
    const fcmToken = receiverData?.fcmToken;
    sendSingleNotification(
      senderID,
      receiverID,
      title,
      body,
      imageUrl,
      type,
      typeID,
      fcmToken,
    );
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        {showMediaModal && pickMediaFunction()}
        {recordingModalFunction()}
        <TopChatComponent userData={receiverData} chatID={routeData.chatID} />
        <View style={myStyles.container}>
          <FlatList
            inverted={true}
            data={[...messages].reverse()}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => {
              if (!item.isSeparator) {
                return (
                  <ShowMessagesComponent
                    item={item}
                    startPlaying={() => {
                      startPlaying(item);
                    }}
                    stopPlaying={() => stopPlaying(item)}
                    swipeToReply={swipeToReply}
                    closeReply={closeReply}
                  />
                );
              } else {
                return <ShowDateMessagesCompo date={item.date} />;
              }
            }}
            ItemSeparatorComponent={<View style={{marginVertical: 8}} />}
            // onStartReached={() => console.log('finally end is reach')}
          />
        </View>
        <AddNewMessageCompo
          setNewTextMessage={setNewTextMessage}
          newTextMessage={newTextMessage}
          sendShow={sendShow}
          setSendShow={setSendShow}
          sendMessage={sendMessage}
          pickImage={pickImage}
          setRecordingModal={setRecordingModal}
          captureImage={captureImage}
          replyText={replyText}
          replyUserUid={replyUserUid}
          closeReply={closeReply}
          replyMessageType={replyMessageType}
          receiverName={receiverName}
        />
      </ScreenComponent>
      <MyIndicator
        visible={laoding}
        backgroundColor={theme.loginBackground}
        size={'large'}
      />
    </>
  );

  function pickMediaFunction() {
    return (
      <Modal
        visible={showMediaModal}
        animationType="slide"
        style={{flex: 1}}
        transparent={true}>
        <View style={{flex: 1, backgroundColor: 'rgba(60, 60, 60,0.5)'}}>
          <View style={{padding: 20, alignItems: 'flex-end'}}>
            <TouchableOpacity
              style={myStyles.closeIconContainer}
              onPress={cencelImage}>
              <Image
                source={require('../../assets/close.png')}
                style={myStyles.closeIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={myStyles.imageModalContainer}>
            <View
              style={[
                myStyles.imageVideoContainer,
                {backgroundColor: theme.loginBackground},
              ]}>
              <View style={{alignItems: 'center'}}>
                {selectedMediaType?.startsWith('image') && (
                  <FastImage
                    source={{uri: selectedMedia}}
                    style={myStyles.modalImageStyle}
                  />
                )}
                {selectedMediaType?.startsWith('video') && (
                  <Video
                    style={myStyles.modalImageStyle}
                    source={{uri: selectedMedia}}
                    resizeMode="cover"
                    poster="https://e1.pxfuel.com/desktop-wallpaper/802/816/desktop-wallpaper-black-iphone-7-posted-by-michelle-mercado-black-ios.jpg"
                    posterResizeMode="cover"
                    repeat
                  />
                )}
              </View>
              <View style={myStyles.sendBtnContainer}>
                <TouchableOpacity
                  style={myStyles.sendButton}
                  onPress={() => confirmAndSendMesssage()}>
                  <Text style={myStyles.sendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <MyIndicator
          visible={laoding}
          backgroundColor={theme.loginBackground}
          size={'large'}
        />
      </Modal>
    );
  }

  function recordingModalFunction() {
    return (
      <Modal
        visible={recordingModal}
        animationType="slide"
        transparent={true}
        style={{
          height: '100%',
          width: '100%',
        }}>
        <RecordingComponent
          onPressCancel={() => {
            SoundRecorder.stop()
              .then(function (result) {
                console.log('result', result);
              })
              .catch(function (error) {
                console.log('error', error);
              });
            setIsRecording(false);
            setRecordingModal(false);
          }}
          isRecording={isRecording}
          onPressRecord={() => {
            setIsRecording(true);
            onStartRecord();
          }}
          onPressSend={() => {
            onStopRecord();
            setIsRecording(false);
            setRecordingModal(false);
          }}
        />
      </Modal>
    );
  }
}

const myStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    // backgroundColor: 'hotpink',
  },
  closeIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: colors.LightWhite,
  },
  closeIconContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
    borderRadius: 15,
    marginTop: 40,
  },
  plusIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.gray,
  },
  addMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    height: 60,
    paddingRight: 5,
  },
  plusIconContainer: {
    marginLeft: 10,
    paddingHorizontal: 10,
    width: 30,
    alignItems: 'flex-end',
    height: 30,
    justifyContent: 'center',
  },
  plusIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.gray,
  },
  sendBtnContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 12,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.blue,
    borderRadius: 8,
  },
  sendButtonText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  modalImageStyle: {
    width: '90%',
    height: 220,
    borderRadius: 6,
  },
  imageModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  imageVideoContainer: {
    paddingBottom: 42,
    paddingTop: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});
