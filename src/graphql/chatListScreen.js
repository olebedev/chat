// @flow

import gql from 'graphql-tag';

const chats = `
id
version
length
list: id @node @slice(begin: $from, end: $to) {
  id
  version
  title
  picture
  private
  messages {
    id
    length
    version
    list: id @node @slice(begin: 0, end: 1) @static {
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
}`;

export default gql`
  subscription chatListScreen($from: Int = 0, $to: Int, $user: UUID!) {
    # public chats
    chats @node(id: "chats") {
      ${chats}
    }
    user @node(id: $user) @static {
      id
      version
      username: nickname
      name
      picture
      # private chats
      chats {
        ${chats}
      }
    }
  }
`;
