// @flow

import * as React from 'react';
import { Image, StyleSheet, Text, View, Button } from 'react-native';

type Props = {
  onPressNext: () => Promise<void>,
  loading: boolean,
};

export default class Login extends React.Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('./swarm.jpg')} style={styles.logo} />
        <Text style={styles.welcome}>SwarmDB Demo</Text>
        <Text style={styles.instructions}>Welcome.</Text>
        {this.props.loading ? (
          <Text>loading...</Text>
        ) : (
          <Button title={'Next'} onPress={this.props.onPressNext} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 20,
  },
  welcome: {
    fontWeight: '900',
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
    marginBottom: 0,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    margin: 5,
    marginBottom: 20,
    lineHeight: 21,
  },
});
