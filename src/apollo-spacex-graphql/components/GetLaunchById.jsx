import React from 'react'
import { useParams } from 'react-router-dom'
import { gql, useQuery } from "@apollo/client"
import { Card, Skeleton } from 'antd'
import { Container } from 'react-bootstrap';

export default function GetLaunchById() {
  const { launchId } = useParams()
  let mission_id = launchId
  const GET_LAUNCH_BY_ID = gql`
    query LaunchById($mission_id: String){
      launches(find: {mission_id: $mission_id}) {
        mission_name
        mission_id
        details
        launch_date_local
        launch_site {
          site_name
        }
        links {
          video_link
          flickr_images
        }
      }
    }
  `
  const { loading, error, data } = useQuery(GET_LAUNCH_BY_ID, {
    variables: {
      mission_id
    }
  });
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
          <div>Video link: <a href={launch.links.video_link}>{launch.links.video_link}</a></div>
        </Card>
      ))}
    </Container>
    ) 
}