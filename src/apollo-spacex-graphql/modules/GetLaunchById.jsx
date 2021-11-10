import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Card, Row, Breadcrumb } from 'antd';
import { dateConvert } from '../Apollo';
import { GET_LAUNCH_BY_ID } from './graphql/queries/queries';
import LoaderCardComponent from '../components/LoaderCardComponent';

export default function GetLaunchById() {
  const { launchId } = useParams();
  const { loading, error, data } = useQuery(GET_LAUNCH_BY_ID, {
    variables: {
      id: launchId
    }
  });
  if (loading) {
    return <LoaderCardComponent loading={loading} />;
  }
  if (error) return <p>Error {JSON.stringify(error)}</p>;
  return (
    <div className="mar">
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/launches">Launches</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{data.launch.mission_name}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="byID ">
        <div className="heading">
          <h1>Launch by ID</h1>
        </div>
        <Row className="center mar">
          <div>
            {' '}
            {data.launch.links.flickr_images.map((imageLink) => (
              <img
                key={imageLink}
                src={imageLink}
                style={{ height: '100px' }}
                alt="img"
              />
            ))}
          </div>
          <div>
            <Card loading={loading} key={data.launch.id} className="IDCard">
              <div className="heading">
                <h3>{data.launch.mission_name}</h3>
              </div>
              <div>{data.launch.details}</div>
              <div>Ship name: {data.launch.ships.name}</div>
              <div>Rocket name: {data.launch.rocket.rocket_name}</div>
              <div>
                On {dateConvert(data.launch.launch_date_local)} from{' '}
                {data.launch.launch_site.site_name}
              </div>
              <div>
                Video link:{' '}
                <a href={data.launch.links.video_link}>
                  {data.launch.links.video_link}
                </a>
              </div>
            </Card>
          </div>
        </Row>
      </div>
    </div>
  );
}
