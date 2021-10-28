import React, { useState, useEffect } from 'react'
import { useQuery } from "@apollo/client"
import { Card, Row, Col, Pagination } from 'antd'
import { GET_UPCOMING_LAUNCHES, TOTAL_UPCOMING_LAUNCH_COUNT } from './graphql/queries/queries'
import LoaderCardComponent from '../components/LoaderCardComponent'

export default function UpComingLaunches() {
  const [offset, setOffset] = useState(0)
  const { loading, error, data, fetchMore } = useQuery(GET_UPCOMING_LAUNCHES, {
    variables: {
      offset
    }
  })
  function handlePageChange(pageNum, pageSize){
    console.log(pageNum)
    setOffset(pageNum-1)
  }
  const totalCountData = useQuery(TOTAL_UPCOMING_LAUNCH_COUNT)
  let totalCount = !totalCountData.loading && totalCountData.data.launchesUpcoming.length
  useEffect(() => {
    if(offset){
      console.log(offset)
      fetchMore({variables: { offset: offset }}).then(res => console.log(res))
      totalCountData.refetch()
    }
  }, [offset])

  if (error) return <p>Error {JSON.stringify(error)}</p>
  if(loading){
    return (
      <LoaderCardComponent loading={loading}/>
    )   
  }
  return (
    <div>
      <div className="heading"><h1>Upcoming Launches</h1></div>
      <Row className="mar">
        {data.launchesUpcoming.length > 0 && 
          data.launchesUpcoming.map(launch => (
            <Col span={8} key={launch.id}>
              <a href={`upcoming-launch/${launch.id}`}>
                <Card loading={loading} key={launch.id} className="border">
                  <h3>{launch.mission_name}</h3>
                  <Card.Meta
                    description={launch.details}
                  />
                </Card>
              </a>
            </Col>
        ))}
      </Row>
      <div className="flex-end">
        <Pagination current={offset+1} onChange= {handlePageChange} defaultPageSize= {1} pageSize= {1} total= {totalCount} />
      </div>
    </div>
  ) 
}
