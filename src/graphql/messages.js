// @flow

import gql from 'graphql-tag';

export default gql`
  subscription messages($from: Int = 0, $to: Int, $chat: UUID!) {
    chat @node(id: $chat) @static {
      id
      messages {
        id
        length
        list: id @node @slice(begin: $from, end: $to) @static {
          _id: id
          createdAt: id @date
          text
          sent
          received
          system
          user {
            _id: id
            name
            avatar: picture
          }
        }
      }
    }
  }
`;
