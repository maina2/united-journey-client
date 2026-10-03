import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cardsApi } from '../api/cards'
import type {
  CardGenerateRequest,
  CardSaveRequest,
} from '../types/card'

export const cardKeys = {
  all: ['story-cards'] as const,
  templates: ['story-cards', 'templates'] as const,
  mine: (page: number, limit: number) =>
    ['story-cards', 'mine', page, limit] as const,
  detail: (id: number) => ['story-cards', 'detail', id] as const,
  share: (shareId: string) => ['story-cards', 'share', shareId] as const,
}

export const useCardTemplates = () =>
  useQuery({
    queryKey: cardKeys.templates,
    queryFn: async () => (await cardsApi.getTemplates()).data,
    staleTime: 60 * 60 * 1000,
  })

export const useMyCards = (page = 1, limit = 20) =>
  useQuery({
    queryKey: cardKeys.mine(page, limit),
    queryFn: async () => (await cardsApi.listMine(page, limit)).data,
    staleTime: 60 * 1000,
  })

export const useCard = (cardId: number | null) =>
  useQuery({
    queryKey: cardKeys.detail(cardId ?? 0),
    queryFn: async () => (await cardsApi.getOne(cardId!)).data,
    enabled: !!cardId,
  })

export const useSharedCard = (shareId: string) =>
  useQuery({
    queryKey: cardKeys.share(shareId),
    queryFn: async () => (await cardsApi.getByShareId(shareId)).data,
    enabled: !!shareId && shareId !== 'null' && shareId !== 'undefined',
  })

export const usePreviewCard = () =>
  useMutation({
    mutationFn: (payload: CardGenerateRequest) =>
      cardsApi.preview(payload).then((r) => r.data),
  })

export const useSaveCard = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CardSaveRequest) =>
      cardsApi.create(payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cardKeys.all })
    },
  })
}

export const useToggleCardVisibility = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (cardId: number) =>
      cardsApi.toggleVisibility(cardId).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cardKeys.all })
    },
  })
}

export const useDeleteCard = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (cardId: number) => cardsApi.delete(cardId).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cardKeys.all })
    },
  })
}
