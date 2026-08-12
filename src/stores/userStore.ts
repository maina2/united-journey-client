import { create } from 'zustand'
import type { User, UserPreferences, UserStats } from '../types'
import { usersApi } from '../api/users'

interface UserState {
  profile: User | null
  stats: UserStats | null
  preferences: UserPreferences | null
  isLoading: boolean
  error: string | null

  fetchProfile: () => Promise<void>
  fetchStats: () => Promise<void>
  fetchPreferences: () => Promise<void>
  updateProfile: (data: any) => Promise<void>
  updatePreferences: (data: any) => Promise<void>
  uploadAvatar: (file: File) => Promise<string>
  toggleVisibility: () => Promise<boolean>
  checkLevel: () => Promise<any>
  deleteAccount: () => Promise<void>
  clear: () => void
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  stats: null,
  preferences: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await usersApi.getMe()
      set({ profile: response.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to load profile', isLoading: false })
      throw error
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await usersApi.getStats()
      set({ stats: response.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to load stats', isLoading: false })
      throw error
    }
  },

  fetchPreferences: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await usersApi.getPreferences()
      set({ preferences: response.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to load preferences', isLoading: false })
      throw error
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await usersApi.updateMe(data)
      set({ profile: response.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to update profile', isLoading: false })
      throw error
    }
  },

  updatePreferences: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await usersApi.updatePreferences(data)
      set({ preferences: response.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to update preferences', isLoading: false })
      throw error
    }
  },

  uploadAvatar: async (file) => {
    set({ isLoading: true, error: null })
    try {
      const response = await usersApi.uploadAvatar(file)
      set({ isLoading: false })
      return response.data.avatar_url
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to upload avatar', isLoading: false })
      throw error
    }
  },

  toggleVisibility: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await usersApi.toggleVisibility()
      set({ isLoading: false })
      return response.data.is_public
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to toggle visibility', isLoading: false })
      throw error
    }
  },

  checkLevel: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await usersApi.checkLevel()
      set({ isLoading: false })
      return response.data.level
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to check level', isLoading: false })
      throw error
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true, error: null })
    try {
      await usersApi.deleteAccount()
      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to delete account', isLoading: false })
      throw error
    }
  },

  clear: () => {
    set({
      profile: null,
      stats: null,
      preferences: null,
      isLoading: false,
      error: null,
    })
  },
}))
