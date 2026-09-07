<template>
  <div class="comment-section">
    <h3 class="section-title">💬 评论区 ({{ comments.length }})</h3>

    <!-- 发表评论 -->
    <div class="comment-input" v-if="userStore.isLoggedIn">
      <el-avatar :size="36" :src="userStore.userInfo?.avatar">
        {{ userStore.userInfo?.nickname?.charAt(0) }}
      </el-avatar>
      <div class="input-wrap">
        <el-input
          v-model="commentText"
          placeholder="说点什么吧~"
          :maxlength="500"
          show-word-limit
          @keyup.enter="submitComment"
        />
        <el-button type="primary" round size="small" @click="submitComment" :loading="submitting">
          发表
        </el-button>
      </div>
    </div>
    <div v-else class="login-hint">
      <router-link to="/login">登录</router-link> 后才能评论哦~
    </div>

    <!-- 评论列表 -->
    <div class="comment-list">
      <div v-if="comments.length === 0" class="empty-comment">
        还没有评论，快来抢沙发吧~ 🛋️
      </div>

      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <el-avatar :size="32" :src="comment.userAvatar">
          {{ comment.username?.charAt(0) }}
        </el-avatar>
        <div class="comment-body">
          <div class="comment-header">
            <span class="comment-author">{{ comment.username }}</span>
            <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
          </div>
          <p class="comment-content">
            <span v-if="comment.replyToUsername" class="reply-to">
              回复 <span class="reply-name">@{{ comment.replyToUsername }}</span>：
            </span>
            {{ comment.content }}
          </p>
          <div class="comment-actions">
            <span class="action-btn" @click="replyTo(comment)">
              💬 回复
            </span>
          </div>

          <!-- 子评论 -->
          <div v-if="comment.children?.length" class="sub-comments">
            <div v-for="child in comment.children" :key="child.id" class="comment-item sub">
              <el-avatar :size="24" :src="child.userAvatar">
                {{ child.username?.charAt(0) }}
              </el-avatar>
              <div class="comment-body">
                <div class="comment-header">
                  <span class="comment-author">{{ child.username }}</span>
                  <span class="comment-time">{{ formatTime(child.createdAt) }}</span>
                </div>
                <p class="comment-content">
                  <span v-if="child.replyToUsername" class="reply-to">
                    回复 <span class="reply-name">@{{ child.replyToUsername }}</span>：
                  </span>
                  {{ child.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { addComment } from '@/api/topic'
import { ElMessage } from 'element-plus'

const props = defineProps({
  topicId: { type: [Number, String], required: true },
  comments: { type: Array, default: () => [] }
})

const emit = defineEmits(['refresh'])

const userStore = useUserStore()
const commentText = ref('')
const submitting = ref(false)
const replyInfo = ref(null)

async function submitComment() {
  if (!commentText.value.trim()) {
    ElMessage.warning('说点什么再发嘛~')
    return
  }

  submitting.value = true
  try {
    await addComment(props.topicId, {
      content: commentText.value,
      parentId: replyInfo.value?.parentId || 0,
      replyToUserId: replyInfo.value?.userId || null
    })
    commentText.value = ''
    replyInfo.value = null
    ElMessage.success('评论成功~')
    emit('refresh')
  } finally {
    submitting.value = false
  }
}

function replyTo(comment) {
  replyInfo.value = {
    parentId: comment.id,
    userId: comment.userId
  }
  commentText.value = `@${comment.username} `
}

function formatTime(time) {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = (now - date) / 1000

  if (diff < 60) return '刚刚'
  if (diff < 3600) return Math.floor(diff / 60) + '分钟前'
  if (diff < 86400) return Math.floor(diff / 3600) + '小时前'
  if (diff < 604800) return Math.floor(diff / 86400) + '天前'
  return date.toLocaleDateString()
}
</script>

<style lang="scss" scoped>
.section-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
}

.comment-input {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 16px;
  background: var(--bg-soft);
  border-radius: 16px;

  .input-wrap {
    flex: 1;
    display: flex;
    gap: 8px;
    align-items: center;
  }
}

.login-hint {
  text-align: center;
  padding: 20px;
  color: #999;
  background: var(--bg-soft);
  border-radius: 16px;
  margin-bottom: 24px;

  a {
    color: var(--pink);
    font-weight: 600;
  }
}

.empty-comment {
  text-align: center;
  padding: 40px;
  color: #ccc;
  font-size: 14px;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;

  &.sub {
    padding: 8px 0;
    border-bottom: none;
  }
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-author {
  font-weight: 600;
  font-size: 13px;
  color: #333;
}

.comment-time {
  font-size: 12px;
  color: #ccc;
}

.comment-content {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin: 0;
}

.reply-to {
  color: #999;
  .reply-name {
    color: var(--pink);
  }
}

.comment-actions {
  margin-top: 4px;
}

.action-btn {
  font-size: 12px;
  color: #999;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: var(--pink);
  }
}

.sub-comments {
  margin-top: 8px;
  padding: 8px 12px;
  background: var(--bg-soft);
  border-radius: 12px;
}
</style>
