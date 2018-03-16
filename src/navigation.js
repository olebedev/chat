// @flow

import * as React from 'react';
import { AsyncStorage } from 'react-native';
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
    navigationOptions: ({ screenProps: { logout, profile } }) => {
      return {
        title: 'Chats',
        headerTitleStyle: {
          fontWeight: '900',
        },
        headerStyle: {
          backgroundColor: 'white',
        },
        headerLeft: <Avatar profile={profile} />,
        headerRight: <Logout logout={logout} />,
      };
    },
  },
  Chat: {
    screen: Chat,
    navigationOptions: () => ({
      title: 'Chat Room',
      headerStyle: {
        backgroundColor: 'white',
      },
    }),
  },
});

type Props = {
  profile: Profile,
  logout: () => Promise<void>,
};

export default class Navigation extends React.Component<Props, *> {
  swarm: SwarmDB<*>;

  constructor(props: Props, context: any) {
    super(props, context);
    // AsyncStorage.clear();
    AsyncStorage.getAllKeys().then(keys => {
      console.log({ keys });
    });
    this.swarm = new SwarmDB({
      storage: new Storage(),
      upstream: new Debug('wss://swarmdb.ngrok.io'),
      db: { name: 'chat' },
    });
    this.swarm.ensure().then(() => {
      console.log('swarm connected');
    });
  }

  componentWillUnmount() {
    // TODO shutdown swarm instance
  }

  render() {
    return (
      <Provider swarm={this.swarm}>
        <Stack screenProps={{ ...this.props, swarm: this.swarm }} />
      </Provider>
    );
  }
}
