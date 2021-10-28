import React, { useState } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { Space, message, Popconfirm, Input, Button, Form, Pagination } from 'antd'
import { GET_USERS, GET_DATA_COUNT } from './graphql/queries/queries'
import { DELETE_USER } from './graphql/mutations/mutations'
import LoaderComponent from '../components/LoaderComponent'
import CommonTable from '../components/CommonTable'
import { client } from '../Apollo'

export default function Users() {
  const [nameSearch, setNameSearch] = useState("")
  const [rocketSearch, setRocketSearch] = useState("")
  const [form] = Form.useForm()
  const [tableData, setTableData] = useState([])
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_USERS, {
    variables: {
      limit: itemsPerPage
    },
    fetchPolicy: "network-only"
  })
  const [deleteUser] = useMutation(DELETE_USER)
  const totalCountData = useQuery(GET_DATA_COUNT)
  let totalCount = !totalCountData.loading && totalCountData.data.users.length
  function rocketFilter(e){
    setRocketSearch(e.target.value)
    let temp = "%"
    let searchText = temp.concat(e.target.value, temp)
    client.query({
      query: GET_USERS,
      variables: {
        _similar: searchText 
      }
    }).then(res => setTableData(res.data.users))
    totalCountData.refetch()
  }
  function usernameFilter(e){
    setNameSearch(e.target.value)
    let temp = "%"
    let searchText = temp.concat(e.target.value, temp)
    console.log(searchText)
    client.query({
      query: GET_USERS,
      variables: {
        _ilike: searchText
      }
    }).then(res => setTableData(res.data.users))
    totalCountData.refetch()
  }
  function confirm(_eq) {
    deleteUser({ variables: { _eq } })
    refetch()
    totalCountData.refetch()
    message.success('user deleted!')
  }
  function cancel(e) {
    console.log(e);
    message.error('Clicked on No')
  }
  function handlePageChange(pageNum, pageSize){
    console.log(pageNum, pageSize)
    setItemsPerPage(pageSize)
    setPage(pageNum)
    fetchMore({variables: {limit: pageSize, offset: (pageNum-1)*pageSize}}).then(res => setTableData(res.data.users))
    totalCountData.refetch()
  }
  function handleSizeChange(current, size){
    console.log(current, size)
    setItemsPerPage(size)
    setPage(current)
    fetchMore({variables: {limit: size, offset: (current-1)*size}}).then(res => setTableData(res.data.users))
    totalCountData.refetch()
  }
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Rocket',
      dataIndex: 'rocket',
      key: 'rocket',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a href={`/users/${record.id}/edit`}>edit</a>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => confirm(record.id)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <a href="#delete">delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  if(loading){  
    return (  
      <LoaderComponent/>
    )
  }
  if(error){
    return (
      <p>Error {JSON.stringify(error)}</p>
    )
  }  
  return (
    <div className="mar">
      <div className="heading"><h1>Users</h1></div>
      <div className="flex-between">
        <div>
          <Button variant="primary" href="/users/create">Create User</Button>
        </div>
        <Form
          form={form}
          layout="inline"
        >
          <Form.Item  
            required 
          >
            <Input 
              placeholder="Name"
              value={nameSearch} 
              onChange={usernameFilter}
            />
          </Form.Item>
          <Form.Item
          >
            <Input 
              placeholder="Rocket Name"
              value={rocketSearch} 
              onChange={rocketFilter}
            />
          </Form.Item>
        </Form>
      </div>
      <div>
        <CommonTable 
          dataSource={tableData.length>0 ? tableData : data.users} 
          columns={columns} 
          pagination={false} 
        />
        <div className="flex-end">
          <Pagination 
            current={page} 
            pageSizeOptions={[1,5,10,20]} 
            onShowSizeChange={handleSizeChange} 
            showSizeChanger={true} 
            onChange={handlePageChange} 
            pageSize={itemsPerPage} 
            total={totalCount} 
          />
        </div>
      </div>
    </div>
  ) 
}