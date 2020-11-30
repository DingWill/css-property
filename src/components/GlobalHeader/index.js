import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Icon } from 'antd'

import logoURL from '../../assets/image/logo.png'

import styles from './index.less'

function GlobalHeader(props) {
  const { collapsed, onToggle, dispatch } = props
  return (
    <React.Fragment>
      <div className={styles.logo}>
        <img src={logoURL} alt="logo" />
        <Icon className="trigger" type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={onToggle} />
      </div>
      <p className={styles.logout} onClick={() => dispatch({ type: 'app/signout' })}>
        退出登录
      </p>
    </React.Fragment>
  )
}
GlobalHeader.propTypes = {
  dispatch: PropTypes.func,
  collapsed: PropTypes.bool,
  onToggle: PropTypes.func
}

export default connect(({ app }) => {
  return {}
})(GlobalHeader)
