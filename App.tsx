import React from 'react';
import SplashScreen from './prepare/views/splash/SplashScreen';
import StackScreen from './prepare/navigation/StackScreen';
import { ToastLayout } from './prepare/components/layout/ToastLayout';
// import {useAppState} from '@react-native-community/hooks'

// const currentAppState = useAppState()

export default function App() {
  return (
      <>
      <StackScreen/>
      <ToastLayout/>
      </>
  )
}