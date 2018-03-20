// @flow

import gql from 'graphql-tag';

export default gql`
  subscription messages($from: Int = 0, $to: Int = 100, $chat: UUID!) {
    chat @node(id: $chat) {
      id
      mid: messages
      messages {
        length
        list: id @node @slice(begin: $from, end: $to) @ensure {
          _id: id
          createdAt: id @date
          text
          sent
          received
          system
          user @ensure {
            _id: id
            name
            avatar: picture
          }
        }
      }
    }
  }
`;
