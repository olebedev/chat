// @flow

import * as React from 'react';
import { View, ActivityIndicator, Clipboard, Platform } from 'react-native';
import { UUID } from 'swarm-ron';
import { GraphQL } from 'swarm-react';
import type { Response } from 'swarm-react';

import { GiftedChat } from '../components/GiftedChat/GiftedChat';
import type { NavigationScreenProp } from 'react-navigation';
import type { Chat, Profile, Message } from '../graphql';
import { messages, createMessage, deleteMessage } from '../graphql';

type Props = {
  navigation: NavigationScreenProp<{
    params: {
      chat: Chat,
      profile: Profile,
    },
  }>,
};

export default class extends React.Component<Props> {
  lastUpdate: Response<{ chat: Chat }>;

  onLongPress = (ctx: mixed, message: Message): void => {
    const _id = this.props.navigation.state.params.profile.uuid.toString();

    const options = ['Cancel'];
    if (_id === message.user._id || !message.text) options.unshift('Delete');
    if (message.text) options.unshift('Copy');

    // $FlowFixMe
    ctx.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.indexOf('Cancel'),
      },
      this.onPressAction.bind(this, options, message),
    );
  };

  onPressAction = (
    options: string[],
    message: Message,
    buttonIndex: number,
  ): void => {
    const { chat } = this.props.navigation.state.params;
    switch (buttonIndex) {
      case options.indexOf('Copy'):
        Clipboard.setString(message.text);
        return;
      case options.indexOf('Delete'):
        const { deleteMessage: dm } = this.lastUpdate.mutations || {};
        dm &&
          dm({
            id: UUID.fromString(message._id),
            chat: chat.messages.id,
          });
        return;
      default:
        return;
    }
  };

  onSend = async (messages: Message[]): Promise<void> => {
    const { chat, profile } = this.props.navigation.state.params;
    const { createMessage: cm } = this.lastUpdate.mutations || {};
    if (!cm) {
      return;
    }
    for (const m of messages) {
      await cm({
        id: this.lastUpdate.uuid(),
        chat: chat.messages.id,
        payload: {
          user: profile.uuid,
          text: m.text,
        },
      }).catch(err => {
        console.log({ err });
      });
    }
  };

  render() {
    const { chat, profile } = this.props.navigation.state.params;
    const _id = profile.uuid.toString();
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <GraphQL
          query={messages}
          args={{ chat: chat.id }}
          mutations={{ createMessage, deleteMessage }}>
          {(update: Response<{ chat: Chat }>) => {
            this.lastUpdate = update;
            const messages = (
              (update.data && update.data.chat.messages.list) ||
              chat.messages.list ||
              []
            ).filter(m => m && m.text);
            return (
              <GiftedChat
                renderLoading={() => (
                  <ActivityIndicator size="small" color="#666" />
                )}
                messages={messages}
                onLongPress={
                  Platform.OS === 'web' ? undefined : this.onLongPress
                }
                onSend={update.data ? this.onSend : undefined}
                user={{ _id }}
              />
            );
          }}
        </GraphQL>
      </View>
    );
  }
}
