<template>
  <header class="layout-header">
    <div class="header-inner">
      <!-- Logo -->
      <div class="logo" @click="$router.push('/')">
        <span class="logo-icon">🎲</span>
        <span class="logo-text">Piccolo</span>
      </div>

      <!-- 导航 -->
      <nav class="nav-menu">
        <router-link to="/" class="nav-item" active-class="active">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </router-link>
        <router-link to="/ranking" class="nav-item" active-class="active">
          <el-icon><Trophy /></el-icon>
          <span>排行榜</span>
        </router-link>
      </nav>

      <!-- 右侧操作区 -->
      <div class="header-actions">
        <template v-if="userStore.isLoggedIn">
          <el-button type="primary" round class="create-btn" @click="$router.push('/topic/create')">
            <el-icon><Plus /></el-icon>
            发起投票
          </el-button>
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-avatar">
              <el-avatar :size="36" :src="userStore.userInfo?.avatar">
                {{ userStore.userInfo?.nickname?.charAt(0) }}
              </el-avatar>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button round @click="$router.push('/login')">登录</el-button>
          <el-button type="primary" round @click="$router.push('/register')">注册</el-button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

function handleCommand(command) {
  if (command === 'profile') {
    window.location.href = '/profile'
  } else if (command === 'logout') {
    userStore.logout()
  }
}
</script>

<style lang="scss" scoped>
.layout-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 2px solid var(--pink-light);
  height: 64px;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  .logo-icon {
    font-size: 28px;
    animation: bounce 2s infinite;
  }

  .logo-text {
    font-size: 22px;
    font-weight: 800;
    background: linear-gradient(135deg, #ff6b9d, #c44dff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.nav-menu {
  display: flex;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  color: #666;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: var(--pink-light);
    color: var(--pink);
  }

  &.active {
    background: var(--pink);
    color: white;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.create-btn {
  background: linear-gradient(135deg, #ff6b9d, #ff8a65);
  border: none;
  font-weight: 600;
}

.user-avatar {
  cursor: pointer;
  border-radius: 50%;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
}
</style>
