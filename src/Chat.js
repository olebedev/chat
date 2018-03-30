// @flow

import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { UUID } from 'swarm-ron';
import { GraphQL } from 'swarm-react';
import type { Response } from 'swarm-react';

import { GiftedChat, Message } from './Chat/GiftedChat';
import type { NavigationScreenProp } from 'react-navigation';
import type { Chat } from './ChatList';
import type { Profile } from './auth0';
import { messages, createMessage, deleteMessage } from './graphql';

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
    // eslint-disable-next-line
    const _id = profile.uuid.toString();
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <GraphQL
          query={messages}
          args={{ chat: chat.id }}
          mutations={{ createMessage, deleteMessage }}>
          {(update: Response<messagesResponse>) => {
            console.log('render chat', update.data);
            return (
              <GiftedChat
                renderLoading={() => (
                  <ActivityIndicator size="small" color="#666" />
                )}
                messages={
                  update.data &&
                  update.data.chat.messages.list.filter(m => m.text)
                }
                onSend={async messages => {
                  const { createMessage: cm } = update.mutations || {};
                  if (!cm) {
                    return;
                  }
                  for (const m of messages) {
                    await cm({
                      id: update.uuid(),
                      chat: chat.messages.id,
                      payload: {
                        user: profile.uuid,
                        text: m.text,
                      },
                    }).catch(err => {
                      console.log({ err });
                    });
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
      avatar: 'https://i1.wp.com/cdn.auth0.com/avatars/p.png?ssl=1',
    };
  }
  return message;
}
