import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef} from './rootNavigation';
import SplashScreen from '../views/splash/SplashScreen';
import LoginScreen from '../views/form/LoginScreen';
import ConfirmOTP from '../views/form/ConfirmOTP';
import ChangePassword from '../views/form/ChangePassword';
import RegisterShop from '../views/form/RegisterShop';
import ConfirmRegister from '../views/form/ConfirmRegister';
import ConfirmedShop from '../views/form/ConfirmedShop';
const Stack = createStackNavigator();

export default function StackScreen() {
  const animated = {
    gestureEnabled: true,
    transitionSpec: {
      open: {animation: 'timing', config: {duration: 300}},
      close: {animation: 'timing', config: {duration: 300}},
    },
    cardStyleInterpolator: ({current: {progress}}) => {
      return {
        cardStyle: {
          opacity: progress,
        },
      };
    },
  };
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={() => ({ headerShown: false })}
        initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ConfirmOTP" component={ConfirmOTP} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="RegisterShop" component={RegisterShop} />
        <Stack.Screen name="ConfirmRegister" component={ConfirmRegister} />
        <Stack.Screen name="ConfirmedShop" component={ConfirmedShop} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
