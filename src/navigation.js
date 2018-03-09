// @flow

import * as React from 'react';
import {View, Text} from 'react-native';
import {StackNavigator} from 'react-navigation';

import Home from './Home';

export default StackNavigator({
  Home: {
    screen: Home,
    navigationOptions: () => ({
      title: 'Messages',
      // headerRight: <View style={{width: 1, height: 1}} />,
      // header: (
      //   <View>
      //     <Text>Messages</Text>
      //   </View>
      // ),
      // headerLeft: (
      //   <View>
      //     <Text>lo</Text>
      //   </View>
      // ),
    }),
  },
});
