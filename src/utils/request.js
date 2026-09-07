import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const request = axios.create({
  baseURL: '',
  timeout: 10000
})

// 请求拦截器 - 添加 Token
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('piccolo_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器 - 统一错误处理
request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 200) {
      return res
    }
    // 业务错误
    ElMessage.error(res.message || '出了点小问题~')
    return Promise.reject(new Error(res.message))
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error('登录已过期，请重新登录~')
          localStorage.removeItem('piccolo_token')
          localStorage.removeItem('piccolo_user')
          router.push('/login')
          break
        case 403:
          ElMessage.error('没有权限哦~')
          break
        case 404:
          ElMessage.error('找不到页面~')
          break
        default:
          ElMessage.error('网络开小差了~')
      }
    } else {
      ElMessage.error('网络连接失败~')
    }
    return Promise.reject(error)
  }
)

export default request
