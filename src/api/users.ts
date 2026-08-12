import { apiClient } from './client'
import type { User, UserStats, UserPreferences, UserUpdate, PreferencesUpdate } from '../types'

export const usersApi = {
  // Get current user profile
  getMe: () => 
    apiClient.get<User>('/users/me'),

  // Get user by ID
  getUser: (userId: number) => 
    apiClient.get<User>(`/users/${userId}`),

  // Update current user
  updateMe: (data: UserUpdate) => 
    apiClient.put<User>('/users/me', data),

  // Get user stats
  getStats: () => 
    apiClient.get<UserStats>('/users/me/stats'),

  // Get user preferences
  getPreferences: () => 
    apiClient.get<UserPreferences>('/users/me/preferences'),

  // Update preferences
  updatePreferences: (data: PreferencesUpdate) => 
    apiClient.put<UserPreferences>('/users/me/preferences', data),

  // Upload avatar
  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<{ avatar_url: string }>('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Toggle profile visibility
  toggleVisibility: () => 
    apiClient.post<{ is_public: boolean; message: string }>('/users/me/toggle-visibility'),

  // Check user level
  checkLevel: () => 
    apiClient.post<{ level: { name: string; color: string; description: string; icon_url: string | null } }>(
      '/users/me/check-level'
    ),

  // Delete account
  deleteAccount: () => 
    apiClient.delete<{ message: string }>('/users/me'),
}
