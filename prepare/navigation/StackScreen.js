import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef} from './rootNavigation';
import SplashScreen from '../views/splash/SplashScreen';
import LoginScreen from '../views/form/LoginScreen';
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
