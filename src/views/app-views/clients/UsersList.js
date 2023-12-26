import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Table } from 'antd'

import { FETCH_USERS, SET_USERS } from 'redux/constants/App'
import { Loading } from 'components/shared-components/Loading'
import { usersColumns } from './UsersColumns'
import { useHistory } from 'react-router-dom'
import PageHeader from 'components/layout-components/PageHeader'

export const UserList = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { loading, users } = useSelector((store) => store.app)

  useEffect(() => {
    !users.length && dispatch({ type: FETCH_USERS })
  }, [users, dispatch])

  const deleteUser = (userId) => {
    const newUsers = structuredClone(users).filter((item) => item.id !== userId)
    dispatch({ type: SET_USERS, payload: newUsers })
  }

  const selectUser = (id) => history.push(`/app/clients/${id}`)

  const columns = usersColumns(deleteUser, selectUser)

  if (loading) return <Loading />

  return (
    <>
      <PageHeader display={true} title="sidenav.menu.clients" />
      <Card style={{ padding: '0px' }}>
        <Table columns={columns} dataSource={users} selectUser={selectUser} rowKey="id" />
      </Card>
    </>
  )
}

export default UserList
