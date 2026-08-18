import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { wrappedApi } from '../api/wrapped'
import type { WrappedData, WrappedResponse, WrappedHistoryItem } from '../api/wrapped'

export const wrappedKeys = {
  all: ['wrapped'] as const,
  history: ['wrapped', 'history'] as const,
  detail: (shareId: string) => ['wrapped', 'detail', shareId] as const,
}

export const useWrappedHistory = () => {
  return useQuery({
    queryKey: wrappedKeys.history,
    queryFn: async () => {
      const response = await wrappedApi.getMyHistory()
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useWrapped = (shareId: string) => {
  return useQuery({
    queryKey: wrappedKeys.detail(shareId),
    queryFn: async () => {
      if (!shareId) return null
      const response = await wrappedApi.getByShareId(shareId)
      return response.data
    },
    enabled: !!shareId && shareId !== 'null' && shareId !== 'undefined',
    staleTime: 10 * 60 * 1000,
  })
}

export const useGenerateWrapped = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (seasonId?: number) => wrappedApi.generate(seasonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wrappedKeys.history })
    },
  })
}

export const useToggleWrappedVisibility = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (wrappedId: number) => wrappedApi.toggleVisibility(wrappedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wrappedKeys.history })
    },
  })
}

export const useDeleteWrapped = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (wrappedId: number) => wrappedApi.delete(wrappedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wrappedKeys.history })
    },
  })
}
