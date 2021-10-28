import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from "@apollo/client"
import { Card } from 'antd'
import { dateConvert } from '../Apollo'
import { GET_UPCOMING_LAUNCH_BY_ID } from './graphql/queries/queries'
import LoaderCardComponent from '../components/LoaderCardComponent'

export default function GetLaunchById() {
  const { launchId } = useParams()
  const { loading, error, data } = useQuery(GET_UPCOMING_LAUNCH_BY_ID, {
    variables: {
      id: launchId
    }
  });
  if(loading){
    return (
      <LoaderCardComponent loading={loading}/>
    )
  }
  if (error) return <p>Error {JSON.stringify(error)}</p>;
  return (
    <div className="center">
      <div className="heading"><h1>Upcoming Launch by ID</h1></div>
      <div>
        <Card loading={loading} key={data.launchesUpcoming.id}>
          <h4>{data.launchesUpcoming.mission_name}</h4>
          <div>{data.launchesUpcoming.details}</div>
          <div>On {dateConvert(data.launchesUpcoming.launch_date_local)}</div>
        </Card>
      </div>
    </div>
  ) 
}