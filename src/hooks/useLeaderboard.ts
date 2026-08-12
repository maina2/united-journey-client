import { useQuery } from '@tanstack/react-query'
import { leaderboardsApi } from '../api/leaderboards'

export const leaderboardKeys = {
  global: ['leaderboard', 'global'] as const,
  country: (country?: string) => ['leaderboard', 'country', country] as const,
  season: (season?: string) => ['leaderboard', 'season', season] as const,
  friends: ['leaderboard', 'friends'] as const,
}

export const useGlobalLeaderboard = (limit?: number) => {
  return useQuery({
    queryKey: leaderboardKeys.global,
    queryFn: async () => {
      const response = await leaderboardsApi.getGlobal(limit)
      return response.data
    },
    staleTime: 1 * 60 * 1000,
  })
}

export const useCountryLeaderboard = (country?: string) => {
  return useQuery({
    queryKey: leaderboardKeys.country(country),
    queryFn: async () => {
      const response = await leaderboardsApi.getCountry(country)
      return response.data
    },
    enabled: !!country,
    staleTime: 1 * 60 * 1000,
  })
}

export const useSeasonLeaderboard = (season?: string) => {
  return useQuery({
    queryKey: leaderboardKeys.season(season),
    queryFn: async () => {
      const response = await leaderboardsApi.getSeason(season)
      return response.data
    },
    staleTime: 1 * 60 * 1000,
  })
}
