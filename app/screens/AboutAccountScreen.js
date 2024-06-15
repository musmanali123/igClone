import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import {useTheme} from '../themes/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import MyIndicator from '../components/MyIndicator';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import FastImage from 'react-native-fast-image';
import fontFamily from '../styles/fontFamily';
import LinearGradient from 'react-native-linear-gradient';

export default function AboutAccountScreen({route}) {
  const userUid = route.params?.userUid;
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [userImageUrl, setUserImageUrl] = useState('');
  const [userDateOfJoin, setUserDateOfJoin] = useState(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(userUid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          var doc = documentSnapshot.data();
          setUserImageUrl(doc.imageUrl);
          setUserName(doc.fullName);
          setUserDateOfJoin(doc.dateOfJoin);
        }
      });
    return () => unsubscribe();
  }, []);

  function handleFormateDate(userDateOfJoin) {
    const month_names = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const creationDate = userDateOfJoin.toDate();
    const year = creationDate.getFullYear();
    const month = creationDate.getMonth();
    const finalMonthName = month_names[month];
    return `${finalMonthName} ${year}`;
  }

  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <LinearGradient
          style={{flex: 1}}
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.2)']}
          start={{x: 0.2, y: 0.4}}
          end={{x: 1, y: 0.8}}>
          <TopCompoWithHeading
            title={
              userUid === auth().currentUser?.uid
                ? 'About your account'
                : 'About this account'
            }
            onPress={() => navigation.goBack()}
          />
          <View style={{alignItems: 'center', marginTop: 14, marginBottom: 12}}>
            <FastImage source={{uri: userImageUrl}} style={styles.image} />
            <Text style={[styles.userNameStyle, {color: theme.text}]}>
              {userName}
            </Text>
            <Text style={[styles.desc, {color: theme.gray}]}>
              To help keep our community authentic, we're showing infomation
              about accounts on instagram.
              <Text style={{color: theme.lightText}}>
                {' '}
                See why this information is important.
              </Text>
            </Text>
          </View>
          <View style={{paddingHorizontal: 6}}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../assets/ic_datepicker.png')}
                style={[styles.iconStyle, {tintColor: theme.lightText}]}
              />
              <View style={{marginLeft: 12}}>
                <Text style={[styles.txt, {color: theme.lightText}]}>
                  Date Joined
                </Text>
                <Text style={[styles.descTxt, {color: theme.gray}]}>
                  {userDateOfJoin !== null && handleFormateDate(userDateOfJoin)}
                </Text>
              </View>
            </View>
            {userUid !== auth().currentUser?.uid && (
              <View style={{flexDirection: 'row', marginTop: 16}}>
                <Image
                  source={require('../assets/location.png')}
                  style={[styles.iconStyle, {tintColor: theme.lightText}]}
                />

                <View style={{marginLeft: 12}}>
                  <Text style={[styles.txt, {color: theme.lightText}]}>
                    Account based in
                  </Text>
                  <Text style={[styles.descTxt, {color: theme.gray}]}>
                    unkown
                  </Text>
                </View>
              </View>
            )}
          </View>
        </LinearGradient>
      </ScreenComponent>
      <MyIndicator />
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userNameStyle: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    marginVertical: 10,
  },
  desc: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    textAlign: 'center',
    width: '80%',
  },
  iconStyle: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  txt: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },
  descTxt: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
  },
});
