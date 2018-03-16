// @flow

import * as React from 'react';
import { View } from 'react-native';
import { GiftedChat } from './GiftedChat';
type State = {
  messages: any[],
  isFocused: boolean,
};

export default class Chat extends React.Component<*, State> {
  chat: GiftedChat;

  state = {
    messages: [],
    isFocused: false,
  };

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 2,
          text: 'Hi there',
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'Me',
            avatar: 'https://avatars2.githubusercontent.com/u/848535?s=150&v=4',
          },
        },
        {
          _id: 1,
          text: 'Hello, I am Oleg',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Oleg Lebedev',
            avatar: 'https://avatars2.githubusercontent.com/u/848535?s=150&v=4',
          },
        },
      ],
    });
  }

  onSend(messages: any[] = []): void {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </View>
    );
  }
}
