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
    version: string,
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

  // create chats and user object if needed
  createIfNotExist = (r: Response<ChatListScreenResponse>): void => {
    const { data } = r;
    if (this.once || !r.uuid || !data) return;
    this.once = true;

    // create user profile
    if (data.user.version === '0') {
      const { uuid, nickname, name, picture, updated_at, email } = this.props.screenProps.profile;
      r.mutations.createUser({
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

    if (data.chats.version === '0') {
      const {
        uuid,
        mutations: { createChat },
      } = r;
      for (const title of ['Random', 'General']) {
        const id = uuid(); // chat
        const ms = uuid(); // messages for the chat
        const mid = uuid(); // system message

        createChat({
          id,
          payload: {
            picture: `https://i1.wp.com/cdn.auth0.com/avatars/${title[0].toLowerCase()}.png?ssl=1`,
            title,
            messages: ms,
          },
          ms,
          mid,
          message: {
            text: 'Chat created',
            system: true,
            user: this.props.screenProps.profile.uuid,
          },
        });
      }
    }
  };

  render() {
    const {
      navigation: { navigate },
      screenProps: { profile },
    } = this.props;
    return (
      <View style={styles.container}>
        <GraphQL
          query={chatListScreen}
          variables={{ user: profile.uuid }}
          mutations={{ createChat, createUser }}>
          {(update: Response<ChatListScreenResponse>): React.Node => {
            const { data } = update;
            if (!data) {
              return <ActivityIndicator size="small" color="#666" />;
            }
            this.createIfNotExist(update);
            return (
              <ChatList
                profile={profile}
                chats={data.chats.list}
                onPress={chat => navigate('Chat', { chat, profile })}
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
