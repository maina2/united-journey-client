import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { matchesApi } from '../api/matches'
import type { MatchCreate, MatchFilters } from '../types'

export const matchKeys = {
  all: ['matches'] as const,
  list: (filters?: MatchFilters) => ['matches', 'list', filters] as const,
  detail: (id: number) => ['matches', 'detail', id] as const,
  stats: ['matches', 'stats'] as const,
  fixtures: ['matches', 'fixtures'] as const,
}

export const useMatches = (filters?: MatchFilters) => {
  return useQuery({
    queryKey: matchKeys.list(filters),
    queryFn: async () => {
      const response = await matchesApi.getMatches(filters)
      return response.data
    },
    staleTime: 2 * 60 * 1000,
  })
}

export const useMatch = (id: number) => {
  return useQuery({
    queryKey: matchKeys.detail(id),
    queryFn: async () => {
      const response = await matchesApi.getMatch(id)
      return response.data
    },
    enabled: !!id,
  })
}

export const useMatchStats = () => {
  return useQuery({
    queryKey: matchKeys.stats,
    queryFn: async () => {
      const response = await matchesApi.getStats()
      return response.data
    },
    staleTime: 2 * 60 * 1000,
  })
}

export const useFixtures = (season?: string) => {
  return useQuery({
    queryKey: matchKeys.fixtures,
    queryFn: async () => {
      const response = await matchesApi.getFixtures(season)
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useLogMatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: MatchCreate) => matchesApi.logMatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchKeys.all })
      queryClient.invalidateQueries({ queryKey: matchKeys.stats })
    },
  })
}

export const useUpdateMatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MatchCreate }) =>
      matchesApi.updateMatch(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: matchKeys.all })
      queryClient.invalidateQueries({ queryKey: matchKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: matchKeys.stats })
    },
  })
}

export const useDeleteMatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => matchesApi.deleteMatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchKeys.all })
      queryClient.invalidateQueries({ queryKey: matchKeys.stats })
    },
  })
}

export const useBulkImportMatches = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (matches: MatchCreate[]) => matchesApi.bulkImport(matches),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matchKeys.all })
      queryClient.invalidateQueries({ queryKey: matchKeys.stats })
    },
  })
}

export const useUpcomingWindows = () => {
  return useQuery({
    queryKey: ['matches', 'upcoming-windows'],
    queryFn: async () => {
      const response = await matchesApi.getUpcomingWindows()
      return response.data
    },
    staleTime: 30 * 1000, // Refresh every 30 seconds
    refetchInterval: 30000,
  })
}

export const useWindowStatus = (fixtureId: number) => {
  return useQuery({
    queryKey: ['matches', 'window-status', fixtureId],
    queryFn: async () => {
      const response = await matchesApi.getWindowStatus(fixtureId)
      return response.data
    },
    enabled: !!fixtureId,
    staleTime: 10 * 1000,
    refetchInterval: 10000,
  })
}

export const useLogAttendance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ fixtureId, attendance_type, notes }: { fixtureId: number; attendance_type: 'in_person' | 'watched'; notes?: string }) =>
      matchesApi.logAttendance(fixtureId, attendance_type, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches', 'upcoming-windows'] })
      queryClient.invalidateQueries({ queryKey: matchKeys.all })
      queryClient.invalidateQueries({ queryKey: matchKeys.stats })
    },
  })
}
