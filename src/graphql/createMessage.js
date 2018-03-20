// @flow

import gql from 'graphql-tag';

export default gql`
  mutation createMessage($id: UUID!, $payload: Payoad!, $chat: UUID!) {
    set(id: $id, payload: $payload)
    add(id: $chat, value: $id)
  }
`;
