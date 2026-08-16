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

export interface BadgeProgress {
  badge: Badge
  is_earned: boolean
  progress: {
    matches: { required: number; current: number }
    in_person: { required: number; current: number }
    away_games: { required: number; current: number }
    streak: { required: number; current: number }
    points: { required: number; current: number }
  }
}
