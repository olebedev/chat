// @flow

import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';

import type { Profile } from '../graphql';
import { smallAvaSize } from './vars';

const Avatar = ({ profile }: { profile: Profile }) => (
  <TouchableOpacity>
    <View style={styles.avatarSmallWrap}>
      <Image style={styles.avatarSmall} source={{ uri: profile.picture }} />
    </View>
  </TouchableOpacity>
);

export default Avatar;

const styles = StyleSheet.create({
  avatarSmall: {
    width: smallAvaSize,
    height: smallAvaSize,
    borderRadius: smallAvaSize / 2,
    borderColor: 'white',
    borderWidth: 1,
  },
  avatarSmallWrap: {
    margin: 5,
    marginLeft: 15,
    width: smallAvaSize,
    height: smallAvaSize,
    borderRadius: smallAvaSize / 2,
  },
});
