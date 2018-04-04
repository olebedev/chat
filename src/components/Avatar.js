// @flow

import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

import type { Profile } from '../graphql';
import { smallAvaSize } from './vars';

const Avatar = ({ profile }: { profile: Profile }) => (
  <TouchableOpacity>
    <View style={styles.avatarSmallWrap}>
      <FastImage style={styles.avatarSmall} source={{ uri: profile.picture }} />
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
