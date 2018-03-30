// @flow

import { AppRegistry } from 'react-native';
import App from './src/App';
import './src/App.web.css';

AppRegistry.registerComponent('SwarmChat', () => App);

AppRegistry.runApplication('SwarmChat', {
  rootTag: document.getElementById('root'),
});

if (module.hot) {
  // $FlowFixMe
  module.hot.accept('./src/App', () => {
    const NextApp = require('./src/App').default;
    AppRegistry.registerComponent('SwarmChat', () => NextApp);
    AppRegistry.runApplication('SwarmChat', {
      rootTag: document.getElementById('root'),
    });
  });
}
