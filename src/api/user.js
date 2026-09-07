import request from '@/utils/request'

export function getUserInfo(id) {
  return request.get(`/api/users/${id}`)
}

export function updateProfile(data) {
  return request.put('/api/users/me', data)
}

export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
