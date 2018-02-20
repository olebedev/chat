// @flow

import * as React from 'react';
import {Platform, StyleSheet, Text, View, Button, Image} from 'react-native';

import Auth0 from 'react-native-auth0';
import decode from 'jwt-decode';
import URL from 'url-parse';

const auth0 = new Auth0({domain: 'olebedev.eu.auth0.com', clientId: 'YbAHcczyP672C0uHggH2a7BHcuFiLYTt'});

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu',
});

type Props = {};
type State = {
  credentials?: {
    idToken: string,
    tokenType: string,
    accessToken: string,
    expiresIn: number,
  },
  profile?: {
    picture: string,
  },
  error?: any,
};

export default class Login extends React.Component<Props, State> {
  state = {};

  onPressLogIn = async () => {
    if (this.state.profile) {
      this.setState({
        credentials: undefined,
        profile: undefined,
      });
      return;
    }
    try {
      const credentials = await auth0.webAuth.authorize({
        scope: 'openid profile email',
        audience: 'https://olebedev.eu.auth0.com/userinfo',
      });
      const decoded = decode(credentials.idToken);
      this.setState({
        error: null,
        credentials,
        profile: {
          ...decoded,
          picture: new URL(decoded.picture, true),
        },
      });
    } catch (error) {
      this.setState({error});
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        {this.state.profile && (
          <View style={styles.avatarWrap}>
            <Image style={styles.avatar} source={{uri: this.state.profile.picture.toString()}} />
          </View>
        )}
        <Button title={this.state.profile ? 'Log Out' : 'Log In'} onPress={this.onPressLogIn} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  avatarWrap: {
    width: 75,
    height: 75,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.4,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    borderColor: 'white',
    borderWidth: 3,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
