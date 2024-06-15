import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import constants from '../constants/constants';

const getAllUsersFcmToken = async () => {
  try {
    const currentUserUid = auth().currentUser.uid;
    const snapshot = await firestore().collection('users').get();
    const tokens = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.fcmToken !== undefined && doc.id !== currentUserUid) {
        if (data.fcmToken) {
          tokens.push({
            fcmToken: data.fcmToken,
            userID: doc.id,
          });
        }
      }
    });

    if (tokens.length > 0) {
      return tokens;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error getting tokens:', error);
    return [];
  }
};

export const sendSingleNotification = async (
  senderID,
  receiverID,
  title,
  body,
  imageUrl,
  type,
  typeID,
  fcmToken,
) => {
  //   const fcmToken = constants.fcmToken;
  //   const fcmToken =
  //     'f1EEx0igRYKZ-byIo_WFFt:APA91bHYDdI8WZdXRofLoFdlOkJ4E6AwVVC8gSRO9R_DGnHxUgAQJ5UICn-BS7vst79sIXbf9KiAGSrCrosTTDprMecUT8GEojEye6wmjPK8GFWsaaCrxgaXAbTv5Ajl9mUMsWyF5B8F';
  const SERVER_KEY =
    'AAAAAm2cTqY:APA91bHIh9neEqDnSsGYaZLD4Fe3sa3eoZ-WlC6f4VLDDZJVs8wogXaw8J4fNWoTWJ_8FLjGyy7pOyMcBko68l7M96K6yxW9BGoLl1-dJSv4jiV389yBFejRguLJ93WQc4KXktPkD3Nm';
  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${SERVER_KEY}`,
      },
      body: JSON.stringify({
        to: fcmToken,
        notification: {
          title: title,
          body: body,
          image: imageUrl,
        },
        data: {
          type: type,
          typeID: typeID,
        },
      }),
    });
    if (response.ok) {
      const notificationRef = firestore().collection('notifications');
      const newNotificationDoc = notificationRef.doc();

      await newNotificationDoc
        .set({
          notificationID: newNotificationDoc.id,
          senderID,
          receiverID,
          title,
          body,
          time: new Date(),
          imageUrl,
          isRead: false,
          type,
          typeID,
        })
        .then(res =>
          console.log(
            'Notification is sent and stored in firestore successfully!',
          ),
        )
        .catch(er =>
          console.log('Error while storing Notification in firestore: ', er),
        );
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const sendNotificationToAll = async (
  title,
  body,
  imageUrl,
  type,
  typeID,
) => {
  try {
    const fcmList = await getAllUsersFcmToken();
    // console.log('the length of tokens is: ', fcmList);
    const currentUserUID = auth().currentUser.uid; // Provide a valid sender ID
    // const title = 'All  Notification is sending';
    // const body = 'All Notification Body';
    // const imageUrl = '';
    // const type = 'Your Notification Type';
    // const typeID = 'Your Class ID';
    for (const {fcmToken, userID} of fcmList) {
      await sendSingleNotification(
        currentUserUID,
        userID,
        title,
        body,
        imageUrl,
        type,
        typeID,
        fcmToken,
      );
    }
  } catch (error) {
    console.log(error);
  }
};
