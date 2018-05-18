// @flow

import * as React from 'react';
import {
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  View,
} from 'react-native';
import FastImage from './Image';
import moment from 'moment';

import type { Chat } from '../graphql';

import Interval from './Interval';

type Props = {
  item: Chat,
  separators: { highlight: any, unhighlight: any },
  id: string,
  onPress: (item: Chat) => void,
};

export default class ListItem extends React.Component<Props> {
  render() {
    const { item, separators } = this.props;
    const m = item.messages && item.messages.length ? item.messages.list[0] : null;

    // web workaround
    const propsToAdd = separators
      ? {
          onShowUnderlay: separators.highlight,
          onHideUnderlay: separators.unhighlight,
        }
      : {};

    return (
      <TouchableOpacity {...propsToAdd} onPress={() => this.props.onPress(item)}>
        <View style={styles.cell}>
          <FastImage style={styles.picture} source={{ uri: item.picture }} />
          <View style={styles.inner}>
            <View style={styles.innerTop}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
                {item.title}
              </Text>
              {!!m && (
                <Text style={styles.date}>
                  <Interval interval={6e4}>{() => moment(m.createdAt).fromNow()}</Interval>
                </Text>
              )}
            </View>
            <View style={styles.innerBottom}>
              {!!m && (
                <Text style={styles.message} numberOfLines={2} ellipsizeMode="tail">
                  {m.text}
                </Text>
              )}
            </View>
          </View>
          <Image style={styles.arrow} source={require('./arrow.png')} />
        </View>
      </TouchableOpacity>
    );
  }
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 10,
    width,
  },
  arrow: {
    width: 7,
    height: 12,
    resizeMode: 'contain',
    marginTop: 3,
    marginRight: 6,
    tintColor: '#aaa',
  },
  inner: {
    flex: 1,
  },
  innerTop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innerBottom: {
    ...Platform.select({
      ios: {
        height: 34,
      },
      android: {
        height: 36,
      },
    }),
  },
  date: {
    marginTop: 2,
    marginRight: 5,
    color: '#aaa',
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    height: Platform.select({
      ios: 16,
      android: 20,
    }),
  },
  message: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  picture: {
    height: 45,
    width: 45,
    borderRadius: 45 / 2,
    marginRight: 10,
    marginLeft: 6,
    marginVertical: 5,
  },
});
