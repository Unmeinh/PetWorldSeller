import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './rootNavigation';
import SplashScreen from '../views/splash/SplashScreen';
import LoginScreen from '../views/form/LoginScreen';
import ConfirmOTP from '../views/form/ConfirmOTP';
import ChangePassword from '../views/form/ChangePassword';
import RegisterShop from '../views/form/RegisterShop';
import ConfirmRegister from '../views/form/ConfirmRegister';
import ConfirmedShop from '../views/form/ConfirmedShop';
import NaviTabScreen from '../views/home/NaviTabScreen';
import DetailPet from '../views/product/DetailPet';
import DetailProduct from '../views/product/DetailProduct';
import AddPet from '../views/product/AddPet';
import EditPet from '../views/product/EditPet';
import AddProduct from '../views/product/AddProduct';
import EditProduct from '../views/product/EditProduct';
import AppointmentScreen from '../views/appointment/AppointmentScreen';
import DetailAppointment from '../views/appointment/DetailAppointment';
import AccountManager from '../views/account/AccountManager';
import AccountOwner from '../views/account/AccountOwner';
import EditInfo from '../views/account/EditInfo';
import EditAccount from '../views/account/EditAccount';
import EditPassword from '../views/account/EditPassword';
const Stack = createStackNavigator();

export default function StackScreen() {
  const animated = {
    gestureEnabled: true,
    transitionSpec: {
      open: { animation: 'timing', config: { duration: 300 } },
      close: { animation: 'timing', config: { duration: 300 } },
    },
    cardStyleInterpolator: ({ current: { progress } }) => {
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
        <Stack.Screen name="NaviTabScreen" component={NaviTabScreen} />
        <Stack.Screen name="DetailPet" component={DetailPet} />
        <Stack.Screen name="DetailProduct" component={DetailProduct} />
        <Stack.Screen name="AddPet" component={AddPet} />
        <Stack.Screen name="EditPet" component={EditPet} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="EditProduct" component={EditProduct} />
        <Stack.Screen name='AppointmentScreen' component={AppointmentScreen} />
        <Stack.Screen name='DetailAppointment' component={DetailAppointment} />
        <Stack.Screen name='AccountManager' component={AccountManager} />
        <Stack.Screen name='AccountOwner' component={AccountOwner} />
        <Stack.Screen name='EditInfo' component={EditInfo} />
        <Stack.Screen name='EditAccount' component={EditAccount} />
        <Stack.Screen name='EditPassword' component={EditPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
