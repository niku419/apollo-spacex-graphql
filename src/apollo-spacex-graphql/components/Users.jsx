import React from 'react'
import { gql, useQuery, useMutation } from "@apollo/client"
import { Table, Space, message, Popconfirm } from 'antd'

export default function UpComingLaunches() {
  const DELETE_USER = gql`
    mutation delete_users($_eq: uuid){
      delete_users(where: {id: {_eq : $_eq}}){
        returning{ 
          name
          rocket
          twitter
        }
      }
    }
  `
  const GET_USERS = gql`
    query {
      users {
        name
        id
        rocket
      }
    }
  `
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [deleteUser, deleteData] = useMutation(DELETE_USER)
  function confirm(_eq) {
    deleteUser({ variables: { _eq } })
    refetch()
    console.log(_eq)
    message.success('user deleted!')
  }
  function cancel(e) {
    console.log(e);
    message.error('Clicked on No')
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
            <a href="#">delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  if(deleteData.data){
    console.log(deleteData.data)
  }
  if(loading){  
    return (  
      <div style={{display: "grid", placeItems: "center", height: "100vh"}}>
        Loading...
      </div>
    )
  }
  if(error){
    return (
      <p>Error {JSON.stringify(error)}</p>
    )
  } 
  if(data){
    return (
      <div className="mt-2">
        <Table dataSource={data.users} columns={columns} />
      </div>
    ) 
  }
}
