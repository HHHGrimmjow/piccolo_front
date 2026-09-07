<template>
  <div class="ranking-page">
    <div class="ranking-container">
      <div class="ranking-header">
        <h1>🏆 排行榜</h1>
        <p>看看谁是最活跃的投票达人！</p>
      </div>

      <div class="ranking-grid">
        <!-- 热门话题 -->
        <div class="ranking-card">
          <h2 class="card-title">🔥 热门话题 TOP 10</h2>
          <div class="rank-list">
            <div v-for="(topic, index) in rankings.hotTopics" :key="topic.id"
                 class="rank-item" @click="$router.push(`/topic/${topic.id}`)">
              <span :class="['rank-num', `rank-${index + 1}`]">
                {{ index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1 }}
              </span>
              <div class="rank-info">
                <h4>{{ topic.title }}</h4>
                <div class="rank-stats">
                  <span>👤 {{ topic.creatorName }}</span>
                  <span>🗳️ {{ topic.voteCount }}票</span>
                  <span>👀 {{ topic.viewCount }}浏览</span>
                </div>
              </div>
            </div>
            <div v-if="!rankings.hotTopics?.length" class="empty-state">
              暂无数据~
            </div>
          </div>
        </div>

        <!-- 活跃用户 -->
        <div class="ranking-card">
          <h2 class="card-title">⭐ 活跃用户 TOP 10</h2>
          <div class="rank-list">
            <div v-for="(user, index) in rankings.activeUsers" :key="user.id" class="rank-item">
              <span :class="['rank-num', `rank-${index + 1}`]">
                {{ index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1 }}
              </span>
              <div class="rank-info user-info">
                <el-avatar :size="32" :src="user.avatar">
                  {{ user.nickname?.charAt(0) }}
                </el-avatar>
                <div>
                  <h4>{{ user.nickname }}</h4>
                  <span class="user-stat">发起了 {{ user.topicCount }} 个投票</span>
                </div>
              </div>
            </div>
            <div v-if="!rankings.activeUsers?.length" class="empty-state">
              暂无数据~
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRankings } from '@/api/ranking'

const rankings = ref({ hotTopics: [], activeUsers: [] })

async function loadRankings() {
  const res = await getRankings()
  rankings.value = res.data || {}
}

onMounted(() => {
  loadRankings()
})
</script>

<style lang="scss" scoped>
.ranking-page {
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  background: var(--bg-soft);
  padding: 32px 24px;
}

.ranking-container {
  max-width: 1000px;
  margin: 0 auto;
}

.ranking-header {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    font-size: 28px;
    font-weight: 800;
    margin: 0 0 8px;
  }

  p {
    font-size: 15px;
    color: #888;
    margin: 0;
  }
}

.ranking-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.ranking-card {
  background: white;
  border-radius: 24px;
  padding: 28px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px;
}

.rank-list {
  display: flex;
  flex-direction: column;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-soft);
  }
}

.rank-num {
  font-size: 18px;
  font-weight: 800;
  width: 32px;
  text-align: center;
  color: #ccc;

  &.rank-1, &.rank-2, &.rank-3 {
    font-size: 24px;
  }
}

.rank-info {
  flex: 1;

  h4 {
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 4px;
    color: #333;
  }

  .rank-stats {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #999;
  }

  &.user-info {
    display: flex;
    align-items: center;
    gap: 10px;

    h4 {
      margin: 0;
    }

    .user-stat {
      font-size: 12px;
      color: #999;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #ccc;
}
</style>
