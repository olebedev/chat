// @flow

import * as React from 'react';
import {View, Text} from 'react-native';
import {StackNavigator} from 'react-navigation';

import Home from './Home';
import Chat from './Chat';

const MyScreen = () => <View><Text>text</Text></View>


export default StackNavigator({
  Home: {
    screen: Home,
    navigationOptions: () => ({
      title: 'Chats',
    }),
  },
  Test: {
    screen: MyScreen,
  },
  Chat: {
    screen: Chat,
    navigationOptions: () => ({
      title: 'Chat Room',
    })
  }
});
