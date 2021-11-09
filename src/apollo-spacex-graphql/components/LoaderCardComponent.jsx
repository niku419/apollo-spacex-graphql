import React from 'react'
import { Skeleton, Card, Row, Col } from 'antd'

export default function LoaderCardComponent({ loading }) {
  return (
    <Row wrap={true} >
      {[0,1,2,3,4,5,6,7,8,9].map(value => (
        <Col span={8} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} className="pad">
          <Skeleton loading={loading} active>
            <Card loading={loading} key={value}>
              <Card.Meta
                title="loading"
                description="loading"
              />
            </Card>
          </Skeleton>
        </Col>
      ))}
    </Row>
  )
}
