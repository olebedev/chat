// @flow

import * as React from 'react';
import {AsyncStorage, StyleSheet, View} from 'react-native';

// import Login from './Login';
import Chat from './Chat';

type Props = {};

type State = {
  loading: boolean,
};

export default class App extends React.Component<Props, State> {
  state = {
    loading: false,
  };

  render() {
    return (
      <View style={styles.container}>
        <Chat />
        {/* <Login */}
        {/*   loading={this.state.loading} */}
        {/*   onPressNext={async () => { */}
        {/*     console.log('next'); */}
        {/*   }} */}
        {/* /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1},
});
