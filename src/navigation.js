// @flow

import * as React from 'react';
import { AsyncStorage, View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

import SwarmDB from 'swarm-db';
import { Provider } from 'swarm-react';
import Debug from './debugConn';

import Storage from './storage';
import type { Profile } from './auth0';
import Home, { Avatar, Logout } from './Home';
import Chat from './Chat';

export const Stack = StackNavigator({
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
        title: chat.title,
        headerStyle: {
          backgroundColor: 'white',
        },
      };
    },
  },
});

type Props = {
  profile: Profile,
  logout: () => Promise<void>,
};

export default class Navigation extends React.Component<Props, *> {
  swarm: SwarmDB;

  constructor(props: Props, context: any) {
    super(props, context);
    // AsyncStorage.clear();
    AsyncStorage.getAllKeys().then(keys => {
      AsyncStorage.multiGet(keys).then(pairs => {
        console.log({ pairs });
      });
    });
    this.swarm = new SwarmDB({
      storage: new Storage(),
      upstream: new Debug('wss://swarmdb.ngrok.io'),
      // upstream: new Debug('ws://localhost:31415'),
      db: { name: 'chat' },
      // db: { id: 'user', name: 'chat', clockMode: 'Calendar' },
    });
    this.swarm.ensure().then(() => {
      console.log('swarm initialized');
    });
  }

  componentWillUnmount() {
    if (this.swarm) this.swarm.close();
  }

  render() {
    return (
      // <View>
      //   <Text>empty</Text>
      // </View>
      <Provider swarm={this.swarm}>
        <Stack screenProps={{ ...this.props, swarm: this.swarm }} />
      </Provider>
    );
  }
}
