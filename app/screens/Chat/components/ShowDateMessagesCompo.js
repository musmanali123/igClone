import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';
import moment from 'moment';
import {useTheme} from '../../../themes/ThemeContext';

const ShowDateMessagesCompo = ({date}) => {
  var dateOfMsg = '';
  const today = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthName = monthNames[month];
  const currentYear = today.getFullYear();
  if (currentYear === year) {
    dateOfMsg = `${day} ${monthName}`;
  } else {
    dateOfMsg = `${day} ${monthName} ${year}`;
  }

  if (today.toDateString() === date.toDateString()) {
    dateOfMsg = 'Today';
  }
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (yesterday.toDateString() === date.toDateString()) {
    dateOfMsg = 'Yesterday';
  }
  const {theme} = useTheme();

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.messageDateStyle, {color: theme.gray}]}>
        {dateOfMsg}, {formatAMPM(date)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  messageDateStyle: {
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 12,
    color: colors.gray,
    fontSize: 12,
  },
});

export default ShowDateMessagesCompo;
