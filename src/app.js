import router from 'umi/router'
import { message } from 'antd'
import debounce from 'lodash/debounce'

import PageNotFoundError from './helpers/errors/PageNotFoundError'

export const dva = {
  config: {
    onError: debounce(function (err, dispatch) {
      if (err instanceof PageNotFoundError) {
        return router.push({
          pathname: '/404',
          query: {
            from: err.path,
          },
        })
      }
      message.error(err.message)
    }, 200),
  },
}
