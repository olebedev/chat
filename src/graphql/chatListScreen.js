// @flow

import gql from 'graphql-tag';

export default gql`
  subscription chatListScreen($user: UUID!) {
    chats @node(id: "chats") {
      version
      list: id @slice(begin: 0) {
        id
        title
        picture
        messages {
          id
          length
          list: id @slice(begin: 0, end: 1) @static {
            _id: id
            createdAt: id @date
            text
            user @static {
              _id: id
              name
              avatar: picture
            }
          }
        }
      }
    }
    user @node(id: $user) @static {
      id
      version
      username: nickname
      picture
    }
  }
`;
