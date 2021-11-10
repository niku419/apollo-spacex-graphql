import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Card, Row, Col, Pagination, Breadcrumb } from 'antd';
import LoaderCardComponent from '../components/LoaderCardComponent';
import { GET_LAUNCHES, TOTAL_LAUNCH_COUNT } from './graphql/queries/queries';
import { routes } from '../common/constants';

export default function Launches() {
  const totalCountData = useQuery(TOTAL_LAUNCH_COUNT);
  const totalCount =
    !totalCountData.loading && totalCountData.data.launches.length;
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [tableData, setTableData] = useState([]);
  const { loading, error, data, fetchMore } = useQuery(GET_LAUNCHES, {
    variables: {
      limit: 10,
      offset
    }
  });
  function handleSizeChange(current, size) {
    setItemsPerPage(size);
    setPage(current);
    fetchMore({
      variables: { limit: size, offset: (current - 1) * size }
    }).then((res) => setTableData(res.data));
    totalCountData.refetch();
  }
  function handlePageChange(pageNum, pageSize) {
    setOffset((pageNum - 1) * 10);
    fetchMore({
      variables: { limit: pageSize, offset: (pageNum - 1) * pageSize }
    }).then((res) => setTableData(res.data));
    totalCountData.refetch();
    setPage(pageNum);
  }
  if (loading) {
    return <LoaderCardComponent loading={loading} />;
  }
  if (error) return <p>Error {JSON.stringify(error)}</p>;
  return (
    <div className="mar">
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href={routes.LAUNCHES}>Launches</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="heading">
        <h1>Launches</h1>
      </div>
      <Row wrap>
        {((tableData.launches && tableData.launches.length > 0) ||
          data.launches.length > 0) &&
          (tableData.launches && tableData.launches.length > 0
            ? tableData
            : data
          ).launches.map((launch) => (
            <Col
              span={8}
              key={launch.id}
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <a href={`launches/${launch.id}`}>
                <Card
                  hoverable
                  loading={loading}
                  key={launch.id}
                  className="border card-hover"
                >
                  <div className="heading">
                    <h3>{launch.mission_name}</h3>
                  </div>
                  <Card.Meta className="mar" description={launch.details} />
                </Card>
              </a>
            </Col>
          ))}
      </Row>
      <div className="flex-end">
        <Pagination
          current={page}
          pageSizeOptions={[1, 5, 10, 20]}
          onShowSizeChange={handleSizeChange}
          showSizeChanger
          onChange={handlePageChange}
          pageSize={itemsPerPage}
          total={totalCount}
        />
      </div>
    </div>
  );
}
