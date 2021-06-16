import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';

import Routes from './src/routes';
const MyTheme = {
  dark: false,
  colors: {
    primary: '#fff',
    card: '#fc6500',
    text: '#fff',
    border: 'rgb(199, 199, 204)',
  },
};
function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Routes />
    </NavigationContainer>
  );
}

export default App;
