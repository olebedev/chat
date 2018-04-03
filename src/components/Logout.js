// @flow

import * as React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

import { smallAvaSize } from './vars';

type Props = {
  logout: () => void,
  clear: () => Promise<void>,
};

const Logout = ({ logout, clear }: Props) => (
  <TouchableOpacity
    onPress={logout}
    onLongPress={() => {
      clear().then(logout);
    }}>
    <Image
      style={styles.logoutImage}
      resizeMode="contain"
      source={require('./logout.png')}
    />
  </TouchableOpacity>
);

export default Logout;

const styles = StyleSheet.create({
  logoutImage: {
    tintColor: '#007AFF',
    height: smallAvaSize * 0.7,
    width: smallAvaSize * 0.7,
    marginRight: 15,
  },
});
