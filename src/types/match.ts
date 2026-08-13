export interface Match {
  id: number
  user_id: number
  match_date: string
  opponent: string
  competition: string
  competition_id?: number
  score_home: number | null
  score_away: number | null
  result: 'W' | 'D' | 'L' | null
  venue: string
  attendance_type: 'in_person' | 'watched'
  is_home: boolean
  seat_section: string | null
  notes: string | null
  photo_url: string | null
  miles_travelled: number | null
  points_earned: number
  season: string | null
  fixture_id: number | null
  created_at: string
  updated_at: string
}

export interface MatchCreate {
  match_date: string
  opponent: string
  competition: string
  competition_id?: number
  score_home?: number | null
  score_away?: number | null
  venue: string
  attendance_type: 'in_person' | 'watched'
  is_home?: boolean
  seat_section?: string | null
  notes?: string | null
  photo_url?: string | null
  miles_travelled?: number | null
  season?: string | null
  fixture_id?: number | null
}

export interface MatchFilters {
  season?: string
  competition?: string
  attendance_type?: 'in_person' | 'watched'
  result?: 'W' | 'D' | 'L'
  opponent?: string
  start_date?: string
  end_date?: string
  search?: string
  page?: number
  limit?: number
}

export interface Fixture {
  id: number
  match_date: string
  opponent: string
  competition_id: number
  competition_name: string
  venue: string
  is_home: boolean
  season_id: number
  season_name: string
  is_played: boolean
  score_home?: number
  score_away?: number
  result?: string
}
