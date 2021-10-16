import React, { useState } from 'react'
import { Menu } from 'antd'

export default function NavBar() {
  const [current, setCurrent] = useState(window.location.pathname.substring(1) || "home")
  console.log(current)
  function handleClick(e){
    console.log(e.key)
    setCurrent(e.key)
  }
  return (
    <div>
      <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
        <Menu.Item key="home">
          <a href="/" style={{textDecoration: "none"}} rel="noopener noreferrer">
            Home
          </a>
        </Menu.Item>
        <Menu.Item key="launches">
          <a href="/launches" style={{textDecoration: "none"}} rel="noopener noreferrer">
            Launches
          </a>
        </Menu.Item>
        <Menu.Item key="rockets">
          <a href="/rockets" style={{textDecoration: "none"}} rel="noopener noreferrer">
            Rockets
          </a>
        </Menu.Item>
        <Menu.Item key="users">
          <a href="/users" style={{textDecoration: "none"}} rel="noopener noreferrer">
            Users
          </a>
        </Menu.Item>
      </Menu>
    </div>
  )
}
