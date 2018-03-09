// @flow

import {AppRegistry} from 'react-native';
import App from './App';

AppRegistry.registerComponent('SwarmChat', () => App);

AppRegistry.runApplication('SwarmChat', {
  rootTag: document.getElementById('root'),
});
