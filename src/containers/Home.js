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

  // check if need to create chats of user
  checkOnce = async (r: Response<ChatListScreenResponse>): Promise<void> => {
    if (this.once) return;

    const { data } = r;
    if (!data) return;

    this.once = true;

    const { uuid, picture } = this.props.screenProps.profile;

    if (data.user.version === '0' || picture !== data.user.picture) {
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
          payload: { nickname, name, picture, updated_at, email },
          skipAdd: data.user.version !== '0',
        });
      }
    }

    if (data.chats.version === '0') {
      if (r.mutations && r.mutations.createChat) {
        const cc = r.mutations.createChat;
        for (const title of ['Random', 'General', 'Boom']) {
          const id = r.uuid(); // chat
          const ms = r.uuid(); // messages for the chat
          const mid = r.uuid(); // system message

          await cc({
            id,
            payload: {
              picture: `https://i1.wp.com/cdn.auth0.com/avatars/${title[0].toLowerCase()}.png?ssl=1`,
              title,
              messages: ms,
            },
            ms,
            mid,
            message: {
              text: 'chat created',
              system: true,
              user: uuid,
            },
          });
        }
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
            return (
              <ChatList
                profile={profile}
                chats={update.data.chats}
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
