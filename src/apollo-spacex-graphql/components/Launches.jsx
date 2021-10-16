import React from 'react'
import { gql, useQuery } from "@apollo/client"
import { Card, Skeleton } from 'antd'
import { Container } from 'react-bootstrap';

export default function Launches() {
  const { loading, error, data } = useQuery(gql`
    query {
      launches {
        mission_id
        launch_date_local
        details
        mission_name
        launch_site{
          site_name
        }
        links {
          flickr_images
        }
      }
    }
  `);
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
      {data.launches.length > 0 && 
        data.launches.map(launch => (
          <Card style={{ width: 300, marginTop: 16 }} className="col-md-6" loading={loading} key={launch.mission_id[0]}>
            <h4><a href={`launches/${launch.mission_id}`}>{launch.mission_name}</a></h4>
            <Card.Meta
              description={launch.details}
            />
            <div className="text-muted pt-2">On {launch.launch_date_local} from {launch.launch_site.site_name}</div>
            <div>{launch.links.flickr_images.map(link => (
              <div style={{wordWrap: "break-word"}}><a href={link}>{link}</a></div>
            ))}
            </div>
          </Card>
        ))}
    </Container>
  ) 
}
