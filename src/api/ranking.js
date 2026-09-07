import request from '@/utils/request'

export function getRankings() {
  return request.get('/api/rankings')
}
