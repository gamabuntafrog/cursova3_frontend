import axios from 'axios'
import { useAuthStore } from './stores/auth'

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
})

instance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/api/users/refresh')
    ) {
      originalRequest._retry = true
      try {
        const authStore = useAuthStore()
        const refreshResponse = await instance.post('/api/users/refresh')
        authStore.setToken(refreshResponse.data.token)
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`
        return instance(originalRequest)
      } catch (refreshError) {
        const authStore = useAuthStore()
        authStore.logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    if (
      error.response &&
      error.response.status === 403 &&
      originalRequest.url.includes('/api/users/refresh')
    ) {
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default instance
