import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../themes/ThemeContext';
import ScreenComponent from '../components/ScreenComponent';
import colors from '../styles/colors';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerEffectCompo from '../components/ShimmerEffectCompo';

export default function BottomSheetScreen() {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
  const [laoding, setLoading] = useState(false);

  return (
    <ScreenComponent style={{backgroundColor: theme.background}}>
      <TopCompoWithHeading
        title="Bottom Sheet Screen"
        onPress={() => navigation.goBack()}
      />
      <View style={{flex: 1, paddingHorizontal: 20, marginTop: 12}}>
        <ShimmerEffectCompo laoding={laoding} />
      </View>
    </ScreenComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  txt: {
    color: colors.blue,
    fontSize: 20,
    fontWeight: '600',
  },
  btn2: {
    width: '40%',
    height: 30,
    borderRadius: 6,
    marginVertical: 20,
    backgroundColor: colors.purple,
  },
  btn1: {width: '40%', height: 30, borderRadius: 6},
});
