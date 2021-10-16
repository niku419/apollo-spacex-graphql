import React from 'react'
import { gql, useQuery } from "@apollo/client"
import { Card, Skeleton } from 'antd'
import { Container } from 'react-bootstrap'

export default function UpComingLaunches() {
  const GET_LAUNCHES = gql`
    query {
      launchesUpcoming(limit: 5) {
        details
        id
        launch_date_local
        mission_id
        mission_name
        launch_site {
          site_name
        }
      }
    }
  `
  const { loading, error, data } = useQuery(GET_LAUNCHES)
  if (error) return <p>Error {JSON.stringify(error)}</p>
  if(loading){
    return (
      [1,2,3].map(value => (
      <Skeleton loading={loading} active>
        <Card style={{ width: 300, marginTop: 16 }} loading={loading} key={value}>
          <Card.Meta
            title="loading"
            description="loading"
          />
        </Card>
      </Skeleton>
    ))
  )
  }
  return (
    <Container className="p-0 m-0 row" fluid>
      {data.launchesUpcoming.length > 0 && 
        data.launchesUpcoming.map(launch => (
          <Card style={{ width: 300, marginTop: 16 }} className="col-md-6" loading={loading} key={launch.mission_id[0]}>
            <Card.Meta
              title={launch.mission_name}
              description={launch.details}
            />
            <div className="text-muted pt-2">On {launch.launch_date_local} from {launch.launch_site.site_name}</div>
          </Card>
      ))}
    </Container>
  ) 
}
