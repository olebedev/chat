// @flow

import * as React from 'react';
import {
  Dimensions,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  View,
  Platform,
} from 'react-native';
// import UUID from 'swarm-ron-uuid';

export type User = {
  id: string,
  version: string,
  username: string,
  name: string,
  picture: string,
  email: string,
};

export type Message = {
  id: string,
  createdAt: string | Date,
  text: string,
  user: User,
  system: boolean,
};

export type Chat = {
  id: string,
  version: string,
  picture: string,
  title: string,
  messages?: Message[],
};

type Props = {
  chats: {
    id: string,
    version: string,
    length: number,
    list: Chat[],
  },
  onPress: (chat: Chat) => void,
};

export default class ChatList extends React.Component<Props, *> {
  _renderItem = ({ item, separators }) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.onPress(item)}
        onShowUnderlay={separators.highlight}
        onHideUnderlay={separators.unhighlight}>
        <View style={styles.cell}>
          <Image style={styles.picture} source={{ uri: item.picture }} />
          <View style={styles.inner}>
            <View style={styles.innerTop}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    console.log('chat list', this.props.chats);
    return (
      <FlatList
        ItemSeparatorComponent={Platform.select({
          ios: () => <View style={[styles.separator]} />,
        })}
        data={this.props.chats.list}
        keyExtractor={(item: Chat) => item.id}
        renderItem={this._renderItem}
      />
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
  inner: {
    flex: 1,
  },
  innerTop: {},
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  picture: {
    height: 45,
    width: 45,
    borderRadius: 45 / 2,
    marginRight: 10,
    marginLeft: 10,
    marginVertical: 5,
  },
  separator: {
    width: width - 20,
    marginLeft: 20,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
