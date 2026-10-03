import { apiClient } from './client'
import type {
  CardGenerateRequest,
  CardPreviewResponse,
  CardSaveRequest,
  CardTemplateInfo,
  StoryCardDetail,
  StoryCardListResponse,
} from '../types/card'

export const cardsApi = {
  getTemplates: () => apiClient.get<CardTemplateInfo[]>('/story-cards/templates'),

  preview: (payload: CardGenerateRequest) =>
    apiClient.post<CardPreviewResponse>('/story-cards/preview', payload),

  create: (payload: CardSaveRequest) =>
    apiClient.post<StoryCardDetail>('/story-cards', payload),

  listMine: (page = 1, limit = 20) =>
    apiClient.get<StoryCardListResponse>('/story-cards/me', {
      params: { page, limit },
    }),

  getOne: (cardId: number) =>
    apiClient.get<StoryCardDetail>(`/story-cards/${cardId}`),

  getByShareId: (shareId: string) =>
    apiClient.get<StoryCardDetail>(`/story-cards/share/${shareId}`),

  toggleVisibility: (cardId: number) =>
    apiClient.post<{ id: number; is_public: boolean; message: string }>(
      `/story-cards/${cardId}/toggle-visibility`
    ),

  delete: (cardId: number) =>
    apiClient.delete<{ message: string }>(`/story-cards/${cardId}`),

  downloadUrl: (cardId: number) =>
    `${apiClient.defaults.baseURL}/story-cards/${cardId}/download`,
}
