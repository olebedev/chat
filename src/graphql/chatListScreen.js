// @flow

import gql from 'graphql-tag';

export default gql`
  subscription chatListScreen($from: Int = 0, $to: Int, $user: UUID!) {
    chats @node(id: "chats") {
      id
      version
      length
      list: id @node @slice(begin: $from, end: $to) {
        id
        version
        title
        picture
        messages {
          id
          length
          list: id @node @slice(begin: 0, end: 1) {
            id
            createdAt: id @date
            text
            user {
              id
              name
              picture
            }
          }
        }
      }
    }
    user @node(id: $user) {
      id
      version
      username: nickname
      name
      picture
    }
  }
`;
