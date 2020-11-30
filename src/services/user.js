import API from '../helpers/api'

export function getCurrentUser(opts) {
  return API.get(`/user`)
}
