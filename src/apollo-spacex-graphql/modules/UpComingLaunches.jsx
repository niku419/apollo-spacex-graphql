import React, { useState, useEffect } from 'react'
import { useQuery } from "@apollo/client"
import { Card, Row, Col, Pagination, Breadcrumb } from 'antd'
import { GET_UPCOMING_LAUNCHES, TOTAL_UPCOMING_LAUNCH_COUNT } from './graphql/queries/queries'
import LoaderCardComponent from '../components/LoaderCardComponent'
import { routes } from '../common/constants'

export default function UpComingLaunches() {
  const [offset, setOffset] = useState(0)
  const { loading, error, data, fetchMore } = useQuery(GET_UPCOMING_LAUNCHES, {
    variables: {
      offset
    }
  })
  function handlePageChange(pageNum){
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
      <div className="center">
        <LoaderCardComponent loading={loading}/>
      </div>
    )   
  }
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href={routes.DASHBOARD}>Upcoming Launches</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="heading"><h1>Upcoming Launches</h1></div>
      <Row className="mar center">
        {data.launchesUpcoming.length > 0 && 
          data.launchesUpcoming.map(launch => (
            <Col span={6} key={launch.id} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
              <a href={`upcoming-launch/${launch.id}`}>
                <Card hoverable loading={loading} key={launch.id} className="border card-hover">
                  <div className="center"><h3>{launch.mission_name}</h3></div>
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
