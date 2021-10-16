import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Divider, Layout } from 'antd';
import { gql, useMutation, useQuery } from "@apollo/client"
import { useParams, Redirect } from 'react-router-dom'
import { Container } from 'react-bootstrap'

export default function UserForm() {
  const [form] = Form.useForm()
  const { userId } = useParams()
  const GET_USER = gql`
    query GetUser($_eq: uuid){
      users(where: {id: {_eq: $_eq}}){
        name
        id
        rocket 
        twitter
      }
    }
  `
  const ADD_USER = gql`
    mutation insert_users($name: String, $rocket: String, $twitter: String) {
      insert_users(objects: { name: $name, rocket: $rocket, twitter: $twitter }) {
        returning {
          name
          id
          rocket
          twitter
        }
      }
    }
  `
  const EDIT_USER = gql`
    mutation update_users($_eq: uuid, $name: String, $rocket: String, $twitter: String) {
      update_users(where : { id: { _eq: $_eq }}, _set: {name: $name, rocket: $rocket, twitter: $twitter }){
        returning{
          id
          name
          rocket
          twitter
        }
      }
    }
  `
  const { loading, error, data } = useQuery(GET_USER, { variables: { _eq: userId } })
  const [editUser ] = useMutation(EDIT_USER)
  const [addUser ] = useMutation(ADD_USER)
  const [twitter, setTwitter] = useState("")
  const [rocket, setRocket] = useState("")
  const [name, setName] = useState("")
  const [redirect, setRedirect] = useState(false)

  async function handleSubmit(e){
    if(userId){
      await editUser({ variables: { name, rocket, twitter, _eq: userId } })
      return setRedirect(true)
    }
    await addUser({ variables: { name, rocket, twitter }})
    .then(() => setRedirect(true))
    .catch(err => console.log(err))
  }

  useEffect(() => {
    if(userId){  
      setName(data && data?.users[0]?.name)
      setTwitter((data && data?.users[0]?.twitter))
      setRocket(data && data?.users[0]?.rocket)
    }
  }, [data, userId])

  if (loading) return 'getting user details';
  if (error) return `error! ${error.message}`
  return (
    <Container fluid>
      <Layout>
        {redirect && <Redirect to='/users'/>}
        <Layout.Content>
          <Divider>{userId ? 'Edit User' : 'Create User'}</Divider>
          <Form
            form={form}
            layout="inline"
            onFinish={handleSubmit}
          >
            <Form.Item 
              label="Name" 
              required 
              tooltip="Add your name"
            >
              <Input 
                placeholder="Name"
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Rocket"
              tooltip={{ title: 'Name of the rocket '}}
            >
              <Input 
                placeholder="Rocket Name"
                value={rocket} 
                onChange={(e) => setRocket(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="url"
              label="Your twitter URL"
              rules={[
                { type: 'url', warningOnly: true },
                { type: 'string', min: 6 },
              ]}
            >
              <Input 
                placeholder="Twitter URL" 
                value={twitter} 
                onChange={(e) => setTwitter(e.target.value)}  
              />
            </Form.Item>
            <Form.Item>
              <Button type="submit" htmlType="submit">{userId ? 'Update' : 'Create'}</Button>
            </Form.Item>
          </Form>
        </Layout.Content>
        <Divider/>
      </Layout>
    </Container>
  )
}