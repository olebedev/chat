// @flow

import * as React from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';

type Props = {
  onPressNext: () => Promise<void>,
  loading: boolean,
};

const instructions = ['Welcome to example chat', 'application based on SwarmDB.'].join('\n');

export default class Login extends React.Component<Props> {
  render() {
    return (
      <View style={styles.cardItem}>
        <Text style={styles.welcome}>The Chat</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <View style={styles.margin}>{this.props.loading && <Text>loading...</Text>}</View>
        <Button title={'Next'} onPress={this.props.onPressNext} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    margin: 5,
  },
  margin: {
    height: 85,
    ...Platform.select({
      android: {
        height: 95,
      },
    }),
  },
});
