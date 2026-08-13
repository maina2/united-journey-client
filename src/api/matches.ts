import { apiClient } from './client'
import type { Match, MatchCreate, MatchFilters, Fixture } from '../types'

export const matchesApi = {
  logMatch: (data: MatchCreate) => 
    apiClient.post<Match>('/matches', data),

  getMatches: (filters?: MatchFilters) => 
    apiClient.get<{ items: Match[]; total: number; page: number; limit: number; total_pages: number }>(
      '/matches', 
      { params: filters }
    ),

  getMatch: (matchId: number) => 
    apiClient.get<Match>(`/matches/${matchId}`),

  updateMatch: (matchId: number, data: MatchCreate) => 
    apiClient.put<Match>(`/matches/${matchId}`, data),

  deleteMatch: (matchId: number) => 
    apiClient.delete<{ message: string }>(`/matches/${matchId}`),

  getStats: () => 
    apiClient.get<{
      total_matches: number
      wins: number
      draws: number
      losses: number
      win_percentage: number
      home_matches: number
      away_matches: number
      in_person: number
      watched: number
      grounds_visited: number
      grounds_list: string[]
      top_opponents: Array<{ opponent: string; count: number }>
      current_streak: number
      longest_streak: number
      total_points: number
    }>('/matches/stats'),

  getFixtures: (season?: string) => 
    apiClient.get<Fixture[]>('/fixtures/upcoming', { params: { season } }),

  bulkImport: (matches: MatchCreate[]) => 
    apiClient.post<{ created: number; failed: number; errors: Array<{ index: number; error: string }> }>(
      '/matches/bulk', 
      { matches }
    ),
}
