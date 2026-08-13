import { apiClient } from './client'

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
  requirements: {
    points_required: number
    matches_required: number
    in_person_required: number
    streak_required: number
  }
}

export const badgesApi = {
  getMyBadges: () =>
    apiClient.get<{ earned: Badge[]; total: number }>('/badges/me'),

  getAvailableBadges: () =>
    apiClient.get<AvailableBadge[]>('/badges/available'),
}
