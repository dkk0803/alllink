/**
 * 请求模块
 */
import axios from 'axios'
import jsonBig from 'json-bigint'

// 在非组件模块中获取store必须通过这种方式
// 这里单独加载store和在组件中this.$store是一个东西
import store from '@/store/'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/',

  // transformResponse 允许自定义原始的响应数据（字符串）
  transformResponse: [function (data) {
    try {
      // 如果转换成功则返回转换的数据结果
      return jsonBig.parse(data)
    } catch (err) {
      // 如果转换失败，则包装为统一数据格式并返回
      return {
        data
      }
    }
  }]
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  const { user } = store.state

  // 如果用户已登录，统一给接口设置token信息
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }

  // 处理完之后一定要把config返回，否则请求就会停在这里
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器
// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})

// 导出
export default request
