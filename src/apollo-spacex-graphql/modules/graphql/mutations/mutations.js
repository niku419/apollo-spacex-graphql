import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation insert_users($name: String, $rocket: String, $twitter: String) {
    insert_users(objects: { name: $name, rocket: $rocket, twitter: $twitter }) {
      returning {
        name
        id
        rocket
        twitter
      }
    }
  }
`;

export const EDIT_USER = gql`
  mutation update_users(
    $_eq: uuid
    $name: String
    $rocket: String
    $twitter: String
  ) {
    update_users(
      where: { id: { _eq: $_eq } }
      _set: { name: $name, rocket: $rocket, twitter: $twitter }
    ) {
      returning {
        id
        name
        rocket
        twitter
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation delete_users($_eq: uuid) {
    delete_users(where: { id: { _eq: $_eq } }) {
      returning {
        name
        rocket
        twitter
      }
    }
  }
`;
