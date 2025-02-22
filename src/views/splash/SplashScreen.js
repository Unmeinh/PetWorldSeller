import React, { useEffect, useState } from 'react';
import { View, BackHandler, Dimensions, Animated, Easing, Text, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import styles from '../../styles/all.style';
import { storageMMKV } from '../../storage/storageMMKV';
import { useNavigation } from '@react-navigation/native';
import { onAxiosPost } from '../../api/axios.function';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import { PermissionsAndroid, Linking } from "react-native";
import LottieAnimation from '../../components/layout/LottieAnimation';
import Toast from 'react-native-toast-message';

export default function SplashScreen() {
  const navigation = useNavigation();
  const logoSize = 150;
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  const bottomPosition = screenHeight * 0.6 - logoSize / 2;
  const bottomPosition1 = screenHeight * 0.33 - logoSize / 2;
  const bottomPosition2 = screenHeight * 0.3 - logoSize / 2;
  const nameBottomPosition = screenHeight * 0.35;

  const nameImageWidth = screenWidth * 0.7;
  const nameImageHeight = (nameImageWidth * logoSize) / logoSize;

  const pawContainerWidth = 25;
  const stepDistance = 3.5;
  const totalSteps = Math.ceil(screenWidth / (pawContainerWidth + stepDistance)); // Tổng số bước chân cần di chuyển

  const stepAnimation = new Animated.Value(0);
  const [pawPositions, setPawPositions] = useState([]);
  const [nameVisible, setNameVisible] = useState(false);
  const [isFinishedOneTime, setisFinishedOneTime] = useState(false);
  const [isGrantedNotice, setisGrantedNotice] = useState('false');
  const [nextScreen, setnextScreen] = useState('');

  useEffect(() => {
    const movePaw = () => {
      Animated.timing(stepAnimation, {
        toValue: totalSteps,
        duration: 150,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setPawPositions([...pawPositions, pawPositions.length]);
        }
      });
    };

    movePaw();
  }, [pawPositions]);

  function onLayoutPaw(event) {
    const { x, y, height, width } = event.nativeEvent.layout;
    if (x >= Dimensions.get('window').width) {
      if (!isFinishedOneTime) {
        setisFinishedOneTime(true);
      }
      stepAnimation.setValue(0);
      setPawPositions([]);
    }
  }

  async function getNavigate() {
    // setnextScreen('Test');
    // return;
    if (storageMMKV.checkKey('login.isFirstTime')) {
      if (!storageMMKV.getBoolean('login.isFirstTime')) {
        if (storageMMKV.checkKey('login.isLogin')) {
          if (storageMMKV.getBoolean('login.isLogin')) {
            if (storageMMKV.checkKey('login.token')) {
              if (storageMMKV.getString('login.token')) {
                setnextScreen('waiting');
                await onCheckTokenDevice()
              } else {
                storageMMKV.setValue('login.token', "");
                setnextScreen('LoginScreen');
              }
            } else {
              storageMMKV.setValue('login.token', "");
              setnextScreen('LoginScreen');
            }
          } else {
            storageMMKV.setValue('login.token', "");
            setnextScreen('LoginScreen');
          }
        } else {
          storageMMKV.setValue('login.token', "");
          setnextScreen('LoginScreen');
        }
      } else {
        storageMMKV.setValue('login.token', "");
        setnextScreen('LoginScreen');
      }
    } else {
      storageMMKV.setValue('login.token', "");
      setnextScreen('LoginScreen');
    }
  }

  const showNameApp = () => {
    setTimeout(() => {
      setNameVisible(true);
    }, 500);
  };

  async function requestPostNotification() {
    let result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    // if (result == 'denied') {
    //   BackHandler.exitApp();
    // }
    setisGrantedNotice(result);
  }

  async function onCheckTokenDevice() {
    if (isGrantedNotice != 'granted') {
      return;
    }
    let token = await messaging().getToken();
    if (token) {
      // await onAxiosPost('shop/updateTokenDevice', {
      //   tokenDevice: token
      // });
      await sendTokenToFirebase(token);
    } else {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Có lỗi xảy ra trong lúc gửi yêu cầu!\nVui lòng thử lại sau!'
      });
    }
  }

  const sendTokenToFirebase = async (newToken) => {
    try {
      if (nextScreen == 'waiting') {
        const databaseRef = database().ref('/sellerTokens');
        const tokenData = {
          token: newToken,
        };
        await databaseRef.push(tokenData);
        storageMMKV.setValue('hasSentToken', true);
        storageMMKV.setValue('tokenDevice', newToken);
        if (storageMMKV.getString('login.token')) {
          let res = await onAxiosPost('shop/autoLogin', {
            tokenDevice: newToken
          }, 'json', true);
          if (res) {
            if (res?.data.isApproved == 1) {
              setnextScreen('NaviTabScreen');
            } else if (res?.data.isApproved == -1) {
              setnextScreen('DeniedShop');
            } else {
              setnextScreen('ConfirmedShop');
            }
          } else {
            storageMMKV.setValue('login.token', "");
            setnextScreen('LoginScreen');
          }
        }
      }
    } catch (error) {
      console.error('Lỗi khi gửi token đến Firebase:', error);
    }
  };

  React.useEffect(() => {
    if (isFinishedOneTime && nextScreen != '' && nextScreen != 'waiting' && isGrantedNotice != 'false') {
      if (isGrantedNotice == 'granted') {
        navigation.replace(nextScreen);
      }
      if (isGrantedNotice == 'denied') {
        Toast.show({
          type: 'alert',
          text1: 'OurPet cần bạn cho phép quyền thông báo để sử dụng ứng dụng.\nCho phép bật quyền thông báo?',
          position: 'top',
          autoHide: false,
          props: {
            confirm: () => { Toast.hide(); setisGrantedNotice('false'); },
            cancel: () => {
              BackHandler.exitApp();
              setTimeout(() => {
                Toast.hide(); setisGrantedNotice('false');
              }, 500);
            }
          }
        });
      }
      if (isGrantedNotice == 'never_ask_again') {
        Toast.show({
          type: 'alert',
          text1: 'OurPet cần bạn cho phép quyền thông báo để sử dụng ứng dụng.\nĐi đến cài đặt để cho phép?',
          position: 'top',
          autoHide: false,
          props: {
            confirm: () => {
              Linking.openSettings();
              setTimeout(() => {
                Toast.hide(); setisGrantedNotice('false');
              }, 500);
            },
            cancel: () => {
              BackHandler.exitApp();
              setTimeout(() => {
                Toast.hide(); setisGrantedNotice('false');
              }, 500);
            }
          }
        });
        // Linking.openSettings();
      }
      if (!storageMMKV.checkKey('login.isFirstTime') || storageMMKV.getBoolean('login.isFirstTime')) {
        storageMMKV.setValue('login.isFirstTime', false);
      }
    }
  }, [isFinishedOneTime, nextScreen, isGrantedNotice]);

  React.useEffect(() => {
    if (isGrantedNotice == 'false') {
      if (Platform.constants['Version'] < 33) {
        setisGrantedNotice('granted');
      } else {
        requestPostNotification();
      }
    }
    async function onDoing() {
      await onCheckTokenDevice();
    }
    onDoing();
  }, [isGrantedNotice]);

  React.useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      getNavigate();
      showNameApp();
      return () => {
        unsub.remove();
      };
    });

    return unsub;
  }, [navigation]);

  return (
    <View style={[styles.container, styles.justifyCenter, styles.itemsCenter]}>
      <LottieAnimation fileJson={require('../../assets/images/jsons/logo.json')}
        isLoop={true} isAutoPlay={true}
        style={{ width: "100%", aspectRatio: 1, marginBottom: '65%' }} />
      {nameVisible && (
        <Animatable.View animation="zoomIn" duration={2000} style={[styles.positionAbsolute, { top: '57%' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* <Text style={{ fontSize: 45, color: '#001858', fontWeight: '500' }}>PETW</Text> */}
            <View style={{ borderRadius: 50, borderColor: '#001858', borderWidth: 3, width: 50, height: 50, alignItems: 'center', padding: 5 }}>
              <View style={{ width: 40, height: 45 }}>
                <FontAwesome6 name='dog' size={35} color={'#001858'}
                  style={{}} />
                <FontAwesome6 name='cat' size={20} color={'#8BD3DD'}
                  style={{ position: 'absolute', bottom: 10, left: 6 }} />
              </View>
            </View>
            <Text style={{ fontSize: 45, color: '#001858', fontWeight: '500' }}>URPET</Text>
            <Text style={{
              fontSize: 25, color: '#001858',
              position: 'absolute',
              right: '-7.3%', bottom: -17
            }}>Seller</Text>
          </View>
        </Animatable.View>
      )}
      {pawPositions.map((position, index) => (
        <View onLayout={onLayoutPaw} key={position} style={[styles.positionAbsolute, { left: position * (pawContainerWidth + stepDistance), bottom: 0 }]}>
          <Foundation name='paw' size={25} color={"#000"} style={{
            bottom: index % 2 === 0 ? bottomPosition1 : bottomPosition2,
            height: 25,
            width: 25,
            transform: [{ rotate: '90deg' }],
          }} />
        </View>
      ))}
    </View>
  );
}
