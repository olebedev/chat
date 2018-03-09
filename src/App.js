// @flow

import * as React from 'react';
import {AsyncStorage, StyleSheet, View} from 'react-native';

import Auth0 from 'react-native-auth0';
import decode from 'jwt-decode';
import FlipCard from 'react-native-flip-card';
import SwarmDB from 'swarm-db';

import Login from './Login';
import Home from './navigation';

const auth0 = new Auth0({domain: 'olebedev.eu.auth0.com', clientId: 'YbAHcczyP672C0uHggH2a7BHcuFiLYTt'});

type Props = {};

type State = {
  initialized?: true,
  credentials?: {
    idToken: string,
    tokenType: string,
    accessToken: string,
    expiresIn: number,
  },
  profile?: {
    picture: string,
    username: string,
  },
  loading: boolean,
  error?: any,
};

export default class App extends React.Component<Props, State> {
  state = {loading: false};

  onLogout = async () => {
    await AsyncStorage.removeItem('~profile');
    this.setState({
      loading: false,
      credentials: undefined,
      profile: undefined,
    });
  };

  onNext = async () => {
    this.setState({loading: true});
    try {
      const credentials = await auth0.webAuth.authorize({
        scope: 'openid profile email',
        audience: 'https://olebedev.eu.auth0.com/userinfo',
      });
      const decoded = decode(credentials.idToken);
      const p = {
        credentials,
        profile: decoded,
      };
      console.log(JSON.stringify(p, null, 2));
      await AsyncStorage.setItem('~profile', JSON.stringify(p));
      this.setState({
        error: null,
        loading: false,
        ...p,
      });
    } catch (error) {
      this.setState({
        error,
        loading: false,
      });
    }
  };

  async componentWillMount(): Promise<void> {
    const p = await AsyncStorage.getItem('~profile');
    let state = {initialized: true};
    if (p)
      state = {
        ...state,
        ...JSON.parse(p),
      };
    this.setState(state);
  }

  render() {
    if (!this.state.initialized) return null;

    return (
      <View style={styles.container}>
        {!this.state.profile && <Login loading={this.state.loading} onPressNext={this.onNext} />}
        {!!this.state.profile && (
          <Home
            screenProps={{
              logout: this.onLogout,
              profile: this.state.profile,
            }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1},
});
