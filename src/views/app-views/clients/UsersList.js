import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Table } from 'antd'

import { UserProfile } from './UserProfile'
import { FETCH_USERS, SET_USERS } from 'redux/constants/App'
import { Loading } from 'components/shared-components/Loading'
import { usersTable } from './UsersTable'

export const UserList = () => {
  const dispatch = useDispatch()
  const { loading, users } = useSelector((store) => store.app)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userProfileVisible, setUserProfileVisible] = useState(false)

  useEffect(() => {
    !users.length && dispatch({ type: FETCH_USERS })
  }, [users, dispatch])

  const deleteUser = (userId) => {
    const newUsers = structuredClone(users).filter((item) => item.id !== userId)
    dispatch({ type: SET_USERS, payload: newUsers })
  }

  const showUserProfile = (userInfo) => {
    console.log(123)
    setUserProfileVisible(true)
    setSelectedUser(userInfo)
  }

  const closeUserProfile = () => {
    setUserProfileVisible(false)
    setSelectedUser(null)
  }

  const tableColumns = usersTable(deleteUser, showUserProfile, closeUserProfile)

  if (loading) return <Loading />

  return (
    <Card bodyStyle={{ padding: '0px' }}>
      {!loading && <Table columns={tableColumns} dataSource={users} rowKey="id" />}
      <UserProfile data={selectedUser} open={userProfileVisible} close={closeUserProfile} />
    </Card>
  )
}

export default UserList
