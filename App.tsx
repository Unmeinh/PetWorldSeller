import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import StackScreen from './src/navigation/StackScreen';
import { ToastLayout } from './src/components/layout/ToastLayout';
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