import { useState } from 'react'
import { useDeleteCard, useMyCards, useToggleCardVisibility } from '../../hooks/useCards'
import { useToastStore } from '../../stores/toastStore'
import type { StoryCard } from '../../types/card'
import { cardsApi } from '../../api/cards'

interface CardGalleryProps {
  onSelect?: (card: StoryCard) => void
}

export const CardGallery = ({ onSelect }: CardGalleryProps) => {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useMyCards(page, 12)
  const toggleVis = useToggleCardVisibility()
  const deleteCard = useDeleteCard()
  const pushToast = useToastStore((s) => s.push)

  const handleDownload = (card: StoryCard) => {
    // Use fetch to include auth header, then trigger a blob download
    fetch(cardsApi.downloadUrl(card.id), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
      },
    })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `united-card-${card.template}-${card.id}.${card.format}`
        a.click()
        URL.revokeObjectURL(url)
      })
      .catch(() => pushToast({ type: 'error', message: 'Download failed' }))
  }

  const handleShare = async (card: StoryCard) => {
    if (!card.share_id) return
    const url = `${window.location.origin}/cards/share/${card.share_id}`
    try {
      await navigator.clipboard.writeText(url)
      pushToast({ type: 'success', message: 'Share link copied!' })
    } catch {
      pushToast({ type: 'error', message: 'Could not copy link' })
    }
  }

  const handleDelete = (card: StoryCard) => {
    if (!confirm('Delete this card permanently?')) return
    deleteCard.mutate(card.id, {
      onSuccess: () => pushToast({ type: 'success', message: 'Card deleted' }),
    })
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl bg-united-gray-100 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-united-gray-500">
        Failed to load cards.
      </div>
    )
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <div className="text-5xl">🎨</div>
        <h3 className="text-lg font-semibold text-united-gray-900">
          No cards yet
        </h3>
        <p className="text-sm text-united-gray-500">
          Generate your first story card above.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.items.map((card) => (
          <div
            key={card.id}
            className="group relative aspect-square rounded-2xl overflow-hidden shadow-united-md hover:shadow-united-xl transition-all border border-united-gray-100"
          >
            {card.image_url ? (
              <img
                src={card.image_url}
                alt={`${card.template} card`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => onSelect?.(card)}
              />
            ) : (
              <div
                className="w-full h-full bg-gradient-to-br from-united-red to-united-red-dark flex items-center justify-center cursor-pointer"
                onClick={() => onSelect?.(card)}
              >
                <span className="text-white text-xs uppercase tracking-wider">
                  {card.template.replace(/_/g, ' ')}
                </span>
              </div>
            )}

            {!card.is_public && (
              <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                PRIVATE
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-1">
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => handleDownload(card)}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white text-united-gray-900 hover:bg-united-gold transition-colors"
                >
                  ⬇ Save
                </button>
                <button
                  onClick={() => handleShare(card)}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white text-united-gray-900 hover:bg-united-gold transition-colors"
                >
                  🔗 Share
                </button>
                <button
                  onClick={() =>
                    toggleVis.mutate(card.id, {
                      onSuccess: (r) =>
                        pushToast({ type: 'success', message: r.message }),
                    })
                  }
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white/90 text-united-gray-900 hover:bg-white transition-colors"
                >
                  {card.is_public ? '🔒' : '🌐'}
                </button>
                <button
                  onClick={() => handleDelete(card)}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-united-red text-white hover:bg-united-red-dark transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data.total_pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-united-gray-200 text-sm font-medium disabled:opacity-40 hover:border-united-red transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-united-gray-600">
            Page {data.page} of {data.total_pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
            disabled={page === data.total_pages}
            className="px-4 py-2 rounded-xl border border-united-gray-200 text-sm font-medium disabled:opacity-40 hover:border-united-red transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
