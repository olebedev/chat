// @flow

import * as React from 'react';
import { StackNavigator } from 'react-navigation';

import Home from './containers/Home';
import Avatar from './components/Avatar';
import Logout from './components/Logout';
import Chat from './containers/Chat';

export default StackNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({ screenProps: { clear, logout, profile } }) => {
      return {
        title: 'Chats',
        headerTitleStyle: {
          fontWeight: '900',
        },
        headerStyle: {
          backgroundColor: 'white',
        },
        headerLeft: <Avatar profile={profile} />,
        headerRight: <Logout logout={logout} clear={clear} />,
      };
    },
  },
  Chat: {
    screen: Chat,
    navigationOptions: ({ navigation: { state: { params: { chat } } } }) => {
      return {
        title: chat.private ? '🔒' + chat.title : chat.title,
        headerStyle: {
          backgroundColor: 'white',
        },
      };
    },
  },
});
