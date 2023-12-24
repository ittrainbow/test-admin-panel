import { EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { Tooltip, Button } from 'antd'

import { AvatarStatus } from 'components/shared-components/AvatarStatus'

export const usersTable = (deleteUser, showUserProfile, closeUserProfile) => [
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
