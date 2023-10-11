import React from 'react';
import { Provider } from 'react-redux';
import store from './prepare/redux/store';
import StackScreen from './prepare/navigation/StackScreen';
import { ToastLayout } from './prepare/components/layout/ToastLayout';
// import {useAppState} from '@react-native-community/hooks'

// const currentAppState = useAppState()

export default function App() {
  return (
      <Provider store={store}>
      <StackScreen/>
      <ToastLayout/>
      </Provider>
  )
}