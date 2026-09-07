<template>
  <div class="topic-detail-page" v-loading="loading">
    <div class="detail-container" v-if="topic">
      <!-- 话题头部 -->
      <div class="detail-header">
        <div class="header-info">
          <h1 class="topic-title">{{ topic.title }}</h1>
          <p v-if="topic.description" class="topic-desc">{{ topic.description }}</p>
          <div class="topic-meta">
            <div class="meta-author">
              <el-avatar :size="28" :src="topic.creatorAvatar">
                {{ topic.creatorName?.charAt(0) }}
              </el-avatar>
              <span>{{ topic.creatorName }}</span>
            </div>
            <span class="meta-divider">|</span>
            <span class="meta-stat">👀 {{ topic.viewCount }} 浏览</span>
            <span class="meta-stat">🗳️ {{ topic.voteCount }} 票</span>
            <span v-if="topic.deadline" class="meta-deadline">
              ⏰ 截止: {{ formatDate(topic.deadline) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 话题图片 -->
      <div v-if="topic.imageUrl" class="detail-image">
        <img :src="topic.imageUrl" :alt="topic.title" />
      </div>

      <!-- 投票区域 -->
      <div class="vote-section">
        <h2 class="section-title">🗳️ 投出你的一票</h2>

        <!-- 随机投票按钮 -->
        <div v-if="!topic.voted && topic.status === 1" class="random-vote">
          <el-button round @click="randomVote" class="random-btn">
            🎲 帮我随机选一个！
          </el-button>
        </div>

        <!-- 选项列表 -->
        <div class="options-grid">
          <div
            v-for="option in topic.options"
            :key="option.id"
            :class="['option-card', {
              selected: selectedOption === option.id,
              voted: topic.voted,
              'is-winner': topic.voted && option.id === topic.votedOptionId
            }]"
            @click="selectOption(option.id)"
          >
            <div class="option-content">
              <span class="option-label">{{ getOptionLabel(option.sortOrder) }}</span>
              <span class="option-text">{{ option.optionText }}</span>
            </div>

            <!-- 投票后显示结果 -->
            <div v-if="topic.voted" class="option-result">
              <div class="result-bar">
                <div class="result-fill" :style="{ width: option.percentage + '%' }"></div>
              </div>
              <span class="result-text">{{ option.percentage }}% ({{ option.voteCount }}票)</span>
            </div>
          </div>
        </div>

        <!-- 投票按钮 -->
        <div v-if="!topic.voted && topic.status === 1" class="vote-action">
          <el-button type="primary" size="large" round :disabled="!selectedOption"
                     :loading="voting" @click="handleVote" class="vote-btn">
            投票 {{ selectedOption ? '✨' : '' }}
          </el-button>
        </div>

        <!-- 已投票提示 -->
        <div v-if="topic.voted" class="voted-hint">
          ✅ 你已经投过票啦~ 看看大家的选择吧！
        </div>

        <!-- 话题已结束 -->
        <div v-if="topic.status !== 1" class="ended-hint">
          这个话题已经结束啦~ 来看看最终结果吧！
        </div>
      </div>

      <!-- 评论区 -->
      <div class="comment-section-wrap">
        <CommentSection :topic-id="topic.id" :comments="comments" @refresh="loadComments" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTopicStore } from '@/stores/topic'
import { useUserStore } from '@/stores/user'
import { getComments } from '@/api/topic'
import { ElMessage } from 'element-plus'
import CommentSection from '@/components/CommentSection.vue'
import router from '@/router'

const route = useRoute()
const topicStore = useTopicStore()
const userStore = useUserStore()

const topic = ref(null)
const comments = ref([])
const loading = ref(true)
const voting = ref(false)
const selectedOption = ref(null)

const topicId = route.params.id

async function loadDetail() {
  loading.value = true
  try {
    topic.value = await topicStore.fetchTopicDetail(topicId)
  } finally {
    loading.value = false
  }
}

async function loadComments() {
  const res = await getComments(topicId)
  comments.value = res.data || []
}

function selectOption(optionId) {
  if (topic.value.voted || topic.value.status !== 1) return
  selectedOption.value = optionId
}

async function handleVote() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录再投票~')
    router.push('/login')
    return
  }
  if (!selectedOption.value) return

  voting.value = true
  try {
    await topicStore.vote(topicId, selectedOption.value)
    ElMessage.success('投票成功~ 🎉')
    await loadDetail()
  } finally {
    voting.value = false
  }
}

function randomVote() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录再投票~')
    router.push('/login')
    return
  }
  const options = topic.value.options
  const randomOption = options[Math.floor(Math.random() * options.length)]
  selectedOption.value = randomOption.id
  ElMessage.success(`命运之手帮你选了: ${randomOption.optionText} 🎲`)
}

function getOptionLabel(index) {
  return 'ABCDEFGHJK'[index] || '?'
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  loadDetail()
  loadComments()
})
</script>

<style lang="scss" scoped>
.topic-detail-page {
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  background: var(--bg-soft);
}

.detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.detail-header {
  background: white;
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 16px;
}

.topic-title {
  font-size: 24px;
  font-weight: 800;
  color: #333;
  margin: 0 0 12px;
}

.topic-desc {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 16px;
}

.topic-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-author {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
}

.meta-divider {
  color: #ddd;
}

.meta-stat, .meta-deadline {
  font-size: 13px;
  color: #999;
}

.detail-image {
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 16px;

  img {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
  }
}

.vote-section {
  background: white;
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px;
}

.random-vote {
  text-align: center;
  margin-bottom: 20px;
}

.random-btn {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  border: none;
  color: white;
  font-weight: 700;
  font-size: 15px;
  padding: 10px 24px;
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-card {
  padding: 16px 20px;
  border: 2px solid #eee;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(.voted) {
    border-color: var(--pink);
    background: var(--pink-light);
  }

  &.selected {
    border-color: var(--pink);
    background: var(--pink-light);
    box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.15);
  }

  &.voted {
    cursor: default;
  }

  &.is-winner {
    border-color: #ffd700;
    background: #fff8e1;
  }
}

.option-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.option-label {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--pink-light);
  color: var(--pink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.option-text {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.option-result {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.result-bar {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.result-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--pink), var(--purple));
  border-radius: 4px;
  transition: width 0.8s ease;
}

.result-text {
  font-size: 13px;
  color: #999;
  white-space: nowrap;
}

.vote-action {
  text-align: center;
  margin-top: 24px;
}

.vote-btn {
  min-width: 200px;
  height: 48px;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #ff6b9d, #c44dff);
  border: none;
}

.voted-hint, .ended-hint {
  text-align: center;
  padding: 16px;
  font-size: 14px;
  color: #888;
  background: var(--bg-soft);
  border-radius: 12px;
  margin-top: 20px;
}

.comment-section-wrap {
  background: white;
  border-radius: 20px;
  padding: 28px;
}
</style>
