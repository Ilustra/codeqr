import * as React from 'react';
import {AppRegistry} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {name as appName} from './app.json';
import App from './App';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    surface:'#f2f2f2',
    //text: '#505050',
    primary: '#fc6500',
    accent: '#000',
  },
};
export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
