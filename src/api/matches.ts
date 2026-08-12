import { apiClient } from './client'
import type { Match, MatchCreate, MatchFilters, Fixture } from '../types'

export const matchesApi = {
  // Log a match
  logMatch: (data: MatchCreate) => 
    apiClient.post<Match>('/matches', data),

  // Get matches with filters
  getMatches: (filters?: MatchFilters) => 
    apiClient.get<Match[]>('/matches', { params: filters }),

  // Get match by ID
  getMatch: (matchId: number) => 
    apiClient.get<Match>(`/matches/${matchId}`),

  // Update match
  updateMatch: (matchId: number, data: MatchCreate) => 
    apiClient.put<Match>(`/matches/${matchId}`, data),

  // Delete match
  deleteMatch: (matchId: number) => 
    apiClient.delete<{ message: string }>(`/matches/${matchId}`),

  // Get match stats
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

  // Get upcoming fixtures
  getFixtures: (season?: string) => 
    apiClient.get<Fixture[]>('/matches/fixtures', { params: { season } }),
}
