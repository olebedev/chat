// @flow

import gql from 'graphql-tag';

export default gql`
  mutation createUser($id: UUID!, $payload: Payload!, $skipAdd: Bool) {
    userCreated: set(id: $id, payload: $payload)
    userAdded: add(id: "users", value: $id) @skip(if: $skipAdd)
  }
`;
