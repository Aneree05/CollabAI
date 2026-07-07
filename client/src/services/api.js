import axios from 'axios'

const configuredBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').trim().replace(/\/$/, '')
const baseURL = configuredBaseUrl.endsWith('/api') ? configuredBaseUrl.slice(0, -4) : configuredBaseUrl

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default api
