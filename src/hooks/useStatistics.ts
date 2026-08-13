import { useQuery } from '@tanstack/react-query'
import { statisticsApi } from '../api/statistics'

export const statisticsKeys = {
  dashboard: ['statistics', 'dashboard'] as const,
  seasons: ['statistics', 'seasons'] as const,
  streak: ['statistics', 'streak'] as const,
  performance: ['statistics', 'performance'] as const,
  points: ['statistics', 'points'] as const,
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: statisticsKeys.dashboard,
    queryFn: async () => {
      const response = await statisticsApi.getDashboard()
      return response.data
    },
    staleTime: 2 * 60 * 1000,
  })
}

export const useSeasonBreakdown = () => {
  return useQuery({
    queryKey: statisticsKeys.seasons,
    queryFn: async () => {
      const response = await statisticsApi.getSeasons()
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useStreakTimeline = () => {
  return useQuery({
    queryKey: statisticsKeys.streak,
    queryFn: async () => {
      const response = await statisticsApi.getStreakTimeline()
      return response.data
    },
    staleTime: 2 * 60 * 1000,
  })
}

export const usePerformanceTimeline = () => {
  return useQuery({
    queryKey: statisticsKeys.performance,
    queryFn: async () => {
      const response = await statisticsApi.getPerformanceTimeline()
      return response.data
    },
    staleTime: 2 * 60 * 1000,
  })
}

export const usePointsHistory = () => {
  return useQuery({
    queryKey: statisticsKeys.points,
    queryFn: async () => {
      const response = await statisticsApi.getPointsHistory()
      return response.data
    },
    staleTime: 2 * 60 * 1000,
  })
}

export const useRank = () => {
  return useQuery({
    queryKey: ['statistics', 'rank'],
    queryFn: async () => {
      const response = await statisticsApi.getRank()
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
