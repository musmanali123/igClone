import dynamicLinks from '@react-native-firebase/dynamic-links';
import {Share} from 'react-native';

export const generateDeepLink = async (type, id) => {
  try {
    const link = await dynamicLinks().buildShortLink(
      {
        link: `https://instaclonedeeplink.page.link/mVFa?type=${type}&id=${id}`,
        domainUriPrefix: 'https://instaclonedeeplink.page.link',
        android: {
          packageName: 'com.rahaalapp',
        },
      },
      dynamicLinks.ShortLinkType.DEFAULT,
    );
    return link;
  } catch (error) {
    console.log(
      'Error while generating deep link in Show Posts Component: ',
      error,
    );
  }
};

export const shareLink = async (type, id) => {
  const getLink = await generateDeepLink(type, id);
  try {
    Share.share({
      message: getLink,
    });
  } catch (error) {
    console.log(
      'Error while share link of app in Show Posts Component: ',
      error,
    );
  }
};
