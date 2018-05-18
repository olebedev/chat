// @flow

import gql from 'graphql-tag';

export default gql`
  mutation createUser($id: UUID!, $payload: Payload!) {
    set(id: $id, payload: $payload)
    add(id: "users", value: $id)
  }
`;
