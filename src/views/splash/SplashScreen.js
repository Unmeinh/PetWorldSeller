import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Animated, Easing, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import styles from '../../styles/all.style';
import { storageMMKV } from '../../storage/storageMMKV';
import { useNavigation } from '@react-navigation/native';
import { onAxiosGet } from '../../api/axios.function';
import { onNavigate } from '../../navigation/rootNavigation';

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
  const [logoVisible, setLogoVisible] = useState(true);
  const [nameVisible, setNameVisible] = useState(false);
  const [isFinishedOneTime, setisFinishedOneTime] = useState(false);
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

    const hideLogo = () => {
      setTimeout(() => {
        setLogoVisible(false);
        showName();
      }, 2000);
    };

    const showName = () => {
      setTimeout(() => {
        setNameVisible(true);
      }, 300);
    };

    movePaw();
    hideLogo();
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
    if (storageMMKV.checkKey('login.isFirstTime')) {
      if (!storageMMKV.getBoolean('login.isFirstTime')) {
        if (storageMMKV.checkKey('login.isLogin')) {
          if (storageMMKV.getBoolean('login.isLogin')) {
            if (storageMMKV.checkKey('login.token')) {
              if (storageMMKV.getString('login.token')) {
                let res = await onAxiosGet('/shop/autoLogin')
                if (res) {
                  if (res.data == 1) {
                    setnextScreen('NaviTabScreen');
                  } else {
                    setnextScreen('ConfirmedShop');
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
      } else {
        storageMMKV.setValue('login.token', "");
        setnextScreen('LoginScreen');
      }
    } else {
      storageMMKV.setValue('login.token', "");
      setnextScreen('LoginScreen');
    }
  }

  React.useEffect(() => {
    if (isFinishedOneTime && nextScreen != '') {
      onNavigate(nextScreen);
      storageMMKV.setValue('login.isFirstTime', false);
    }
  }, [isFinishedOneTime, nextScreen]);

  React.useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      getNavigate();
      return () => {
        unsub.remove();
      };
    });

    return unsub;
  }, [navigation]);

  return (
    <View style={[styles.container, styles.justifyCenter, styles.itemsCenter]}>
      {logoVisible && (
        <Animatable.Image
          animation={{
            from: { scale: 0 },
            to: { scale: 1 },
          }}
          duration={3000}
          source={require('../../assets/images/gifs/catWaiting.gif')}
          style={[
            styles.positionAbsolute,
            { width: logoSize, height: logoSize, bottom: bottomPosition },
          ]}
        />
      )}
      {nameVisible && (
        <Animatable.View animation="fadeIn" duration={1000} style={[styles.positionAbsolute, { top: nameBottomPosition }]}>
          {/* <Image
            source={require('../../assets/images/gifs/catWaiting.gif')}
            style={{ width: nameImageWidth, height: nameImageHeight }}
            resizeMode="contain"
          /> */}
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
