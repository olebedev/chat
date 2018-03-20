// @flow

import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { GraphQL } from 'swarm-react';
import type { Response } from 'swarm-react';

import { GiftedChat, Message } from './Chat/GiftedChat';
import type { NavigationScreenProp } from 'react-navigation';
import type { Chat } from './ChatList';
import type { Profile } from './auth0';
import { messages, createMessage } from './graphql';

type Props = {
  navigation: NavigationScreenProp<{
    params: {
      chat: Chat,
      profile: Profile,
    },
  }>,
};

type messagesResponse = {
  chat: {
    mid: string,
    messages: {
      length: number,
      list: Array<{
        _id: string,
        createdAt: Date,
        text: string,
        sent: boolean | void,
        received: boolean | void,
        system: boolean | void,
        user: {
          _id: string,
          name: string,
          avatar: string,
        },
      }>,
    },
  },
};

export default class extends React.Component<Props> {
  render() {
    const { chat, profile } = this.props.navigation.state.params;
    const _id = profile.uuid.toString();
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <GraphQL
          query={messages}
          args={{ chat: chat.id }}
          mutations={{ createMessage }}>
          {(update: Response<messagesResponse>) => {
            console.log('chat', { update });
            return (
              <GiftedChat
                renderLoading={() => (
                  <ActivityIndicator size="small" color="#666" />
                )}
                messages={
                  update.data ? update.data.chat.messages.list.map(addUser) : []
                }
                onSend={async messages => {
                  const { createMessage: cm } = update.mutations || {};
                  if (!cm) {
                    console.log('mutation not found');
                    return;
                  }
                  for (const m of messages) {
                    console.log('creating message...', { m, cm });
                    const resp = await cm({
                      id: update.uuid(),
                      chat: chat.messages.id,
                      payload: {
                        user: profile.uuid,
                        text: m.text,
                      },
                    }).catch(err => {
                      console.log({ err });
                    });
                    console.log('push message', { resp });
                  }
                }}
                user={{ _id }}
              />
            );
          }}
        </GraphQL>
      </View>
    );
  }
}

function addUser(message: Message): Message {
  if (!message.user) {
    message.user = {
      _id: '~',
      name: 'Phantom',
      avatar: 'https://avatars3.githubusercontent.com/u/848535?s=40&v=4',
    };
  }
  return message;
}
