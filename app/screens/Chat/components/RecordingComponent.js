import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';

export default function RecordingComponent({
  onPressCancel,
  isRecording,
  onPressRecord,
  onPressSend,
}) {
  return (
    <>
      <TouchableOpacity
        onPress={onPressCancel}
        style={{
          flex: 1,
          backgroundColor: colors.black,
          opacity: 0.5,
        }}
      />
      <View
        style={{
          justifyContent: 'center',
          backgroundColor: 'white',
          width: '100%',
          position: 'absolute',
          bottom: 0,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          minHeight: 150,
          paddingBottom: 30,
        }}>
        <TouchableOpacity
          onPress={onPressCancel}
          style={{
            marginStart: 20,
            marginTop: 20,
            marginEnd: 20,
            marginBottom: 20,
          }}>
          <Image
            source={require('../../../assets/close.png')}
            style={{height: 20, width: 20, alignSelf: 'flex-end'}}
          />
        </TouchableOpacity>
        {isRecording === true ? (
          <View
            style={{
              justifyContent: 'space-between',
              marginStart: 20,
              marginEnd: 20,
            }}>
            <View style={styles.container}>
              <Text
                style={{
                  color: colors.blue,
                  marginTop: 15,
                  alignSelf: 'center',
                  fontSize: 20,
                  fontWeight: '500',
                }}>
                Recording
              </Text>
            </View>
            <TouchableOpacity
              onPress={onPressSend}
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                backgroundColor: colors.blue,
                padding: 10,
                height: 50,
                borderRadius: 30,
                width: '100%',
                // zIndex: 1,
              }}>
              <Text style={{color: colors.white, alignSelf: 'center'}}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginStart: 20,
              marginEnd: 20,
            }}>
            <TouchableOpacity
              onPress={onPressCancel}
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                backgroundColor: colors.white,
                padding: 10,
                flex: 1,
                height: 50,
                borderRadius: 30,
                borderWidth: 1,
                borderColor: colors.darkBlue,
                marginEnd: 10,
              }}>
              <Text style={{color: colors.darkBlue, alignSelf: 'center'}}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPressRecord}
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                backgroundColor: colors.black,
                padding: 10,
                flex: 1,
                height: 50,
                borderRadius: 30,
                marginStart: 10,
              }}>
              <Text style={{color: colors.white, alignSelf: 'center'}}>
                Start recording
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  icon: {height: 30, width: 30, tintColor: colors.white, alignSelf: 'center'},
  iconContainer: {
    padding: 10,
    backgroundColor: colors.darkBlue,
    borderRadius: 30,
    marginVertical: 10,
    height: 60,
    width: 60,
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: 20,
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  animation: {
    height: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    color: colors.darkBlue,
    flex: 1,
  },
});
