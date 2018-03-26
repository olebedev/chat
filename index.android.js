import 'es6-symbol/implement';
import ArrayIterator from 'es6-iterator/array';

import { AppRegistry } from 'react-native';
import App from './src/App';

Array.prototype[Symbol.iterator] = function() {
  return new ArrayIterator(this);
};

AppRegistry.registerComponent('SwarmChat', () => App);
