<template>
  <div class="topic-card" @click="$router.push(`/topic/${topic.id}`)">
    <!-- 图片 -->
    <div v-if="topic.imageUrl" class="card-image">
      <img :src="topic.imageUrl" :alt="topic.title" />
    </div>

    <!-- 内容 -->
    <div class="card-body">
      <h3 class="card-title">{{ topic.title }}</h3>
      <p v-if="topic.description" class="card-desc">{{ topic.description }}</p>

      <!-- 选项预览 -->
      <div class="card-options">
        <span class="option-tag" v-for="i in Math.min(topic.optionCount || 4, 4)" :key="i">
          {{ getOptionEmoji(i - 1) }}
        </span>
        <span class="option-count">{{ topic.optionCount || '?' }}个选项</span>
      </div>

      <!-- 底部信息 -->
      <div class="card-footer">
        <div class="card-stats">
          <span class="stat">
            <el-icon><View /></el-icon> {{ topic.viewCount || 0 }}
          </span>
          <span class="stat">
            <el-icon><ChatDotRound /></el-icon> {{ topic.commentCount || 0 }}
          </span>
          <span class="stat vote-stat">
            <el-icon><DataLine /></el-icon> {{ topic.voteCount || 0 }}票
          </span>
        </div>
        <div class="card-author" @click.stop="$router.push(`/user/${topic.creatorId}`)">
          <el-avatar :size="20" :src="topic.creatorAvatar">
            {{ topic.creatorName?.charAt(0) }}
          </el-avatar>
          <span>{{ topic.creatorName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  topic: { type: Object, required: true }
})

const optionEmojis = ['🅰️', '🅱️', '🅲️', '🅳️', '🅴️', '🅵️', '🅶️', '🅷️', '🅸️', '🅹️']

function getOptionEmoji(index) {
  return optionEmojis[index] || '⬜'
}
</script>

<style lang="scss" scoped>
.topic-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  box-shadow: 0 2px 12px rgba(255, 107, 157, 0.08);

  &:hover {
    transform: translateY(-6px);
    border-color: var(--pink-light);
    box-shadow: 0 12px 32px rgba(255, 107, 157, 0.15);
  }
}

.card-image {
  width: 100%;
  height: 180px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  .topic-card:hover & img {
    transform: scale(1.05);
  }
}

.card-body {
  padding: 16px 20px 20px;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-desc {
  font-size: 13px;
  color: #999;
  margin: 0 0 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-options {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
}

.option-tag {
  font-size: 16px;
}

.option-count {
  font-size: 12px;
  color: #aaa;
  margin-left: 4px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-stats {
  display: flex;
  gap: 12px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: #999;

  .el-icon {
    font-size: 14px;
  }

  &.vote-stat {
    color: var(--pink);
    font-weight: 600;
  }
}

.card-author {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #999;
  cursor: pointer;
  border-radius: 12px;
  padding: 2px 6px;
  transition: all 0.2s;

  &:hover {
    color: var(--pink);
    background: var(--pink-light);
  }
}
</style>
