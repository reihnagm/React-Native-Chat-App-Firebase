import {AppRegistry} from 'react-native';
import App from './src/App';
import InitializeFirebase from './src/configs/firebase'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
