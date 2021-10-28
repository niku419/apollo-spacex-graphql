import React from 'react'
import { Skeleton, Card } from 'antd'

export default function LoaderCardComponent({ loading }) {
  return (
    [1,2,3].map(value => (
      <Skeleton loading={loading} active>
        <Card loading={loading} key={value}>
          <Card.Meta
            title="loading"
            description="loading"
          />
        </Card>
      </Skeleton>
    ))
  )
}
