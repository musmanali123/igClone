import notifee, {AndroidImportance, AndroidStyle} from '@notifee/react-native';
import {Platform} from 'react-native';

export async function onDisplayNotificationNotifee(data) {
  // Request permissions (required for iOS)
  if (Platform.OS === 'ios') {
    await notifee.requestPermission();
  }

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default7',
    name: 'Default Channel 7',
    sound: 'default',
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  await notifee.displayNotification({
    title: data?.title,
    body: data?.body,
    android: {
      channelId,
      smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
      style: {
        type: AndroidStyle.BIGPICTURE,
        picture: data?.android?.imageUrl || '',
      },
    },
  });
}
