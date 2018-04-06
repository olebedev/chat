// @flow

import * as React from 'react';
import { Dimensions, StyleSheet, View, Platform } from 'react-native';
import FlatList from './FlatList';
import type { Chat, Profile } from '../graphql';

import ListItem from './ListItem';

type Props = {
  profile: Profile,
  chats: Chat[],
  onPress: (chat: Chat) => void,
};

export default class ChatList extends React.Component<Props> {
  render() {
    const { profile: { uuid }, chats } = this.props;
    const id = uuid.toString();
    return (
      <FlatList
        ItemSeparatorComponent={Platform.select({
          ios: () => <View style={[styles.separator]} />,
        })}
        data={chats.filter(i => !!i)}
        keyExtractor={(item: Chat) => item.id}
        renderItem={({ item, separators }) => (
          <ListItem
            item={item}
            separators={separators}
            id={id}
            onPress={this.props.onPress}
          />
        )}
      />
    );
  }
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  separator: {
    width: width - 20,
    marginLeft: 20,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
