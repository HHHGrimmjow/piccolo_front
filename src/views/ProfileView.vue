<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 用户信息卡片 -->
      <div class="profile-card">
        <div class="profile-avatar">
          <el-avatar :size="80" :src="userStore.userInfo?.avatar">
            {{ userStore.userInfo?.nickname?.charAt(0) }}
          </el-avatar>
          <el-button size="small" round @click="showEditDialog = true">
            编辑资料
          </el-button>
        </div>
        <div class="profile-info">
          <h2>{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</h2>
          <p class="bio">{{ userStore.userInfo?.bio || '这个人很懒，什么都没写~' }}</p>
          <div class="stats">
            <div class="stat-item">
              <span class="stat-num">{{ userInfo?.topicCount || 0 }}</span>
              <span class="stat-label">发起投票</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{{ userInfo?.voteCount || 0 }}</span>
              <span class="stat-label">参与投票</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{{ userInfo?.commentCount || 0 }}</span>
              <span class="stat-label">发表评论</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 切换 -->
      <div class="profile-tabs">
        <span :class="['tab', { active: activeTab === 'history' }]" @click="activeTab = 'history'">
          🗳️ 投票历史
        </span>
        <span :class="['tab', { active: activeTab === 'topics' }]" @click="activeTab = 'topics'">
          📋 我的话题
        </span>
      </div>

      <!-- 投票历史 -->
      <div v-if="activeTab === 'history'" class="tab-content">
        <div v-if="voteHistory.length === 0" class="empty-state">
          还没有投过票哦~ <router-link to="/">去逛逛 →</router-link>
        </div>
        <div v-for="item in voteHistory" :key="item.id" class="history-item"
             @click="$router.push(`/topic/${item.topic_id}`)">
          <div class="history-info">
            <h4>{{ item.topic_title }}</h4>
            <p>你投了: <span class="chosen">{{ item.option_text }}</span></p>
          </div>
          <span class="history-time">{{ formatDate(item.created_at) }}</span>
        </div>
      </div>

      <!-- 我的话题 -->
      <div v-if="activeTab === 'topics'" class="tab-content">
        <div class="empty-state">
          功能开发中~ 🚧
        </div>
      </div>
    </div>

    <!-- 编辑资料弹窗 -->
    <el-dialog v-model="showEditDialog" title="编辑资料" width="400px" :close-on-click-modal="false">
      <el-form label-position="top">
        <el-form-item label="昵称">
          <el-input v-model="editForm.nickname" placeholder="你的昵称" />
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input v-model="editForm.bio" type="textarea" :rows="3" placeholder="介绍一下自己~" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button round @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" round @click="saveProfile" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useTopicStore } from '@/stores/topic'
import { updateProfile } from '@/api/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const topicStore = useTopicStore()

const userInfo = ref(null)
const voteHistory = ref([])
const activeTab = ref('history')
const showEditDialog = ref(false)
const saving = ref(false)

const editForm = reactive({
  nickname: '',
  bio: ''
})

async function loadData() {
  try {
    userInfo.value = await userStore.fetchUserInfo()
    editForm.nickname = userInfo.value.nickname
    editForm.bio = userInfo.value.bio
    voteHistory.value = await topicStore.fetchVoteHistory()
  } catch (e) {
    // handled
  }
}

async function saveProfile() {
  saving.value = true
  try {
    await updateProfile({
      nickname: editForm.nickname,
      bio: editForm.bio
    })
    await userStore.fetchUserInfo()
    ElMessage.success('资料更新成功~')
    showEditDialog.value = false
  } finally {
    saving.value = false
  }
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.profile-page {
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  background: var(--bg-soft);
  padding: 32px 24px;
}

.profile-container {
  max-width: 700px;
  margin: 0 auto;
}

.profile-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  display: flex;
  gap: 24px;
  align-items: center;
  margin-bottom: 20px;
}

.profile-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.profile-info {
  flex: 1;

  h2 {
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 6px;
  }

  .bio {
    font-size: 14px;
    color: #999;
    margin: 0 0 16px;
  }
}

.stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;

  .stat-num {
    display: block;
    font-size: 22px;
    font-weight: 800;
    color: var(--pink);
  }

  .stat-label {
    font-size: 12px;
    color: #999;
  }
}

.profile-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab {
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #888;
  cursor: pointer;
  background: white;
  transition: all 0.2s;

  &.active {
    background: var(--pink);
    color: white;
  }
}

.tab-content {
  background: white;
  border-radius: 20px;
  padding: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #ccc;

  a {
    color: var(--pink);
    font-weight: 600;
  }
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 8px;
  padding-left: 12px;
  padding-right: 12px;

  &:hover {
    background: var(--bg-soft);
  }

  h4 {
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 4px;
  }

  p {
    font-size: 13px;
    color: #999;
    margin: 0;
  }

  .chosen {
    color: var(--pink);
    font-weight: 600;
  }
}

.history-time {
  font-size: 12px;
  color: #ccc;
  white-space: nowrap;
}
</style>
