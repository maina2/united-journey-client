import { useQuery } from '@tanstack/react-query'
import type { Badge } from '../api/badges'
import { badgesApi } from '../api/badges'

export const badgeKeys = {
  all: ['badges'] as const,
  my: ['badges', 'my'] as const,
  available: ['badges', 'available'] as const,
}

export const useMyBadges = () => {
  return useQuery({
    queryKey: badgeKeys.my,
    queryFn: async () => {
      const response = await badgesApi.getMyBadges()
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useAvailableBadges = () => {
  return useQuery({
    queryKey: badgeKeys.available,
    queryFn: async () => {
      const response = await badgesApi.getAvailableBadges()
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
