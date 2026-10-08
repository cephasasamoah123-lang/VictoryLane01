import axios from 'axios'
import useAuthStore from '../store/authStore'

// In development, Vite proxy forwards /api to localhost:5000
// In production the storefront and API share one Render origin by default.
const API_BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || '/api')
  : '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 responses (auto-logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { isAuthenticated } = useAuthStore.getState()
      if (isAuthenticated) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Resolve image URLs - uploaded images (/uploads/...) need the backend base URL in production
export function getImageUrl(url) {
  if (!url) return ''
  // Already an absolute URL (Unsplash, etc.)
  if (url.startsWith('http')) return url
  // Relative /uploads/ path - prefix with backend URL in production
  if (url.startsWith('/uploads')) {
    const backendBase = import.meta.env.PROD
      ? (import.meta.env.VITE_API_URL || '').replace(/\/api$/, '')
      : 'http://localhost:5000'
    return `${backendBase}${url}`
  }
  return url
}

export default api
