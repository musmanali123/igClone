import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import colors from '../../styles/colors';
import ButtonComponent from './components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import fontFamily from '../../styles/fontFamily';

export default function SuccessfullyCreateAccountScreen() {
  const navigation = useNavigation();
  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.bg}}>
        <View style={{flex: 0.14}} />
        <View style={styles.container}>
          <Image
            source={require('../../assets/success.jpg')}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.heading}>Account is Created Successfully!</Text>
            <Text style={styles.decText}>
              Verification Link is send to your email please verify first before
              Login.
            </Text>
          </View>
          <View style={{paddingHorizontal: 24, marginTop: 8}}>
            <ButtonComponent
              title="Login"
              onPress={() =>
                navigation.navigate(navigationStrings.LOGIN_SCREEN)
              }
            />
          </View>
        </View>
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 30,
    paddingHorizontal: 26,
  },
  heading: {
    fontSize: 18,
    color: colors.black,
    fontFamily: fontFamily.semiBold,
  },
  decText: {
    fontSize: 14,
    color: colors.lightBlack,
    fontFamily: fontFamily.medium,
    textAlign: 'center',
    marginTop: 8,
  },
});
