<template>
  <div class="home-page">
    <!-- 顶部横幅 -->
    <div class="hero-banner">
      <div class="hero-content">
        <h1>选择困难？<span class="highlight">Piccolo</span> 帮你！</h1>
        <p>发起投票，让朋友们帮你做决定 ✨</p>
      </div>
    </div>

    <div class="home-container">
      <!-- 搜索和筛选 -->
      <div class="filter-bar">
        <el-input
          v-model="keyword"
          placeholder="搜索话题..."
          prefix-icon="Search"
          clearable
          class="search-input"
          @keyup.enter="loadTopics"
          @clear="loadTopics"
        />
        <div class="sort-tabs">
          <span :class="['sort-tab', { active: sort === 'latest' }]" @click="changeSort('latest')">
            🕐 最新
          </span>
          <span :class="['sort-tab', { active: sort === 'hot' }]" @click="changeSort('hot')">
            🔥 热门
          </span>
        </div>
      </div>

      <!-- 话题列表 -->
      <div v-loading="loading" class="topic-grid">
        <TopicCard v-for="topic in topicList" :key="topic.id" :topic="topic" />
      </div>

      <el-empty v-if="!loading && topicList.length === 0" description="还没有话题，快来发起第一个吧~ 🎲" />

      <!-- 分页 -->
      <div class="pagination-wrap" v-if="total > pageSize">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          v-model:current-page="currentPage"
          @current-change="loadTopics"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTopicStore } from '@/stores/topic'
import TopicCard from '@/components/TopicCard.vue'

const topicStore = useTopicStore()

const topicList = ref([])
const total = ref(0)
const loading = ref(false)
const keyword = ref('')
const sort = ref('latest')
const currentPage = ref(1)
const pageSize = 12

async function loadTopics() {
  loading.value = true
  try {
    const res = await topicStore.fetchTopics({
      page: currentPage.value,
      size: pageSize,
      sort: sort.value,
      keyword: keyword.value || undefined
    })
    topicList.value = topicStore.topicList
    total.value = topicStore.total
  } finally {
    loading.value = false
  }
}

function changeSort(newSort) {
  sort.value = newSort
  currentPage.value = 1
  loadTopics()
}

onMounted(() => {
  loadTopics()
})
</script>

<style lang="scss" scoped>
.hero-banner {
  background: linear-gradient(135deg, #ff6b9d22, #c44dff22, #6b9dff22);
  padding: 40px 24px 30px;
  text-align: center;
  margin-top: 64px;
}

.hero-content {
  h1 {
    font-size: 28px;
    font-weight: 800;
    color: #333;
    margin: 0 0 8px;
  }

  .highlight {
    background: linear-gradient(135deg, #ff6b9d, #c44dff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 15px;
    color: #888;
    margin: 0;
  }
}

.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-input {
  max-width: 360px;

  :deep(.el-input__wrapper) {
    border-radius: 20px;
  }
}

.sort-tabs {
  display: flex;
  gap: 8px;
}

.sort-tab {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--pink-light);
  }

  &.active {
    background: var(--pink);
    color: white;
  }
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .hero-banner {
    padding: 28px 16px 20px;
  }

  .hero-content h1 {
    font-size: 20px;
  }

  .hero-content p {
    font-size: 13px;
  }

  .home-container {
    padding: 16px;
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    max-width: 100%;
  }

  .sort-tabs {
    justify-content: center;
  }

  .topic-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
