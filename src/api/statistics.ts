import { apiClient } from './client'

export interface DashboardSummary {
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
  miles_travelled: number
  competition_breakdown: Array<{ competition: string; count: number }>
}

export interface SeasonBreakdown {
  season: string
  total: number
  wins: number
  draws: number
  losses: number
  in_person: number
  points: number
  win_percentage: number
}

export interface StreakPoint {
  date: string
  opponent: string
  streak: number
}

export interface PerformancePoint {
  date: string
  opponent: string
  result: 'W' | 'D' | 'L'
  running_win_percentage: number
  match_number: number
}

export interface PointsHistoryPoint {
  date: string
  opponent: string
  points_earned: number
  running_total: number
}

export interface RankData {
  global_rank: number | null
  total_users: number
  country_rank: number | null
  country: string | null
}

export const statisticsApi = {
  getDashboard: () =>
    apiClient.get<DashboardSummary>('/statistics/dashboard'),

  getSeasons: () =>
    apiClient.get<SeasonBreakdown[]>('/statistics/seasons'),

  getStreakTimeline: () =>
    apiClient.get<StreakPoint[]>('/statistics/streak-timeline'),

  getPerformanceTimeline: () =>
    apiClient.get<PerformancePoint[]>('/statistics/performance-timeline'),

  getPointsHistory: () =>
    apiClient.get<PointsHistoryPoint[]>('/statistics/points-history'),

  getRank: () =>
    apiClient.get<RankData>('/statistics/rank'),
}
