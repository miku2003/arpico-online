import 'react-native-gesture-handler';  // Make sure this is the first line
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);