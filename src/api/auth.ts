import { apiClient } from './client'
import type { User, LoginRequest, RegisterRequest, TokenResponse, Session } from '../types'

export const authApi = {
  // Register a new user
  register: (data: RegisterRequest) => 
    apiClient.post<User>('/auth/register', data),

  // Login user
  login: (data: LoginRequest) => 
    apiClient.post<TokenResponse>('/auth/login', data),

  // Logout current session
  logout: () => 
    apiClient.post<{ message: string }>('/auth/logout'),

  // Logout all sessions
  logoutAll: () => 
    apiClient.post<{ message: string }>('/auth/logout-all'),

  // Refresh token
  refresh: (refreshToken: string) => 
    apiClient.post<TokenResponse>('/auth/refresh', { refresh_token: refreshToken }),

  // Get current user
  getCurrentUser: () => 
    apiClient.get<User>('/auth/me'),

  // Get all sessions
  getSessions: () => 
    apiClient.get<Session[]>('/auth/sessions'),

  // Revoke a session
  revokeSession: (sessionId: number) => 
    apiClient.post<{ message: string }>(`/auth/sessions/${sessionId}/revoke`),

  // Change password
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) =>
    apiClient.post<{ message: string }>('/auth/password/change', {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }),
}
