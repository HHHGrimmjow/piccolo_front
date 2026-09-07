import request from '@/utils/request'

export function getTopics(params) {
  return request.get('/api/topics', { params })
}

export function getTopicDetail(id) {
  return request.get(`/api/topics/${id}/detail`)
}

export function createTopic(data) {
  return request.post('/api/topics', data)
}

export function voteTopic(id, optionId) {
  return request.post(`/api/topics/${id}/vote`, { optionId })
}

export function getVoteHistory() {
  return request.get('/api/topics/my/history')
}

export function closeTopic(id) {
  return request.post(`/api/topics/${id}/close`)
}

// 评论
export function getComments(topicId) {
  return request.get(`/api/topics/${topicId}/comments`)
}

export function addComment(topicId, data) {
  return request.post(`/api/topics/${topicId}/comments`, data)
}
