import { gql } from '@apollo/client'

export const GET_LAUNCH_BY_ID = gql`
  query LaunchById($id: ID!){
    launch(id: $id) {
      details
      launch_date_local
      launch_site {
        site_name
      }
      links {
        flickr_images
        video_link
      }
      mission_name
      rocket {
        rocket_name
      }
      ships {
        name
      }
    }
  }
`

export const GET_ROCKET_BY_ID = gql`
  query RocketById($id: ID!){
    rocket(id: $id) {
      boosters
      company
      cost_per_launch
      country
      description
      diameter {
        meters
      }
      engines {
        engine_loss_max
      }
      height {
        meters
      }
      id
      landing_legs {
        number
        material
      }
      mass {
        kg
      }
      name
    }
  }
`

export const GET_UPCOMING_LAUNCH_BY_ID = gql`
  query UpcomingLaunchById($id: ID!){
    launchesUpcoming(find: {id: $id}) {
      details
      id
      launch_date_local
      launch_site {
        site_name
      }
      mission_name
    }
  }
`

export const GET_LAUNCHES = gql`
  query($offset: Int, $limit: Int){
    launches(offset: $offset, limit: $limit, order: "DESC", sort: "launch_date_local") {
      id
      details
      mission_name
      launch_date_local
    }
  }
`

export const TOTAL_ROCKET_COUNT = gql`
  query {
    rockets{
      id
    }
  }
`

export const GET_ROCKETS = gql`
  query getrockets($offset: Int, $limit: Int){
    rockets(offset: $offset, limit: $limit) {
      description
      id
      name
    }
  }
` 

export const GET_UPCOMING_LAUNCHES = gql`
  query getlaunches($offset: Int) {
    launchesUpcoming(limit: 1, order: "DESC", sort: "launch_date_local", offset: $offset) {
      details
      id
      mission_name
      launch_date_local
    }
  }
`

export const TOTAL_UPCOMING_LAUNCH_COUNT = gql`
  query {
    launchesUpcoming{
      id
    }
  }
`

export const TOTAL_LAUNCH_COUNT = gql`
  query {
    launches{
      id
    }
  }
  `

export const GET_USER = gql`
  query GetUser($_eq: uuid){
    users(where: {id: {_eq: $_eq}}){
      name
      id
      rocket 
      twitter
    }
  }
`

export const GET_DATA_COUNT = gql`
  query {
    users{
      id
    }
  }
`

export const GET_USERS = gql`
  query getusers($offset: Int, $limit: Int, $_ilike: String, $_similar: String) {
    users(limit: $limit, offset: $offset, order_by: {timestamp: desc}, where: {name: {_ilike: $_ilike}, rocket: {_ilike: $_similar}}){
      name
      id
      rocket
    }
  }
`
export const NEW_QUERY = gql`
  query users($offset: Int, $limit: Int, $search: String) {
    users(
      order_by: { timestamp: desc }
      limit: $limit
      offset: $offset
      where: {
        _or: [{ name: { _ilike: $search } }, { rocket: { _ilike: $search } }] 
      }
    ) {
        id
        name
        rocket
    }
  }
`
// name: { _ilike: $searchname }
// const FILTER_ROCKETNAME = gql`
  //   query getusername($_ilike: String) {
  //     users(where: {rocket: {_ilike: $_ilike}}){
  //       name
  //       id
  //       rocket
  //     }
  //   }
  // `
  
  // const FILTER_USERNAME = gql`
  //   query getusername($_ilike: String) {
  //     users(where: {_or: {name: {_ilike: $_ilike}}}){
  //       name
  //       id
  //       rocket
  //     }
  //   }
  // `
  // const NEW_QUERY = gql`
  //   query users($offset: Int, $limit: Int, $search: String, $searchname: String) {
  //     users(
  //       order_by: { timestamp: desc }
  //       limit: $limit
  //       offset: $offset
  //       where: {
  //         _or: [{ name: { _ilike: $search } }, { rocket: { _ilike: $search } }]
  //         name: { _ilike: $searchname }
  //       }
  //     ){
  //       id
  //       name
  //       rocket
  //     }
  //   }
  // `
  // const [filterUsers, usernameData] = useLazyQuery(FILTER_USERNAME, {
  //   variables:{
  //     _ilike
  //   }
  // })
  // const [filterRocket, rocketData] = useLazyQuery(FILTER_ROCKETNAME, {
  //   variables:{
  //     _ilike
  //   }
  // })