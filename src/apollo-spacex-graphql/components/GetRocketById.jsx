import React from 'react'
import { useParams } from 'react-router-dom'
import { gql, useQuery } from "@apollo/client"
import { Card, Skeleton } from 'antd'
import { Container } from 'react-bootstrap'

export default function GetLaunchById() {
  const { rocketId } = useParams()
  const GET_ROCKET_BY_ID = gql`
    query RocketById($id: ID!){
      rocket(id: $id) {
        company
        cost_per_launch
        country
        description
        id
        mass {
          kg
        }
        name
      }
    }
  `
  const { loading, error, data } = useQuery(GET_ROCKET_BY_ID, { variables: { id: rocketId }})
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
  if (error) return <p>Error {JSON.stringify(error)}</p>;
  return (
    <Container className="p-0 m-0 row" fluid>
      <Card style={{ width: 300, marginTop: 16 }} className="col-md-6" loading={loading}>
        <h3>{data.rocket.name} by {data.rocket.company} from {data.rocket.country}</h3>
        <Card.Meta
          description={data.rocket.description}
        />
        <div className="text-muted pt-2">Weight: {data.rocket.mass.kg}kg</div>
        <div className="text-muted pt-2">Cost: {data.rocket.cost_per_launch}</div>
      </Card>
    </Container>
  ) 
}