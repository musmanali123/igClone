import React, {useEffect} from 'react';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import navigationStrings from '../navigation/navigationStrings';
import NavigationService from '../navigation/NavigationService';

const DeepLinkHandler = () => {
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        handleDynamicLinkKillMode(link);
      });
    const linkingListener = dynamicLinks().onLink(handleDynamicLink);
    return () => {
      linkingListener();
    };
  }, []);

  const extractParamsFromDeepLink = deepLink => {
    try {
      const match = deepLink.match(/type=([^&]+)&id=([^&]+)/);
      if (match) {
        const type = match[1];
        const id = match[2];
        return {type, id};
      } else {
        console.log('No match found in deep link');
        return {};
      }
    } catch (error) {
      console.log('Error extracting parameters from deep link:', error);
      return {};
    }
  };

  const handleDynamicLink = link => {
    if (link?.url) {
      let url = link.url;
      const params = extractParamsFromDeepLink(url);
      if (params.type === 'post') {
        // console.log('Post is detected');
        NavigationService.navigate('MainTabRoutes');
      } else if (params.type === 'userProfile') {
        // console.log('User Profile Deep link is detected');
        NavigationService.navigate(navigationStrings.USER_PROFILE, {
          userUid: params.id,
        });
      } else {
        console.log('Deep Link is not matched!');
      }
    }
  };

  const handleDynamicLinkKillMode = link => {
    if (link?.url) {
      let url = link.url;
      const params = extractParamsFromDeepLink(url);
      //   console.log('Params data is: ', params);
      if (params.type === 'post') {
        // console.log('Post is detected');
        setTimeout(() => {
          NavigationService.navigate('MainTabRoutes');
        }, 2000);
      } else if (params.type === 'userProfile') {
        // console.log('User Profile Deep link is detected');
        setTimeout(() => {
          NavigationService.navigate(navigationStrings.USER_PROFILE, {
            userUid: params.id,
          });
        }, 2000);
      } else {
        console.log('Deep Link is not matched!');
      }
    }
  };

  return null;
};

export default DeepLinkHandler;
