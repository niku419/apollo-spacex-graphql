import React, { useState, useEffect } from 'react'
import { useQuery } from "@apollo/client"
import { Card, Row, Col, Pagination, Breadcrumb } from 'antd'
import { GET_ROCKETS, TOTAL_ROCKET_COUNT } from './graphql/queries/queries'
import LoaderCardComponent from '../components/LoaderCardComponent'
import { routes } from '../common/constants'

export default function Launches() {
  const [offset, setOffset] = useState(0)
  const { loading, error, data, fetchMore } = useQuery(GET_ROCKETS, {
    variables: {
      limit: 1,
      offset
    }
  })
  const totalCountData = useQuery(TOTAL_ROCKET_COUNT)
  let totalCount = !totalCountData.loading && totalCountData.data.rockets.length
  function handlePageChange(pageNum){
    console.log(pageNum)
    setOffset(pageNum-1)
  }
  useEffect(() => {
    if(offset){
      console.log(offset)
      fetchMore({variables: {limit: 1, offset: offset}}).then(res => console.log(res))
      totalCountData.refetch()
    }
  }, [offset])
  if(loading){
    return (
      <LoaderCardComponent loading={loading}/>
    )
  }
 if (error) return <p>Error {JSON.stringify(error)}</p>;
  return (
    <div className="mar">
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href={routes.ROCKETS}>Rockets</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="heading"><h1>Rockets</h1></div>
      <Row>
        {data.rockets.length > 0 && 
          data.rockets.map(rocket => (
            <Col span={8} key={rocket.id} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
              <a href={`rockets/${rocket.id}`}>
                <Card hoverable loading={loading} key={rocket.id} className="border card-hover">
                  <h3>{rocket.name}</h3>
                  <Card.Meta
                    description={rocket.description}
                  />
                </Card>
              </a>
            </Col>
          ))}
      </Row>
      <div className='flex-end'>
        <Pagination current={offset+1} onChange={handlePageChange} defaultPageSize={1} pageSize={1} total={totalCount} />
      </div>
    </div>
  ) 
}
