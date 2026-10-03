export type CardTemplateId =
  | 'i_was_there'
  | 'goal_moment'
  | 'clean_sheet'
  | 'debut'
  | 'classic_win'
  | 'away_day'
  | 'european_night'
  | 'custom'

export interface CardTemplateInfo {
  id: CardTemplateId
  name: string
  description: string
  preview_color: string
  requires_score: boolean
  requires_photo: boolean
}

export interface CardGenerateRequest {
  template: CardTemplateId
  match_id?: number | null
  title?: string | null
  subtitle?: string | null
  personal_note?: string | null
  theme_color?: string | null
  use_photo?: boolean
}

export interface CardSaveRequest extends CardGenerateRequest {
  is_public: boolean
}

export interface CardPreviewResponse {
  template: CardTemplateId
  image_base64: string
  width: number
  height: number
  format: string
}

export interface StoryCard {
  id: number
  user_id: number
  match_id: number | null
  template: CardTemplateId
  title: string | null
  subtitle: string | null
  personal_note: string | null
  theme_color: string | null
  image_url: string | null
  share_id: string | null
  is_public: boolean
  width: number
  height: number
  format: string
  created_at: string
  updated_at: string
}

export interface StoryCardDetail extends StoryCard {
  render_data: Record<string, unknown>
}

export interface StoryCardListResponse {
  items: StoryCard[]
  total: number
  page: number
  limit: number
  total_pages: number
}
