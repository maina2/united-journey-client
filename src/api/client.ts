import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from '../types/api'
import type { TokenResponse } from '../types'
import { useAuthStore } from '../stores/authStore'

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/v1'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Single-flight guard: if several requests 401 at the same moment, they all
// await this ONE refresh call instead of each firing their own. This also
// avoids failing extra refresh attempts on a token that a sibling request
// already rotated.
let refreshPromise: Promise<string> | null = null

async function performRefresh(): Promise<string> {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) {
    throw new Error('No refresh token')
  }

  const response = await axios.post<TokenResponse>(`${BASE_URL}/auth/refresh`, {
    refresh_token: refreshToken,
  })

  // Route through the store's setTokens so the reactive zustand state (and
  // its persisted copy) stay in sync — not just the raw localStorage keys.
  // Pass the full response through; TokenResponse carries more than just
  // the two token strings (token_type, expires_in, etc.), and setTokens
  // is typed to expect the whole shape.
  useAuthStore.getState().setTokens(response.data)

  return response.data.access_token
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomRequestConfig

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        if (!refreshPromise) {
          refreshPromise = performRefresh().finally(() => {
            refreshPromise = null
          })
        }
        const newAccessToken = await refreshPromise

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch {
        // Clear the actual source of truth (this also correctly rewrites
        // the persisted `auth-storage` blob), not just raw localStorage keys.
        useAuthStore.getState().clear()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError
    if (data?.detail) {
      return data.detail
    }
    if (error.message) {
      return error.message
    }
  }
  return 'An unexpected error occurred'
}