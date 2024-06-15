import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    color: colors.black,
    fontFamily: fontFamily.semiBold,
    marginBottom: 18,
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.red,
    marginTop: 6,
    paddingLeft: 6,
    fontFamily: fontFamily.medium,
  },
  descText: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 14,
    fontFamily: fontFamily.medium,
  },
});

export default styles;
