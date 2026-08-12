export interface User {
  id: number
  email: string
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  country: string | null
  city: string | null
  is_public: boolean
  is_verified: boolean
  is_admin: boolean
  total_points: number
  total_matches: number
  current_streak: number
  longest_streak: number
  wins: number
  draws: number
  losses: number
  grounds_visited: number
  current_level: {
    name: string
    color: string
    icon_url: string | null
    description: string
  } | null
  created_at: string
  updated_at: string
}

export interface UserStats {
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
}

export interface LoginRequest {
  email: string
  password: string
  device_name?: string
  device_type?: string
}

export interface RegisterRequest {
  email: string
  username: string
  full_name?: string
  password: string
  confirm_password: string
  country?: string
  city?: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface Session {
  id: number
  device: string | null
  device_name: string | null
  device_type: string | null
  ip_address: string | null
  is_active: boolean
  expires_at: string
  created_at: string
  last_activity: string
}
