// @flow

import gql from 'graphql-tag';

export default gql`
  mutation deleteMessage($id: UUID!, $chat: UUID!) {
    remove(id: $chat, value: $id)
  }
`;
