import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
import ScreenComponent from '../../components/ScreenComponent';
import {useTheme} from '../../themes/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import ButtonComponent from '../CreateAccount/components/ButtonComponent';
import MyIndicator from '../../components/MyIndicator';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import navigationStrings from '../../navigation/navigationStrings';
import EditPostStyle from '../style/EditPostStyle';

export default function EditPostScreen() {
  const {theme} = useTheme();
  const styles = EditPostStyle(theme);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  return (
    <>
      <ScreenComponent style={{backgroundColor: theme.background}}>
        <View>
          <Text>Edit Post Screen</Text>
        </View>
      </ScreenComponent>
    </>
  );
}
