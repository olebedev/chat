// @flow

import gql from 'graphql-tag';

export default gql`
  subscription messages($from: Int = 0, $to: Int, $chat: UUID!) {
    chat @node(id: $chat) @static {
      messages {
        id
        length
        list: id @slice(begin: $from, end: $to) @static {
          _id: id
          createdAt: id @date
          text
          sent
          received
          system
          user @static {
            _id: id
            name
            avatar: picture
          }
        }
      }
    }
  }
`;
