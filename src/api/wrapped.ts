import { apiClient } from './client'

export interface WrappedStats {
  total_matches: number
  wins: number
  draws: number
  losses: number
  win_percentage: number
  total_points: number
  in_person: number
  watched: number
  grounds_visited: number
  grounds_list: string[]
  total_miles: number
  current_streak: number
  longest_streak: number
}

export interface WrappedData {
  season: string
  user: {
    username: string
    full_name: string | null
    avatar_url: string | null
  }
  stats: WrappedStats
  top_opponents: Array<{ opponent: string; count: number }>
  favorite_match: {
    opponent: string
    date: string
    score: string
    points: number
    attendance_type: string
    venue: string
    result: string
  } | null
  badges: Array<{
    name: string
    description: string
    icon_url: string | null
    category: string
  }>
  level: {
    name: string
    color: string
    icon_url: string | null
  } | null
  share_id: string
  generated_at: string
}

export interface WrappedResponse {
  id: number
  share_id: string
  season: string
  data: WrappedData
}

export interface WrappedHistoryItem {
  id: number
  season: string
  share_url: string
  total_matches: number
  total_points: number
  generated_at: string
}

export const wrappedApi = {
  generate: (seasonId?: number) =>
    apiClient.post<WrappedResponse>('/wrapped/generate', null, {
      params: { season_id: seasonId }
    }),

  getByShareId: (shareId: string) =>
    apiClient.get<WrappedData>(`/wrapped/${shareId}`),

  getMyHistory: () =>
    apiClient.get<WrappedHistoryItem[]>('/wrapped/me/history'),

  toggleVisibility: (wrappedId: number) =>
    apiClient.post<{ id: number; is_public: boolean; message: string }>(
      `/wrapped/${wrappedId}/toggle-visibility`
    ),

  delete: (wrappedId: number) =>
    apiClient.delete<{ message: string }>(`/wrapped/${wrappedId}`),
}
