// @flow

import * as React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import type { NavigationScreenProp } from 'react-navigation';
import SwarmDB from 'swarm-db';
import { GraphQL } from 'swarm-react';
import type { Response } from 'swarm-react';

import ChatList from '../components/ChatList';
import type { User, Chat, Profile } from '../graphql';

import { chatListScreen, createUser, createChat } from '../graphql';

type ChatListScreenResponse = {
  chats: {
    id: string,
    version: string,
    length: number,
    list: Chat[],
  },
  user: User,
} | null;

type Props = {
  screenProps: {
    profile: Profile,
    logout: () => Promise<void>,
    swarm: SwarmDB,
  },
  navigation: NavigationScreenProp<{}>,
};

export default class Home extends React.Component<Props> {
  once: boolean;
  once = false;

  // check if need to push user data to the server
  checkOnce = async (r: Response<ChatListScreenResponse>): Promise<void> => {
    if (this.once) return;
    const { data } = r;
    if (!data) return;
    this.once = true;

    if (data.user.version === '0') {
      if (r.mutations && r.mutations.createUser) {
        const {
          uuid,
          nickname,
          name,
          picture,
          updated_at,
          email,
        } = this.props.screenProps.profile;
        await r.mutations.createUser({
          id: uuid,
          payload: {
            nickname,
            name,
            picture,
            updated_at,
            email,
            chats: r.uuid(),
          },
        });
      }
    }
  };

  render() {
    const { navigation, screenProps: { profile } } = this.props;
    return (
      <View style={styles.container}>
        <GraphQL
          query={chatListScreen}
          args={{ user: profile.uuid }}
          mutations={{ createChat, createUser }}>
          {(update: Response<ChatListScreenResponse>): React.Node => {
            this.checkOnce(update);
            if (!update.data || !update.data.chats || !update.data.user) {
              return <ActivityIndicator size="small" color="#666" />;
            }

            const chats = update.data.user.chats
              ? update.data.user.chats.list.concat(update.data.chats.list)
              : update.data.chats.list;
            return (
              <ChatList
                profile={profile}
                chats={chats}
                onPress={chat => navigation.navigate('Chat', { chat, profile })}
              />
            );
          }}
        </GraphQL>
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
});
