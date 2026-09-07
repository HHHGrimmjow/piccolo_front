<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <span class="auth-icon">🎲</span>
        <h1>欢迎回来~</h1>
        <p>登录 Piccolo，让选择不再困难！</p>
      </div>

      <el-form :model="form" :rules="rules" ref="formRef" @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock"
                    size="large" show-password @keyup.enter="handleLogin" />
        </el-form-item>

        <el-button type="primary" size="large" round class="login-btn" :loading="loading"
                   @click="handleLogin">
          登录 ✨
        </el-button>
      </el-form>

      <div class="auth-footer">
        还没有账号？<router-link to="/register">马上注册 →</router-link>
      </div>
    </div>

    <!-- 装饰元素 -->
    <div class="deco deco-1">🌸</div>
    <div class="deco deco-2">⭐</div>
    <div class="deco deco-3">🎀</div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function handleLogin() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await userStore.login(form)
    ElMessage.success('登录成功~ 欢迎回来！')
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (e) {
    // error handled in interceptor
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff5f7 0%, #f0e6ff 50%, #e6f0ff 100%);
  position: relative;
  overflow: hidden;
}

.auth-card {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(255, 107, 157, 0.12);
  z-index: 1;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;

  .auth-icon {
    font-size: 48px;
    display: block;
    margin-bottom: 12px;
    animation: bounce 2s infinite;
  }

  h1 {
    font-size: 24px;
    font-weight: 800;
    color: #333;
    margin: 0 0 8px;
  }

  p {
    font-size: 14px;
    color: #999;
    margin: 0;
  }
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #ff6b9d, #c44dff);
  border: none;
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #999;

  a {
    color: var(--pink);
    font-weight: 600;
    text-decoration: none;
  }
}

.deco {
  position: absolute;
  font-size: 40px;
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;
}

.deco-1 { top: 10%; left: 10%; animation-delay: 0s; }
.deco-2 { top: 20%; right: 15%; animation-delay: 2s; }
.deco-3 { bottom: 15%; left: 20%; animation-delay: 4s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
</style>
