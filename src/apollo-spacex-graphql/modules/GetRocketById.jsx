import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Card, Row, Breadcrumb } from 'antd';
import { routes } from '../common/constants';
import { GET_ROCKET_BY_ID } from './graphql/queries/queries';
import LoaderCardComponent from '../components/LoaderCardComponent';

export default function GetLaunchById() {
  const { rocketId } = useParams();
  const { loading, error, data } = useQuery(GET_ROCKET_BY_ID, {
    variables: { id: rocketId }
  });
  if (loading) {
    return <LoaderCardComponent loading={loading} />;
  }
  if (error) return <p>Error {JSON.stringify(error)}</p>;
  return (
    <div className="mar">
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href={routes.ROCKETS}>Rockets</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{data.rocket.name}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="byID">
        <Row className="center mar">
          <div className="heading">
            <h1>Rocket by ID</h1>
          </div>
          <div>
            <Card loading={loading}>
              <div className="heading">
                <h3>
                  {data.rocket.name} by {data.rocket.company} from{' '}
                  {data.rocket.country}
                </h3>
              </div>
              <div>{data.rocket.description}</div>
              <div>Boosters: {data.rocket.boosters}</div>
              <div>
                Engines: {data.rocket.engines.engines_loss_max || 'null'}
              </div>
              <div>Diameter: {data.rocket.diameter.meters}</div>
              <div>Weight: {data.rocket.mass.kg}kg</div>
              <div>Height: {data.rocket.height.meters} m</div>
              <div>
                {' '}
                {data.rocket.landing_legs.number} landing legs made with{' '}
                {data.rocket.landing_legs.material || 'null'}
              </div>
              <div>Cost: {data.rocket.cost_per_launch}</div>
            </Card>
          </div>
        </Row>
      </div>
    </div>
  );
}
