import api from './api'

export const dashboardApi = {
  getAdmin: () => api.get('/api/dashboard/admin'),
}

export const serviceApi = {
  getAll: (params) => api.get('/api/services', { params }),
  getById: (id) => api.get(`/api/services/${id}`),
  create: (payload) => api.post('/api/services', payload),
  update: (id, payload) => api.put(`/api/services/${id}`, payload),
  remove: (id) => api.delete(`/api/services/${id}`),
}

export const projectApi = {
  getAll: () => api.get('/api/projects'),
  getById: (id) => api.get(`/api/projects/${id}`),
  create: (payload) => api.post('/api/projects', payload),
  accept: (id) => api.patch(`/api/projects/${id}/accept`),
  reject: (id) => api.patch(`/api/projects/${id}/reject`),
  updateStatus: (id, payload) => api.patch(`/api/projects/${id}/status`, payload),
}

export const profileApi = {
  get: () => api.get('/api/profile'),
  update: (payload) => api.put('/api/profile', payload),
}

export const aiApi = {
  generateScope: (payload) => api.post('/api/ai/project-scope', payload),
  estimateCost: (payload) => api.post('/api/ai/cost-estimator', payload),
  recommendFreelancers: (payload) => api.post('/api/ai/recommend-freelancers', payload),
}

export const messageApi = {
  getConversation: (projectId) => api.get(`/api/messages/${projectId}`),
  sendMessage: (payload) => api.post('/api/messages', payload),
}

export const fileApi = {
  getProjectFiles: (projectId) => api.get(`/api/files/${projectId}`),
  uploadFile: (formData) => api.post('/api/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
}

export const activityApi = {
  getProjectActivity: (projectId) => api.get(`/api/activity/${projectId}`),
}

export const reviewApi = {
  createReview: (payload) => api.post('/api/reviews', payload),
}
