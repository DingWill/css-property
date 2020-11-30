import { Component } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Form, Row, Button, Col, Input, Checkbox, Icon } from 'antd'

import { setDoNotRememberme, getDoNotRememberme, removeDoNotRememberme, getToken } from '../../../helpers/storage'

import styles from './index.less'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rememberme: !getDoNotRememberme()
    }
  }

  goLogin = e => {
    e.preventDefault()

    const { validateFieldsAndScroll } = this.props.form

    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      const token = getToken()
      if (token) {
        values.token = token
      }
      this.props.dispatch({ type: 'login/login', payload: values })
    })
  }

  handleRememberme = e => {
    if (e.target.checked) {
      this.setState({
        rememberme: true
      })
      return removeDoNotRememberme()
    }
    this.setState({
      rememberme: false
    })
    return setDoNotRememberme()
  }

  render() {
    const { form, loading } = this.props

    const { getFieldDecorator } = form

    const isLoading = loading.effects['login/login']

    return (
      <div className={styles.login}>
        <div className={styles.form}>
          <div className={styles.welcomeTitle}>
            <span>欢迎登录</span>
          </div>
          <Form onSubmit={this.goLogin}>
            <Form.Item className={styles.formItem}>
              <Row type="flex" justify="space-between">
                <Col span={4}>
                  <Icon type="user" className={styles.labelIcon} />
                </Col>
                <Col span={20}>
                  {getFieldDecorator('account', {
                    rules: [
                      {
                        required: true,
                        message: '请输入登录邮箱'
                      },
                      {
                        type: 'email',
                        message: '登录邮箱格式不正确'
                      },
                      {
                        max: 50,
                        message: '请输入登录少于50个字符'
                      }
                    ]
                  })(
                    <Input
                      placeholder="请输入登录邮箱"
                      size={document.body.clientWidth >= 1600 ? 'large' : 'default'}
                      className={styles.input}
                    />
                  )}
                </Col>
              </Row>
            </Form.Item>
            <Form.Item className={styles.formItem}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入密码!'
                  },
                  {
                    pattern: /^\S{6,16}$/,
                    message: '密码长度为6-16'
                  }
                ]
              })(
                <Row type="flex" justify="space-between">
                  <Col span={4}>
                    <Icon type="lock" className={styles.labelIcon} />
                  </Col>
                  <Col span={20}>
                    <Input
                      type="password"
                      placeholder="请输入密码"
                      size={document.body.clientWidth >= 1600 ? 'large' : 'default'}
                      className={styles.input}
                    />
                  </Col>
                </Row>
              )}
            </Form.Item>
            <Row type="flex" justify="space-between" className={styles.remembermeLine}>
              <Checkbox
                checked={this.state.rememberme}
                className={styles.remembermeCheckbox}
                onChange={this.handleRememberme}
              >
                记住我
              </Checkbox>
            </Row>
            <Row type="flex" justify="center">
              <Button
                type="primary"
                htmlType="submit"
                onClick={this.goLogin}
                loading={isLoading}
                className={styles.submitBtn}
              >
                Submit
              </Button>
            </Row>
          </Form>
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func
  }),
  login: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}

export default connect(({ loading, login, app }) => {
  return {
    loading,
    login
  }
})(Form.create()(Login))
