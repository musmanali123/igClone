import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import React, {useRef, useEffect, useLayoutEffect, useMemo} from 'react';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useTheme} from '../themes/ThemeContext';
import ButtonComponent from '../screens/CreateAccount/components/ButtonComponent';
import CommentsComponent from './CommentsComponent';

const BottomSheetComponent = ({
  setOpenModal,
  showComment,
  setShowComment,
  postId,
  switchToScreen,
}) => {
  const bottomSheetModalRef = useRef(null);
  const {theme} = useTheme();
  //   const snapPoints = ['96%', '100%'];

  //   const snapPoints = ['96%', '40%', '100%'];
  const snapPoints = ['20%', '40%', '90%', '96%'];
  //   const snapPoints = useMemo(() => ['25%', '50%'], []);

  useLayoutEffect(() => {
    handleOpenModal();
  }, []);

  const handleOpenModal = () => {
    bottomSheetModalRef.current?.present();
  };

  const closeModalHandler = () => {
    Keyboard.dismiss();
    setOpenModal(false);
    // console.log('Moda is closed!');
  };

  const handleClosePress = () => {
    bottomSheetModalRef.current?.close();
    setOpenModal(false);
  };

  const onChangeModal = index => {
    if (index == 0 || index == 1) {
      Keyboard.dismiss();
    }
  };

  return (
    // <GestureHandlerRootView style={{flex: 1}}>
    <BottomSheetModalProvider>
      <View style={[styles.container]}>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={2}
          snapPoints={snapPoints}
          backgroundStyle={{
            borderRadius: 22,
            backgroundColor: theme.commentBg,
          }}
          //   handleStyle={{backgroundColor: theme.loginBackground}}
          handleIndicatorStyle={{backgroundColor: theme.gray, width: 56}}
          onDismiss={() => closeModalHandler()}
          onChange={onChangeModal}
          adjustToContentHeight // Add this
          keyboardBehavior="interactive" // Add this
        >
          <View style={{flex: 1, backgroundColor: theme.commentBg}}>
            {/* <Text>Hello</Text>
            <ButtonComponent title="Close" onPress={() => handleClosePress()} /> */}
            {/* <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{flex: 1, backgroundColor: theme.commentBg}}> */}
            <CommentsComponent
              showComment={showComment}
              setShowComment={setShowComment}
              postId={postId}
              switchToScreen={switchToScreen}
            />
            {/* </KeyboardAvoidingView> */}
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
    // </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-end',

    // alignItems: 'center',
    // justifyContent: 'center',
    // opacity: 0.2,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  containerHeadline: {
    fontSize: 24,
    fontWeight: '600',
    padding: 20,
    color: 'black',
  },
});

export default BottomSheetComponent;
