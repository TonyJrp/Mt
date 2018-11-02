import axios from 'axios'
axios.defaults.timeout = 5000
/** 生产环境*/
axios.defaults.baseURL = '//api.newretail.wochu.cn'
/** 测试环境*/
axios.defaults.baseURL = '//api.dev.newretail.wochu.cn'
axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

let post = (url, data, headers) => {
  var params = {
    platform: 5,
    is_dp: 1,
    access_token: ''
  }
  if (typeof data !== 'undefined' && data) {
    for (var ele in data) {
      params[ele] = data[ele]
    }
  }
  return axios({
    method: 'post',
    url,
    data: params,
    headers: headers
      ? headers
      : {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
  })
}

let get = (url, data) => {
  var params = {
    platform: 5,
    is_dp: 1,
    access_token: ''
  }
  if (typeof data !== 'undefined' && data) {
    for (var ele in data) {
      params[ele] = data[ele]
    }
  }
  return axios({
    method: 'get',
    url,
    params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export default { post, get }
