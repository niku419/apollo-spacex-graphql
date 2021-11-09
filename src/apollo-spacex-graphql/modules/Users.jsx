import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { Space, message, Popconfirm, Input, Button, Form, Pagination, Breadcrumb } from 'antd'
import { GET_USERS, GET_DATA_COUNT, NEW_QUERY } from './graphql/queries/queries'
import { DELETE_USER } from './graphql/mutations/mutations'
import LoaderComponent from '../components/LoaderComponent'
import CommonTable from '../components/CommonTable'
import { client } from '../Apollo'
import { routes } from '../common/constants'

export default function Users() {
  const totalCountData = useQuery(GET_DATA_COUNT)
  
  const [search, setSearch] = useState("")
  // const [nameSearch, setNameSearch] = useState("")
  // const [rocketSearch, setRocketSearch] = useState("")
  let totalCount
  const [form] = Form.useForm()
  const [tableData, setTableData] = useState([])
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [count, setCount] = useState(totalCount)  

  const { loading, error, data, refetch, fetchMore } = useQuery(GET_USERS, {
    variables: {
      limit: itemsPerPage
    },
    fetchPolicy: "network-only"
  })
  const [deleteUser] = useMutation(DELETE_USER)
  useEffect(() => {
    totalCount = !totalCountData.loading && totalCountData.data.users.length
  }, [])
  // function rocketFilter(e){
  //   setRocketSearch(e.target.value)
  //   let temp = "%"
  //   let searchText = temp.concat(e.target.value, temp)
  //   client.query({
  //     query: GET_USERS,
  //     variables: {
  //       _similar: searchText 
  //     }
  //   }).then(res => setTableData(res.data.users))
  //   totalCountData.refetch()
  // }
  // function usernameFilter(e){
  //   setNameSearch(e.target.value)
  //   let temp = "%"
  //   let searchText = temp.concat(e.target.value, temp)
  //   console.log(searchText)
  //   client.query({
  //     query: GET_USERS,
  //     variables: {
  //       _ilike: searchText
  //     }
  //   }).then(res => {
  //     setTableData(res.data.users)
  //     setCount(res.data.users.length)
  //   })
  //   totalCountData.refetch()
  // }
  function filter(e){
    setSearch(e.target.value)
    let temp = "%"
    let searchText = temp.concat(e.target.value, temp)
    console.log(searchText)
    client.query({
      query: NEW_QUERY,
      variables: {
        search: searchText,
        limit: itemsPerPage
      }
    }).then(res => {
      setTableData(res.data.users)
      setCount(res.data.users.length)
    })
  }
  function confirm(_eq) {
    deleteUser({ variables: { _eq } })
    refetch()
    totalCountData.refetch().then(res => setCount(res.data.users.length))
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
    fetchMore({variables: {limit: pageSize, offset: (pageNum-1)*pageSize}})
    .then(res => {
      setTableData(res.data.users)
    })
    totalCountData.refetch().then(res => setCount(res.data.users.length))
  }
  function handleSizeChange(current, size){
    console.log(current, size)
    setItemsPerPage(size)
    setPage(current)
    fetchMore({variables: {limit: size, offset: (current-1)*size}}).then(res => {
      setTableData(res.data.users)
    })
    totalCountData.refetch().then(res => setCount(res.data.users.length))
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
      <div className="center">
        <LoaderComponent/>
      </div> 
      
    )
  }
  if(error){
    return (
      <p>Error {JSON.stringify(error)}</p>
    )
  }  
  return (
    <div className="mar">
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href={routes.USERS}>Users</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="heading"><h1>{tableData.length>0 ? totalCount : count} Users</h1></div>
      <div className="flex-between">
        <div className="pad">
          <Button type="primary" href="/users/create">Create User</Button>
        </div>
        <div className="center">
        <Form
          form={form}
          layout="inline"
        >
          <Form.Item  
            required 
          >
            <Input 
              placeholder="Search"
              value={search} 
              onChange={filter}
            />
          </Form.Item>
          {/* <Form.Item  
            required 
          >
            <Input 
              placeholder="Name"
              value={nameSearch} 
              onChange={usernameFilter}
            />
          </Form.Item> */}
          {/* <Form.Item
          >
            <Input 
              placeholder="Rocket Name"
              value={rocketSearch} 
              onChange={rocketFilter}
            />
          </Form.Item> */}
        </Form>
        </div>
        
      </div>
      <div>
        <CommonTable 
          dataSource={tableData.length>0 ? tableData : data.users} 
          columns={columns} 
          pagination={false} 
        />
        <div className="flex-end pad">
          <Pagination 
            current={page} 
            pageSizeOptions={[1,5,10,20]} 
            onShowSizeChange={handleSizeChange} 
            showSizeChanger={true} 
            onChange={handlePageChange} 
            pageSize={itemsPerPage} 
            total={data.users.length>0 ? totalCount : count} 
          />
        </div>
      </div>
    </div>
  ) 
}