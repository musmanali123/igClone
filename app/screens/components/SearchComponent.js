import {View, Text} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MyIndicator from '../../components/MyIndicator';
import {useNavigation} from '@react-navigation/native';
import SearchStyle from '../style/SearchStyle';
import {useTheme} from '../../themes/ThemeContext';

const SearchComponent = () => {
  const {theme} = useTheme();
  const styles = SearchStyle(theme);
  const [laoding, setLoading] = useState(false);
  const navigation = useNavigation();
  return (
    <>
      <View>
        <Text>ksjdfklj</Text>
      </View>
      <MyIndicator
        visible={laoding}
        backgroundColor={theme.loginBackground}
        size={'large'}
      />
    </>
  );
};

export default SearchComponent;
