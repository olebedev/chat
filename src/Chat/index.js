// @flow

import * as React from 'react';
import { GiftedChat } from './GiftedChat';
type State = {
  messages: any[]
};

export default class Chat extends React.Component<*, State> {
  state = {
    messages: []
  };

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://avatars2.githubusercontent.com/u/848535?s=150&v=4'
          }
        }
      ]
    });
  }

  onSend(messages: any[] = []): void {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1
        }}
      />
    );
  }
}
