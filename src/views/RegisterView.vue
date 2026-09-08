<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <span class="auth-icon">🎉</span>
        <h1>加入 Piccolo</h1>
        <p>创建账号，开始你的投票之旅！</p>
      </div>

      <el-form :model="form" :rules="rules" ref="formRef" @submit.prevent="handleRegister">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名（3-50个字符）" prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item prop="nickname">
          <el-input v-model="form.nickname" placeholder="昵称（选填，给大家看的~）" prefix-icon="UserFilled" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码（至少6位）" prefix-icon="Lock"
                    size="large" show-password />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="确认密码" prefix-icon="Lock"
                    size="large" show-password @keyup.enter="handleRegister" />
        </el-form-item>

        <el-button type="primary" size="large" round class="register-btn" :loading="loading"
                   @click="handleRegister">
          注册 🚀
        </el-button>
      </el-form>

      <div class="auth-footer">
        已有账号？<router-link to="/login">去登录 →</router-link>
      </div>
    </div>

    <div class="deco deco-1">🌟</div>
    <div class="deco deco-2">🎈</div>
    <div class="deco deco-3">💫</div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  nickname: '',
  password: '',
  confirmPassword: ''
})

const validateConfirm = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 50, message: '用户名长度为3-50个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirm, trigger: 'blur' }
  ]
}

async function handleRegister() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await userStore.register({
      username: form.username,
      password: form.password,
      nickname: form.nickname
    })
    ElMessage.success('注册成功~ 快去登录吧！')
    router.push('/login')
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
  background: linear-gradient(135deg, #e6f0ff 0%, #f0e6ff 50%, #fff5f7 100%);
  position: relative;
  overflow: hidden;
}

.auth-card {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(196, 77, 255, 0.1);
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

.register-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #c44dff, #ff6b9d);
  border: none;
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #999;

  a {
    color: var(--purple);
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

.deco-1 { top: 15%; right: 10%; animation-delay: 0s; }
.deco-2 { bottom: 20%; left: 15%; animation-delay: 2s; }
.deco-3 { top: 30%; left: 10%; animation-delay: 4s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(-10deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .auth-card {
    width: 90%;
    max-width: 400px;
    padding: 32px 24px;
  }

  .auth-header .auth-icon {
    font-size: 36px;
  }

  .auth-header h1 {
    font-size: 20px;
  }

  .deco {
    font-size: 28px;
  }
}
</style>
