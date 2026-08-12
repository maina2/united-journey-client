export interface UserPreferences {
  notifications_enabled: boolean
  email_updates: boolean
  push_notifications: boolean
  profile_public: boolean
  show_email: boolean
  show_country: boolean
  show_activity: boolean
  theme: 'light' | 'dark' | 'united'
  language: 'en' | 'es' | 'fr' | 'de' | 'zh'
  marketing_emails: boolean
  match_reminders: boolean
  season_updates: boolean
}

export interface UserUpdate {
  full_name?: string
  username?: string
  bio?: string
  country?: string
  city?: string
  avatar_url?: string
  is_public?: boolean
}

export interface PreferencesUpdate {
  notifications_enabled?: boolean
  email_updates?: boolean
  push_notifications?: boolean
  profile_public?: boolean
  show_email?: boolean
  show_country?: boolean
  show_activity?: boolean
  theme?: string
  language?: string
  marketing_emails?: boolean
  match_reminders?: boolean
  season_updates?: boolean
}
