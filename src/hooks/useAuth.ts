import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../stores/authStore'
import { authApi } from '../api/auth'
import { usersApi } from '../api/users'
import type { LoginRequest, RegisterRequest } from '../types'

export const authKeys = {
  user: ['user'] as const,
  sessions: ['sessions'] as const,
}

export const useUser = () => {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      const response = await usersApi.getMe()
      return response.data
    },
    enabled: useAuthStore.getState().isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

export const useLogin = () => {
  const { login } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email, password, device_name, device_type }: LoginRequest & { device_name?: string; device_type?: string }) =>
      login(email, password, device_name, device_type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user })
    },
  })
}

export const useRegister = () => {
  const { register } = useAuthStore()

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
  })
}

export const useLogout = () => {
  const { logout } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

export const useSessions = () => {
  return useQuery({
    queryKey: authKeys.sessions,
    queryFn: async () => {
      const response = await authApi.getSessions()
      return response.data
    },
    enabled: useAuthStore.getState().isAuthenticated,
  })
}

export const useRevokeSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: number) => authApi.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.sessions })
    },
  })
}
