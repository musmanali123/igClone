import React from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const signInWithGoogle = async () => {
  try {
    GoogleSignin.configure({
      offlineAccess: true,
      webClientId:
        '10428894886-8td5vg45o4vnqk396ju99oveoa21a8ti.apps.googleusercontent.com',
    });
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const {idToken} = userInfo;
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    await auth()
      .signInWithCredential(googleCredential)
      .then()
      .catch(err => console.log('-> error', err));
    return userInfo;
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      console.log('error SIGN_IN_CANCELLED in google signIn: ', error.code);
      return null;
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
      console.log('error IN_PROGRESS in google signIn: ', error.code);
      return null;
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
      console.log(
        'error PLAY_SERVICES_NOT_AVAILABLE in google signIn: ',
        error.code,
      );
      return null;
    } else {
      // some other error happened
      console.log('Error while in signIn with Google: ', error);
      return null;
    }
  }
};

const isUserAlreadyExisted = async () => {
  const userUID = auth().currentUser?.uid;

  try {
    const userDoc = await firestore().collection('users').doc(userUID).get();
    return userDoc.exists;
  } catch (error) {
    // Handle any errors that occurred during the query
    console.error('Error checking user existence:', error);
    return false; // Assuming that if there's an error, the user does not exist
  }
};

const addGoogleSignInToFireStore = async (userName, userEmail, userImage) => {
  try {
    const checkUserAlreadyExisted = await isUserAlreadyExisted();
    if (checkUserAlreadyExisted) {
      // await auth().currentUser.updateProfile({
      //   displayName: userName,
      //   photoURL: userImage,
      // });
      return null;
    } else {
      await auth().currentUser.updateProfile({
        displayName: userName,
        photoURL: userImage,
      });
      await firestore().collection('users').doc(auth().currentUser?.uid).set({
        fullName: userName,
        email: userEmail,
        dateOfBirth: null,
        imageUrl: userImage,
        bio: '',
        website: '',
        gender: '',
        followers: [],
        following: [],
        dateOfJoin: new Date(),
        savedPosts: [],
        searchPeople: [],
      });
    }
  } catch (error) {
    console.log(
      'Error while storing data of user in firestore in Google SignIN: ',
      error,
    );
  }
};

export const handleGoogleSignIn = async () => {
  try {
    const res = await signInWithGoogle();
    if (!!res) {
      let userName = res?.user?.name;
      let userEmail = res?.user?.email;
      let userImage = res?.user?.photo;
      if (auth()?.currentUser) {
        await addGoogleSignInToFireStore(userName, userEmail, userImage);
        return true;
      } else {
        console.log('User is not authenticated.');
        return false;
      }
    }
    // console.log('Result after SignIn with Google: ', res.user.name);
  } catch (error) {
    console.log('Error in handle-Google-SignIn: ', error);
  }
};
