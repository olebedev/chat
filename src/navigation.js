// @flow

import * as React from 'react';
import { AsyncStorage } from 'react-native';
import { StackNavigator } from 'react-navigation';

import SwarmDB from 'swarm-db';
import { UUID } from 'swarm-ron';
import { Provider } from 'swarm-react';
import Debug from './debugConn';

import Storage from './storage';
import type { Profile } from './auth0';
import Home, { Avatar, Logout } from './Home';
import Chat from './Chat';
import { provider2uuid } from './utils';

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
    this.swarm = new SwarmDB({
      storage: new Storage(),
      upstream: __DEV__ // eslint-disable-line
        ? new Debug('wss://swarmdb.ngrok.io')
        : new Debug('wss://swarm.toscale.co'),
      db: {
        name: __DEV__ // eslint-disable-line
          ? 'chat'
          : 'default',
      },
    });
    this.swarm.ensure().then(() => {
      // eslint-disable-next-line
      console.log('swarm initialized');
    });

    AsyncStorage.getAllKeys().then(keys => {
      AsyncStorage.multiGet(keys).then(pairs => {
        console.log({ pairs });
      });
    });

    // eslint-disable-next-line
    if (typeof window !== 'undefined') {
      window.swarm = this.swarm;
      window.UUID = UUID;
      window.id2uuid = provider2uuid;
    }
  }

  componentWillUnmount() {
    if (this.swarm) {
      this.swarm.close();
      if (typeof window !== 'undefined') {
        delete window.swarm;
        delete window.UUID;
      }
    }
  }

  render() {
    return (
      <Provider swarm={this.swarm}>
        <Stack screenProps={{ ...this.props, swarm: this.swarm }} />
      </Provider>
    );
  }
}
