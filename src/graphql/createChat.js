// @flow

import gql from 'graphql-tag';

export default gql`
  mutation createChat(
    $id: UUID!
    $payload: Payoad!
    $ms: UUID!
    $mid: UUID!
    $message: Payload!
  ) {
    set(id: $id, payload: $payload)
    add(id: "chats", value: $id)
    madd: add(id: $ms, value: $mid)
    mset: set(id: $mid, payload: $message)
  }
`;
