import React from 'react'
import { connect } from 'react-redux'
import { CloseOutlined } from '@ant-design/icons'
import utils from 'utils'
import SearchInput from './SearchInput'

export const NavSearch = (props) => {
  // console.log('NavSearch rendered')
  const { active, close, headerNavColor } = props
  const mode = utils.getColorContrast(headerNavColor)

  return (
    <div
      className={`nav-search ${active ? 'nav-search-active' : ''} ${mode}`}
      style={{ backgroundColor: headerNavColor }}
    >
			123123123
      <div className="d-flex align-items-center w-100">
        <SearchInput close={close} active={active} />
      </div>
      <div className="nav-close" onClick={close}>
        <CloseOutlined />
      </div>
    </div>
  )
}

const mapStateToProps = ({ theme }) => {
  const { headerNavColor } = theme
  return { headerNavColor }
}

export default connect(mapStateToProps, {})(NavSearch)
