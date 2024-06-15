import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import colors from '../../../styles/colors';
import auth from '@react-native-firebase/auth';
import SoundPlayer from 'react-native-sound-player';
import BackgroundTimer from 'react-native-background-timer';
import * as Progress from 'react-native-progress';
import Video from 'react-native-video';
import RNFetchBlob from 'rn-fetch-blob';

import {
  GestureHandlerRootView,
  FlingGestureHandler,
  Directions,
  State,
} from 'react-native-gesture-handler';
import Animated, {
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  event,
} from 'react-native-reanimated';
import ShowReplyMessageCompo from './ShowReplyMessageCompo';
import ScreenComponent from '../../../components/ScreenComponent';
import {useTheme} from '../../../themes/ThemeContext';
import DownloadMediaCompo from './DownloadMediaCompo';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../../navigation/navigationStrings';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ShowMessagesComponent = ({
  item,
  startPlaying,
  stopPlaying,
  swipeToReply,
  closeReply,
}) => {
  const senderId = auth().currentUser.uid;
  // const formatedTime1 = item.time?.getHours() + ':' + item.time?.getMinutes();
  var hours = item.time?.getHours();
  hours = ('0' + hours).slice(-2);
  var minutes = item.time?.getMinutes();
  minutes = ('0' + minutes).slice(-2);

  const formatedTime = hours + '.' + minutes;
  const [currentPlaying, setCurrentPlaying] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(true);
  const [pauseVideo, setPauseVideo] = useState(true);
  const [showFullImage, setShowFullImage] = useState(false);
  const [senderImageUrl, setSenderImageUrl] = useState('');
  const navigation = useNavigation();
  const {theme} = useTheme();
  var isMounted = false;

  const getInfo = async () => {
    const info = await SoundPlayer.getInfo();
    // console.log('info of voice: ', info);
    if (info.duration !== undefined) {
      // setTotalDuration(Math.ceil(info.duration));
      // console.log('voice time duration is: ', Math.ceil(info.duration));
    }
    if (info.currentTime !== undefined) {
      if (info.currentTime !== 0) {
        setIsAudioLoading(false);
      }
      var tim = Math.ceil(info.currentTime);
      var tot = Math.ceil(info.duration);
      // var tim = info.currentTime;
      // var tot = info.duration;
      var final = tim / tot;
      setCurrentPlaying(final);
    }
  };

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return seconds == 60
      ? minutes + 1 + ':00'
      : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  var _onFinishedPlayingSubscription = null;
  var _onFinishedLoadingURLSubscription = null;
  const startTimer = () => {
    BackgroundTimer.stopBackgroundTimer();
    try {
      SoundPlayer.playUrl(item.message);
      BackgroundTimer.runBackgroundTimer(() => {
        getInfo();
        _onFinishedPlayingSubscription = SoundPlayer.addEventListener(
          'FinishedPlaying',
          ({success}) => {
            setCurrentPlaying(1);
            stopPlaying();
            BackgroundTimer.stopBackgroundTimer();
          },
          'FinishedLoading',
          ({success}) => {},
          'FinishedLoadingURL',
          ({success}) => {},
        );
      }, 1000);
    } catch (e) {
      Alert.alert('Error', 'Cannot play the file');
      console.log(`cannot play the sound file`, e);
    }
  };
  let startingPosition = 0;
  const x = useSharedValue(startingPosition);

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {},
    onActive: (event, ctx) => {
      // x.value = item.senderID === senderId ? 50 : -50;
      x.value = 50;
    },
    onEnd: (event, ctx) => {
      x.value = withSpring(startingPosition);
    },
  });

  // const eventHandler = () => {
  //   console.log('event handler is called');
  // };

  const useAmiStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: x.value}],
    };
  });

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(item.senderID)
      .onSnapshot(snap => {
        if (snap.exists) {
          var data = snap.data();
          setSenderImageUrl(data.imageUrl);
        }
      });
    return () => unsubscribe();
  }, []);

  const profileNavigationHandler = uid => {
    if (uid === senderId) {
      return null;
    } else {
      navigation.navigate(navigationStrings.USER_PROFILE, {
        userUid: uid,
      });
    }
  };

  const deleteMessageHandler = async () => {
    try {
      if (item?.chatID !== undefined) {
        await firestore()
          .collection('chats')
          .doc(item?.chatID)
          .collection('messages')
          .doc(item?._id)
          .delete();
      } else if (item?.groupId !== undefined) {
        await firestore()
          .collection('chats')
          .doc(item?.groupId)
          .collection('messages')
          .doc(item?._id)
          .delete();
      } else {
        return null;
      }
    } catch (error) {
      console.log(
        'Error while deleting message in Show Mwssages component: ',
        error,
      );
    }
  };

  const handleDeleteMessage = () => {
    try {
      if (item?.senderID === auth().currentUser?.uid) {
        Alert.alert('Warning', 'Are you sure to Delete this Message!', [
          {
            text: 'Yes',
            onPress: deleteMessageHandler,
          },
          {
            text: 'No',
          },
        ]);
      } else {
        return null;
      }
    } catch (error) {
      console.log('Error while deleting message in chat screen: ', error);
    }
  };

  return (
    <>
      <GestureHandlerRootView>
        <FlingGestureHandler
          direction={Directions.RIGHT}
          onGestureEvent={eventHandler}
          onHandlerStateChange={({nativeEvent}) => {
            if (nativeEvent.state === State.ACTIVE) {
              swipeToReply(item);
            }
          }}>
          <Animated.View
            style={[
              {
                alignItems:
                  item.senderID === senderId ? 'flex-end' : 'flex-start',
              },
              useAmiStyle,
            ]}>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              activeOpacity={0.8}
              onLongPress={() => handleDeleteMessage()}>
              {item.senderID !== senderId &&
                item.groupId !== undefined &&
                item.groupId !== null &&
                item.groupId !== '' && (
                  <TouchableOpacity
                    onPress={() => profileNavigationHandler(item.senderID)}>
                    <FastImage
                      source={{
                        uri:
                          senderImageUrl !== ''
                            ? senderImageUrl
                            : 'https://www.shareicon.net/data/512x512/2015/09/18/103160_man_512x512.png',
                      }}
                      style={styles.userProfileImage}
                    />
                  </TouchableOpacity>
                )}
              {item.type == 'image' ? (
                <>
                  <TouchableOpacity
                    onPress={() => setShowFullImage(true)}
                    onLongPress={() => handleDeleteMessage()}>
                    <FastImage
                      source={{uri: item.message}}
                      style={[styles.imageStyle]}
                    />
                  </TouchableOpacity>
                </>
              ) : null}
              {item.type == 'video' && item.message ? (
                <>
                  <TouchableOpacity
                    onPress={() => setShowFullImage(true)}
                    onLongPress={() => handleDeleteMessage()}>
                    {!!item?.message && (
                      <Video
                        style={[styles.imageStyle]}
                        source={{uri: item?.message}}
                        resizeMode="cover"
                        poster="https://e1.pxfuel.com/desktop-wallpaper/802/816/desktop-wallpaper-black-iphone-7-posted-by-michelle-mercado-black-ios.jpg"
                        posterResizeMode="cover"
                        repeat
                        paused={pauseVideo}
                      />
                    )}
                    <View style={styles.videoPlayBtnWrapepr}>
                      <TouchableOpacity
                        style={styles.videoPlayBtnIconContainer}
                        onPress={() => setPauseVideo(!pauseVideo)}>
                        <Image
                          source={
                            pauseVideo
                              ? require('../../../assets/ic_play.png')
                              : require('../../../assets/pause-button.png')
                          }
                          style={styles.videoPlayBtnIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </>
              ) : null}
              {item.type !== 'image' && item.type !== 'video' && (
                <View
                  style={[
                    styles.container,
                    {
                      backgroundColor:
                        item.senderID === senderId
                          ? item.type == 'text'
                            ? colors.purple
                            : colors.purple
                          : theme.chatTextInputBg,
                      maxWidth: screenWidth / 2.5,
                      minWidth: screenWidth / 3,
                      borderBottomLeftRadius:
                        item.senderID === senderId ? 12 : 0,
                      borderBottomRightRadius:
                        item.senderID === senderId ? 0 : 12,
                    },
                  ]}>
                  {item.replyId !== undefined ? (
                    <ShowReplyMessageCompo
                      senderId={senderId}
                      messageSender={item.senderID}
                      chatId={item.chatID}
                      replyId={item.replyId}
                    />
                  ) : null}

                  {item.type == 'file' ? (
                    <TouchableOpacity
                      onPress={() => {
                        let properUrl = item.message;

                        if (!/^https?:\/\//i.test(item.message)) {
                          properUrl = `http://${item.message}`;
                        }

                        Linking.openURL(properUrl).catch(error => {
                          console.log(error);
                        });
                      }}
                      style={{
                        flexDirection: 'row',
                        paddingRight: 10,
                      }}>
                      <Image
                        source={require('../../../assets/ic_document.png')}
                        style={[
                          styles.iconDocument,
                          {
                            tintColor:
                              item.senderID === senderId
                                ? colors.offWhite
                                : colors.black,
                          },
                        ]}
                      />

                      {item.extraText !== '' ? (
                        <Text
                          style={[
                            styles.chatTextStyle,
                            {
                              color:
                                item.senderID === senderId
                                  ? colors.white
                                  : colors.black,
                              marginLeft: 6,
                            },
                          ]}>
                          {item.extraText}
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  ) : null}

                  {item.type == 'text' ? (
                    <Text
                      style={[
                        styles.chatTextStyle,
                        {
                          color:
                            item.senderID === senderId
                              ? colors.white
                              : theme.text,
                        },
                      ]}>
                      {item.message}
                    </Text>
                  ) : null}
                  {item.type === 'audio' ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: screenWidth / 3,
                      }}>
                      {item.isPlaying === false ? (
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <TouchableOpacity
                            onPress={() => {
                              setIsAudioLoading(true);
                              startTimer();
                              startPlaying();
                            }}>
                            <Image
                              source={require('../../../assets/ic_play.png')}
                              style={{
                                height: 16,
                                width: 16,
                                //   alignSelf: 'center',
                                resizeMode: 'contain',
                                tintColor:
                                  item.senderID === senderId
                                    ? colors.white
                                    : theme.text,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : isAudioLoading ? (
                        <Progress.Circle
                          size={18}
                          indeterminate={true}
                          color={
                            item.senderID === senderId
                              ? colors.white
                              : colors.black
                          }
                        />
                      ) : (
                        // <Text>loading</Text>
                        <TouchableOpacity
                          onPress={() => {
                            stopPlaying();
                            BackgroundTimer.stopBackgroundTimer();
                          }}>
                          <Image
                            source={require('../../../assets/pause-button.png')}
                            style={{
                              height: 20,
                              width: 20,
                              alignSelf: 'center',
                              tintColor:
                                item.senderID === senderId
                                  ? colors.white
                                  : theme.text,
                            }}
                          />
                        </TouchableOpacity>
                      )}
                      {item.isPlaying === false ? (
                        <>
                          <Image
                            source={require('../../../assets/ic_sound.png')}
                            style={[
                              styles.soundImgStyle,
                              {
                                tintColor:
                                  item.senderID === senderId
                                    ? colors.white
                                    : theme.text,
                                marginLeft: 6,
                              },
                            ]}
                          />
                        </>
                      ) : (
                        <View style={{height: 20, justifyContent: 'center'}}>
                          <Progress.Bar
                            progress={currentPlaying}
                            width={screenWidth / 6}
                            height={4}
                            color={colors.darkBlue}
                            borderColor={
                              item.senderID === senderId
                                ? colors.white
                                : colors.black
                            }
                            unfilledColor={colors.white}
                            style={{
                              alignSelf: 'center',
                              // width: screenWidth / 5,
                              marginLeft: 4,
                            }}
                          />
                        </View>
                        // <Text>progress bar {currentPlaying}</Text>
                      )}
                      {item.extraText !== '' ? (
                        <Text
                          style={{
                            color:
                              item.senderID === senderId
                                ? colors.white
                                : theme.text,
                            marginLeft: 4,
                          }}>
                          {millisToMinutesAndSeconds(item.extraText)}
                        </Text>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        </FlingGestureHandler>
      </GestureHandlerRootView>
      {showImageFunction()}
    </>
  );

  function showImageFunction() {
    return (
      <Modal visible={showFullImage} animationType="slide" transparent={true}>
        <ScreenComponent style={{backgroundColor: theme.loginBackground}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {item.type == 'image' && (
              <FastImage
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: theme.loginBackground,
                }}
                source={{uri: item.message}}
                resizeMode="contain"
              />
            )}
            {item.type == 'video' && item.message && (
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: theme.loginBackground,
                }}
                onPress={() => setPauseVideo(!pauseVideo)}>
                <Video
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: theme.loginBackground,
                  }}
                  source={{uri: item?.message}}
                  resizeMode="contain"
                  repeat
                  paused={pauseVideo}
                />
                <View style={styles.videoPlayBtnWrapepr}>
                  <TouchableOpacity
                    style={styles.videoPlayBtnIconContainer}
                    onPress={() => setPauseVideo(!pauseVideo)}>
                    <Image
                      source={
                        pauseVideo
                          ? require('../../../assets/ic_play.png')
                          : require('../../../assets/pause-button.png')
                      }
                      style={styles.videoPlayBtnIcon}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setShowFullImage(false);
              }}
              style={styles.closeIconContainer}>
              <Image
                source={require('../../../assets/close.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
            <DownloadMediaCompo url={item.message} mediaType={item.type} />
          </View>
        </ScreenComponent>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  chatTextStyle: {
    fontSize: 14,
    color: colors.black,
    fontFamily: 'UberMove-Medium',
  },
  chatTimeText: {
    fontSize: 10,
    color: colors.black,
    fontFamily: 'UberMove-Regular',
  },
  container: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  imageStyle: {
    width: screenWidth / 2 - 30,
    height: screenHeight * 0.2,
    borderRadius: 18,
  },
  soundImgStyle: {
    // width: 30,
    width: screenWidth / 8,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.white,
    // backgroundColor: 'red',
  },
  playiconstyle: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  voiceMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkBlue,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  voiceDurationText: {
    fontSize: 12,
    color: colors.white,
    marginHorizontal: 8,
    fontFamily: 'UberMove-Medium',
  },
  iconDocument: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  videoPlayBtnIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: 'snow',
  },
  videoPlayBtnIconContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 34,
    height: 34,
    borderRadius: 34 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlayBtnWrapepr: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIconContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
  },
  closeIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  userProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default ShowMessagesComponent;
