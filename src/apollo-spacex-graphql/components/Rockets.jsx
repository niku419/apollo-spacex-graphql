import React from 'react'
import { gql, useQuery } from "@apollo/client"
import { Card, Skeleton } from 'antd'
import { Container } from 'react-bootstrap'

export default function Launches() {
  const { loading, error, data } = useQuery(gql`
    query {
      rockets {
        country
        description
        company
        cost_per_launch
        id
        name
        mass {
          kg
        }
      }
    }
  `)
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
      {data.rockets.length > 0 && 
        data.rockets.map(rocket => (
          <Card style={{ width: 300, marginTop: 16 }} className="col-md-6" loading={loading} key={rocket.id[0]}>
            <h5><a href={`rockets/${rocket.id}`}>{rocket.name} by {rocket.company}</a></h5>
            <Card.Meta
              description={rocket.description}
            />
            <div className="text-muted pt-1">By {rocket.country}</div>
            <div className="text-muted pt-1">Cost: {rocket.cost_per_launch}</div>
            <div className="text-muted pt-1">Weight: {rocket.mass.kg}kg</div>
          </Card>
        ))}
    </Container>
  ) 
}
