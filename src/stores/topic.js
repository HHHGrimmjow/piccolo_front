import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getTopics, getTopicDetail, createTopic, voteTopic, getVoteHistory } from '@/api/topic'

export const useTopicStore = defineStore('topic', () => {
  const topicList = ref([])
  const currentTopic = ref(null)
  const voteHistory = ref([])
  const total = ref(0)
  const loading = ref(false)

  // 获取话题列表
  async function fetchTopics(params = {}) {
    loading.value = true
    try {
      const res = await getTopics(params)
      topicList.value = res.data.records || []
      total.value = res.data.total || 0
    } finally {
      loading.value = false
    }
  }

  // 获取话题详情
  async function fetchTopicDetail(id) {
    const res = await getTopicDetail(id)
    currentTopic.value = res.data
    return res.data
  }

  // 创建话题
  async function createNewTopic(data) {
    return await createTopic(data)
  }

  // 投票
  async function vote(topicId, optionId) {
    return await voteTopic(topicId, optionId)
  }

  // 获取投票历史
  async function fetchVoteHistory() {
    const res = await getVoteHistory()
    voteHistory.value = res.data || []
    return voteHistory.value
  }

  return {
    topicList,
    currentTopic,
    voteHistory,
    total,
    loading,
    fetchTopics,
    fetchTopicDetail,
    createNewTopic,
    vote,
    fetchVoteHistory
  }
})
