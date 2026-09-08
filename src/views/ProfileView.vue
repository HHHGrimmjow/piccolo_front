<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 用户信息卡片 -->
      <div class="profile-card">
        <div class="profile-avatar">
          <el-avatar :size="80" :src="displayUser?.avatar">
            {{ displayUser?.nickname?.charAt(0) }}
          </el-avatar>
          <el-button v-if="isSelf" size="small" round @click="showEditDialog = true">
            编辑资料
          </el-button>
        </div>
        <div class="profile-info">
          <h2>{{ displayUser?.nickname || displayUser?.username }}</h2>
          <p class="bio">{{ displayUser?.bio || '这个人很懒，什么都没写~' }}</p>
          <div class="stats">
            <div class="stat-item">
              <span class="stat-num">{{ displayUser?.topicCount || 0 }}</span>
              <span class="stat-label">发起投票</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{{ displayUser?.voteCount || 0 }}</span>
              <span class="stat-label">参与投票</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{{ displayUser?.commentCount || 0 }}</span>
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
        <template v-if="isSelf">
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
        </template>
        <div v-else class="empty-state">
          只能查看自己的投票历史哦~
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
        <el-form-item label="头像">
          <div class="avatar-upload">
            <el-avatar :size="64" :src="avatarPreview || editForm.avatar">
              {{ editForm.nickname?.charAt(0) }}
            </el-avatar>
            <el-upload
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="handleAvatarUpload"
                accept="image/jpeg,image/png,image/gif"
            >
              <el-button size="small" round :loading="avatarUploading">
                {{ avatarUploading ? '上传中...' : '更换头像' }}
              </el-button>
            </el-upload>
          </div>
        </el-form-item>
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useTopicStore } from '@/stores/topic'
import { getUserInfo, updateProfile, uploadFile } from '@/api/user'
import { compressImage } from '@/utils/image'
import { ElMessage } from 'element-plus'

const route = useRoute()
const userStore = useUserStore()
const topicStore = useTopicStore()

// 判断是否查看自己的主页
const isSelf = computed(() => route.name === 'profile' || !route.params.id)

// 展示的用户数据
const displayUser = ref(null)
const userInfo = ref(null)
const voteHistory = ref([])
const activeTab = ref('history')
const showEditDialog = ref(false)
const saving = ref(false)
const avatarUploading = ref(false)
const avatarPreview = ref('')

const editForm = reactive({
  nickname: '',
  bio: '',
  avatar: ''
})

function beforeAvatarUpload(file) {
  const isImage = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isImage) {
    ElMessage.error('只能上传 JPG/PNG/GIF 格式的图片')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('图片大小不能超过 10MB')
    return false
  }
  return true
}

async function handleAvatarUpload({ file }) {
  avatarUploading.value = true
  try {
    let uploadFileObj = file
    if (file.size > 500 * 1024) {
      uploadFileObj = await compressImage(file)
    }
    const res = await uploadFile(uploadFileObj)
    const url = res.data
    editForm.avatar = url
    avatarPreview.value = url
    ElMessage.success('头像已上传')
  } catch (e) {
    ElMessage.error('头像上传失败')
  } finally {
    avatarUploading.value = false
  }
}

async function loadSelfProfile() {
  try {
    const res = await userStore.fetchUserInfo()
    const user = res.data
    userInfo.value = user
    displayUser.value = user
    editForm.nickname = user.nickname
    editForm.bio = user.bio
    editForm.avatar = (typeof user.avatar === 'string') ? user.avatar : ''
    avatarPreview.value = ''
    voteHistory.value = await topicStore.fetchVoteHistory()
  } catch (e) {
    // handled
  }
}

async function loadOtherProfile(userId) {
  try {
    const res = await getUserInfo(userId)
    displayUser.value = res.data
  } catch (e) {
    ElMessage.error('用户不存在')
  }
}

function loadData() {
  if (isSelf.value) {
    loadSelfProfile()
  } else {
    loadOtherProfile(route.params.id)
  }
}

async function saveProfile() {
  saving.value = true
  try {
    // 确保 avatar 一定是字符串
    const avatar = (typeof editForm.avatar === 'string') ? editForm.avatar : ''
    await updateProfile({
      nickname: editForm.nickname,
      bio: editForm.bio,
      avatar
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

// 监听路由变化，支持在他人主页和自己的主页之间切换
watch(() => route.fullPath, () => {
  if (route.name === 'profile' || route.name === 'user-profile') {
    loadData()
  }
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

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 16px;
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

/* 移动端适配 */
@media (max-width: 768px) {
  .profile-page {
    padding: 20px 16px;
  }

  .profile-card {
    padding: 24px 16px;
    border-radius: 20px;
  }

  .profile-avatar {
    flex-direction: row;
    gap: 16px;
  }

  .profile-info h2 {
    font-size: 18px;
  }

  .stats {
    gap: 16px;
  }

  .stat-item .stat-num {
    font-size: 18px;
  }

  .profile-tabs {
    gap: 6px;
  }

  .tab {
    padding: 8px 16px;
    font-size: 13px;
  }

  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .history-time {
    align-self: flex-end;
  }
}
</style>
