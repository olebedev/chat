// @flow

import * as React from 'react';
import { View, AsyncStorage } from 'react-native';

import { authorize, logout, getUserInfo } from './auth0';
import type { Profile } from './auth0';

import Login from './containers/Login';
import Swarm from './containers/Swarm';
import Stack from './navigation';

type State = {
  profile?: Profile,
  initialized?: true,
  loading: boolean,
  error?: any,
};

export default class App extends React.Component<{}, State> {
  state = { loading: false };

  constructor(props: {}) {
    super(props);
    this.init();
  }

  async init(): Promise<void> {
    const profile = await getUserInfo();
    let state = { initialized: true };
    if (profile)
      state = {
        ...state,
        profile,
      };
    this.setState(state);
  }

  onClear = (): Promise<void> => {
    return AsyncStorage.clear();
  };

  onLogout = async (): Promise<void> => {
    await logout();
    this.setState({
      error: null,
      loading: false,
      profile: undefined,
    });
  };

  onNext = async () => {
    this.setState({ loading: true });
    try {
      const profile = await authorize();
      this.setState({ profile });
    } catch (error) {
      this.setState({
        error,
        loading: false,
      });
    }
  };

  render() {
    if (!this.state.initialized) return null;
    return (
      <View style={{ flex: 1 }}>
        {!this.state.profile ? (
          <Login loading={this.state.loading} onPressNext={this.onNext} />
        ) : (
          <Swarm profile={this.state.profile}>
            <Stack
              screenProps={{
                logout: this.onLogout,
                clear: this.onClear,
                profile: this.state.profile,
              }}
            />
          </Swarm>
        )}
      </View>
    );
  }
}
