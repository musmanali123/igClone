import {StyleSheet, Dimensions, Platform} from 'react-native';
import fontFamily from '../../styles/fontFamily';
import colors from '../../styles/colors';

const SearchStyle = theme => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    imageStyle: {
      width: '100%',
      height: '100%',
    },
    imagesContainer: {
      width: screenWidth / 3,
      height: 50,
    },
  });
  return styles;
};

export default SearchStyle;
