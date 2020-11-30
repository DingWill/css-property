import { message } from 'antd'

import { withMixin } from '../helpers/dva'
import { redirectTo } from '../helpers/view'
import { getCurrentUser } from '../services/user'
import { clearAll, getToken } from '../helpers/storage'

export default withMixin({
  namespace: 'users',
  state: {
    currentUser: null
  },

  effects: {
    *initCurrentUser({ payload }, { put, call, select }) {
      console.log(getToken())
      if (!getToken()) {
        message.warn('登录失效')
        return redirectTo('/o/login')
      }
      const { currentUser } = yield select(_ => _.users)
      if (currentUser) {
        return currentUser
      }
      yield put({
        type: 'queryCurrentUser'
      })
    },
    *queryCurrentUser({ payload }, { put, call, select }) {
      const { success, data } = yield call(getCurrentUser)
      if (!success || !data) {
        // message.warn('登录失效')
        clearAll()
        // return redirectTo('/o/login')
      }
      yield put({
        type: 'updateState',
        payload: {
          currentUser: data
        }
      })
    }
  },
  reducers: {}
})
