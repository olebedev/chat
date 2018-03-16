// @flow

import gql from 'graphql-tag';

export default gql`
  subscription chatListScreen($from: Int = 0, $to: Int, $user: UUID!) {
    chats @node(id: "chats") @ensure {
      id
      version
      length
      list: id @node @slice(begin: $from, end: $to) @ensure {
        id
        version
        title
        picture
        mid: messages
        messages @slice(begin: 0, end: 1) @ensure {
          id
          createdAt: id
          text
          user @ensure {
            id
            name
            picture
          }
        }
      }
    }
    user @node(id: $user) @ensure {
      id
      version
      username: nickname
      name
      picture
    }
  }
`;
