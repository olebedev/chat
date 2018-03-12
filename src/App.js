// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { authorize, logout, getUserInfo } from './auth0';
import type { Profile } from './auth0';

import Login from './Login';
import Home from './navigation';

type State = {
  profile?: Profile,
  initialized?: true,
  loading: boolean,
  error?: any
};

export default class App extends React.Component<{}, State> {
  state = { loading: false };

  onLogout = async () => {
    await logout();
    this.setState({
      error: null,
      loading: false,
      profile: undefined
    });
  };

  onNext = async () => {
    this.setState({ loading: true });
    try {
      const profile = await authorize();
      console.log(JSON.stringify(profile, null, 2));
      this.setState({ profile });
    } catch (error) {
      this.setState({
        error,
        loading: false
      });
    }
  };

  async componentWillMount(): Promise<void> {
    const profile = await getUserInfo();
    console.log({ profile });
    let state = { initialized: true };
    if (profile)
      state = {
        ...state,
        profile
      };
    this.setState(state);
  }

  render() {
    if (!this.state.initialized) return null;

    return (
      <View style={styles.container}>
        {!this.state.profile && (
          <Login loading={this.state.loading} onPressNext={this.onNext} />
        )}
        {!!this.state.profile && (
          <Home
            screenProps={{
              logout: this.onLogout,
              profile: this.state.profile
            }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
