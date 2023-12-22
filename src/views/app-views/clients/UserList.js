import React, { useState, useEffect } from 'react'
import { Card, Table, Tooltip, Button } from 'antd'
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons'
// import UserView from './UserView'
import AvatarStatus from 'components/shared-components/AvatarStatus'
import UserView from './UserView'

export const UserList = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userProfileVisible, setUserProfileVisible] = useState(false)

  useEffect(() => {
    const fetchUsers = async () =>
      await fetch('https://jsonplaceholder.typicode.com/users')
        .then((resp) => resp.json())
        .then((data) => setUsers(data))
        .finally(setLoading(false))

    fetchUsers()
  }, [])

  const deleteUser = (userId) => {
    const newUsers = structuredClone(users).filter((item) => item.id !== userId)
    setUsers(newUsers)
    // message.success({ content: `Deleted user ${userId}`, duration: 2 })
  }

  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true)
    setSelectedUser(userInfo)
  }

  const closeUserProfile = () => {
    setUserProfileVisible(false)
    setSelectedUser(null)
  }

  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'User',
      dataIndex: 'name',
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus src={record.img} name={record.name} subTitle={record.email} />
        </div>
      ),
      sorter: {
        compare: (a, b) => {
          a = a.name.toLowerCase()
          b = b.name.toLowerCase()
          return a > b ? 1 : b > a ? -1 : 0
        }
      }
    },
    {
      title: 'Username',
      dataIndex: 'username',
      sorter: {
        compare: (a, b) => {
          a = a.username.toLowerCase()
          b = b.username.toLowerCase()
          return a > b ? 1 : b > a ? -1 : 0
        }
      }
    },
    {
      title: 'Site',
      dataIndex: 'website',
      sorter: {
        compare: (a, b) => {
          a = a.website.toLowerCase()
          b = b.website.toLowerCase()
          return a > b ? 1 : b > a ? -1 : 0
        }
      }
    },
    {
      title: '',
      dataIndex: 'actions',
      render: (_, elm) => (
        <div className="text-right">
          <Tooltip title="View">
            <Button
              type="primary"
              className="mr-2"
              icon={<EyeOutlined />}
              onClick={() => showUserProfile(elm)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button danger icon={<DeleteOutlined />} onClick={() => deleteUser(elm.id)} size="small" />
          </Tooltip>
        </div>
      )
    }
  ]

  return (
    <Card bodyStyle={{ padding: '0px' }}>
      {!loading && <Table columns={tableColumns} dataSource={users} rowKey="id" />}
      <UserView data={selectedUser} open={userProfileVisible} close={closeUserProfile} />
    </Card>
  )
}

export default UserList
