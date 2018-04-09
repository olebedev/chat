// @flow

import * as React from 'react';
import { AppState, Platform } from 'react-native';

import SwarmDB from 'swarm-db';
import { Provider } from 'swarm-react';
import { Verbose } from 'swarm-client/lib/connection';
import Storage from 'swarm-client/lib/asyncStorage';

import type { Profile } from '../graphql';

type Props = {
  profile: Profile,
  children: React.Node,
};

export default class Screens extends React.Component<Props> {
  swarm: SwarmDB;

  constructor(props: Props, context: any) {
    super(props, context);
    this.swarm = new SwarmDB({
      storage: new Storage(),
      upstream: __DEV__ // eslint-disable-line
        ? new Verbose('wss://swarmdb.ngrok.io')
        : 'wss://swarm.toscale.co',
      db: {
        auth: props.profile.credentials.idToken,
        name: __DEV__ // eslint-disable-line
          ? 'chat'
          : 'default',
      },
    });
    if (Platform.OS !== 'web') {
      AppState.addEventListener('change', this._handleAppStateChange);
    }
  }

  componentWillUnmount() {
    this.swarm.close();
  }

  _handleAppStateChange = (state: string): void => {
    if (state === 'active') {
      this.swarm.close().then(() => {
        this.swarm.open();
      });
    }
  };

  render() {
    return <Provider swarm={this.swarm}>{this.props.children}</Provider>;
  }
}
