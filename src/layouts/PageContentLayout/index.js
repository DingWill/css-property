import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import withRouter from 'umi/withRouter'
import { Layout } from 'antd'

import { destoryGlobalSpinner } from '../../helpers/view'
// import GlobalHeader from '../../components/GlobalHeader'
import styles from './index.less'

class PageContentLayout extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string
    }),
    dispatch: PropTypes.func,
    children: PropTypes.any
  }

  constructor(props) {
    super(props)
    this.state = {
      collapsed: false
    }
  }

  _onToggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    // const { collapsed } = this.state
    const { children } = this.props

    destoryGlobalSpinner()

    const layoutHeight = 'calc(100vh - 0px)'

    return (
      <Layout className={styles.layoutContainer}>
        {/* <Layout.Header className={styles.header}>
          <GlobalHeader collapsed={collapsed} onToggle={this._onToggle} />
        </Layout.Header> */}
        <Layout style={{ height: layoutHeight }}>
          {/* <Layout.Sider theme="light" className={styles.siderContent} collapsed={collapsed}>
            <Menu
              style={{ width: '100%', height: '100%' }}
              selectedKeys={'overview'}
              mode="inline"
              onSelect={this._onMenuItemSelected}
            >
              <Menu.Item key={'overview'}>
                <Icon type="home" />
                <span>Overview</span>
              </Menu.Item>
            </Menu>
          </Layout.Sider> */}
          <Layout.Content className={styles.contentContainer}>{children}</Layout.Content>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(
  connect(() => {
    return {}
  })(PageContentLayout)
)
