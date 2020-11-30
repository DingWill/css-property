import router from 'umi/router'
import { message } from 'antd'

import { withMixin } from '../../../helpers/dva'
import { setToken, getToken } from '../../../helpers/storage'
import { login } from './service'

export default withMixin({
  namespace: 'login',
  state: {},
  subscriptions: {
    setup({ history, dispatch }) {
      history.listen(location => {
        if (location.pathname !== '/login') {
          return
        }

        if (getToken()) {
          return dispatch({
            type: 'redirectTo',
            payload: {
              to: '/'
            }
          })
        }
      })
    }
  },
  effects: {
    *login({ payload }, { all, put, call, select }) {
      const { data, errorCode } = yield call(login, payload)

      if (errorCode === 200) {
        yield put({
          type: 'users/updateState',
          payload: {
            currentUser: data
          }
        })
        setToken(data.token)
        router.push('/')
        message.success('登录成功!')
        return
      }

      message.error('账号密码错误!')
    }
  },
  reducers: {}
})
