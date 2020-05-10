
import http from '../utils/http'
import Toast from './toast'

http.interceptors.request.use(
  (config) => {
    return config
  },
  error => Promise.reject(error)
)

http.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.config.errorHandler !== false) {
      const msg = error.response.data.messages
      if (typeof msg === 'string') {
        Toast(msg)
      } else if (Array.isArray(msg) || typeof msg === 'object') {
        msg.forEach((v) => {
          Toast(v)
        })
      }
    }
    return Promise.reject(error)
  }
)

export default http
