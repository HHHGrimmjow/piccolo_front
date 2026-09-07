import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页 - Piccolo' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录 - Piccolo' }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: '注册 - Piccolo' }
  },
  {
    path: '/topic/create',
    name: 'topic-create',
    component: () => import('@/views/TopicCreateView.vue'),
    meta: { title: '发起投票 - Piccolo', requiresAuth: true }
  },
  {
    path: '/topic/:id',
    name: 'topic-detail',
    component: () => import('@/views/TopicDetailView.vue'),
    meta: { title: '话题详情 - Piccolo' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: '个人中心 - Piccolo', requiresAuth: true }
  },
  {
    path: '/ranking',
    name: 'ranking',
    component: () => import('@/views/RankingView.vue'),
    meta: { title: '排行榜 - Piccolo' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || 'Piccolo - 帮你做选择'

  // 需要登录的路由
  if (to.meta.requiresAuth) {
    const userStore = useUserStore()
    if (!userStore.isLoggedIn) {
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }
  }

  next()
})

export default router
