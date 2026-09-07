import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, register as registerApi, getMe } from '@/api/auth'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('piccolo_token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('piccolo_user') || 'null'))

  const isLoggedIn = computed(() => !!token.value)

  // 登录
  async function login(form) {
    const res = await loginApi(form)
    token.value = res.data.token
    userInfo.value = res.data.user
    localStorage.setItem('piccolo_token', token.value)
    localStorage.setItem('piccolo_user', JSON.stringify(userInfo.value))
    return res
  }

  // 注册
  async function register(form) {
    return await registerApi(form)
  }

  // 获取当前用户信息
  async function fetchUserInfo() {
    const res = await getMe()
    userInfo.value = res.data
    localStorage.setItem('piccolo_user', JSON.stringify(userInfo.value))
    return res
  }

  // 退出登录
  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('piccolo_token')
    localStorage.removeItem('piccolo_user')
    router.push('/login')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    register,
    fetchUserInfo,
    logout
  }
})
