import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/users'
import type { UserUpdate, PreferencesUpdate } from '../types'

export const userKeys = {
  profile: ['user', 'profile'] as const,
  stats: ['user', 'stats'] as const,
  preferences: ['user', 'preferences'] as const,
}

export const useUserProfile = () => {
  return useQuery({
    queryKey: userKeys.profile,
    queryFn: async () => {
      const response = await usersApi.getMe()
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  })
}

export const useUserStats = () => {
  return useQuery({
    queryKey: userKeys.stats,
    queryFn: async () => {
      const response = await usersApi.getStats()
      return response.data
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  })
}

export const useUserPreferences = () => {
  return useQuery({
    queryKey: userKeys.preferences,
    queryFn: async () => {
      const response = await usersApi.getPreferences()
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UserUpdate) => usersApi.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile })
    },
  })
}

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PreferencesUpdate) => usersApi.updatePreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.preferences })
    },
  })
}

export const useUploadAvatar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => usersApi.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile })
    },
  })
}

export const useToggleVisibility = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => usersApi.toggleVisibility(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile })
    },
  })
}

export const useCheckLevel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => usersApi.checkLevel(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile })
    },
  })
}
