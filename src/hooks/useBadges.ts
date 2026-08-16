import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export interface Badge {
  id: number
  name: string
  description: string
  icon_url: string | null
  category: string
  earned_at?: string
}

export interface AvailableBadge extends Badge {
  is_earned: boolean
  progress_percentage: number
  progress: {
    matches_required: number | null
    matches_current: number | null
    in_person_required: number | null
    in_person_current: number | null
    away_games_required: number | null
    away_games_current: number | null
    streak_required: number | null
    streak_current: number | null
    points_required: number | null
    points_current: number | null
  }
  requirements: {
    matches_required: number | null
    in_person_required: number | null
    away_games_required: number | null
    streak_required: number | null
    points_required: number | null
  }
}

export const badgeKeys = {
  all: ['badges'] as const,
  my: ['badges', 'my'] as const,
  available: ['badges', 'available'] as const,
  progress: (id: number) => ['badges', 'progress', id] as const,
}

export const useMyBadges = () => {
  return useQuery({
    queryKey: badgeKeys.my,
    queryFn: async () => {
      const response = await apiClient.get<{ earned: Badge[]; total: number }>('/badges/me')
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useAvailableBadges = () => {
  return useQuery({
    queryKey: badgeKeys.available,
    queryFn: async () => {
      const response = await apiClient.get<AvailableBadge[]>('/badges/available')
      // Ensure progress_percentage is a number
      const data = response.data || []
      return data.map((badge: any) => ({
        ...badge,
        progress_percentage: badge.progress_percentage || 0,
        progress: badge.progress || {},
        requirements: badge.requirements || {},
      }))
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useBadgeProgress = (badgeId: number) => {
  return useQuery({
    queryKey: badgeKeys.progress(badgeId),
    queryFn: async () => {
      const response = await apiClient.get(`/badges/progress/${badgeId}`)
      return response.data
    },
    enabled: !!badgeId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCheckBadges = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/badges/check')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: badgeKeys.my })
      queryClient.invalidateQueries({ queryKey: badgeKeys.available })
    },
  })
}
