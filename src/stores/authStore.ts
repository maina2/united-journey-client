import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, TokenResponse } from '../types'
import { authApi } from '../api/auth'
import { usersApi } from '../api/users'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string, deviceName?: string, deviceType?: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
  refresh: () => Promise<void>
  loadUser: () => Promise<void>
  setTokens: (tokens: TokenResponse) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password, deviceName, deviceType) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.login({ 
            email, 
            password, 
            device_name: deviceName || 'Web Browser',
            device_type: deviceType || 'Web',
          })
          const data = response.data
          
          localStorage.setItem('access_token', data.access_token)
          localStorage.setItem('refresh_token', data.refresh_token)
          
          set({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            isAuthenticated: true,
            isLoading: false,
          })

          await get().loadUser()
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Login failed',
            isLoading: false,
          })
          throw error
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null })
        try {
          await authApi.register(data)
          set({ isLoading: false })
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Registration failed',
            isLoading: false,
          })
          throw error
        }
      },

      logout: async () => {
        try {
          await authApi.logout()
        } catch {
          // Ignore errors on logout
        } finally {
          get().clear()
        }
      },

      logoutAll: async () => {
        try {
          await authApi.logoutAll()
        } catch {
          // Ignore errors
        } finally {
          get().clear()
        }
      },

      refresh: async () => {
        const refreshToken = get().refreshToken
        if (!refreshToken) {
          get().clear()
          return
        }
        
        try {
          const response = await authApi.refresh(refreshToken)
          const data = response.data
          get().setTokens(data)
          await get().loadUser()
        } catch {
          get().clear()
        }
      },

      loadUser: async () => {
        try {
          const response = await usersApi.getMe()
          const user = response.data
          localStorage.setItem('user', JSON.stringify(user))
          set({ user, isLoading: false })
        } catch (error) {
          set({ error: 'Failed to load user', isLoading: false })
          get().clear()
        }
      },

      setTokens: (tokens) => {
        localStorage.setItem('access_token', tokens.access_token)
        localStorage.setItem('refresh_token', tokens.refresh_token)
        set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          isAuthenticated: true,
        })
      },

      clear: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
