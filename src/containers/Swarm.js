// @flow

import * as React from 'react';
import { AppState } from 'react-native';

import SwarmDB, { Verbose } from '@swarm/db';
import { Provider } from '@swarm/react';
import Storage from '@swarm/client/lib/asyncStorage';

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
      upstream: new Verbose('ws://0.0.0.0:31415'),
      db: {
        clockLen: 7,
        auth: props.profile.credentials.idToken,
        name: 'default',
      },
    });
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.swarm.close();
  }

  _handleAppStateChange = (state: string): void => {
    if (AppState.currentState === 'active') {
      this.swarm.close().then(() => {
        this.swarm.open();
      });
    }
  };

  render() {
    return <Provider swarm={this.swarm}>{this.props.children}</Provider>;
  }
}
