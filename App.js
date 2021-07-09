import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import Routes from './src/routes';
const MyTheme = {
  dark: false,
  colors: {
    primary: '#fafafa',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};
function App() {
  const scheme = useColorScheme();
  return (
    <NavigationContainer  theme={scheme === 'dark' ? DarkTheme : MyTheme}>
      <Routes />
    </NavigationContainer>
  );
}

export default App;
