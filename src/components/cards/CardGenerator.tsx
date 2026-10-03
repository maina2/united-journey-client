import { useEffect, useMemo, useState } from 'react'
import { useCardTemplates, usePreviewCard, useSaveCard } from '../../hooks/useCards'
import { useMatches } from '../../hooks/useMatches'
import { useToastStore } from '../../stores/toastStore'
import type { CardTemplateId } from '../../types/card'
import { CardTemplate } from './CardTemplate'

interface CardGeneratorProps {
  initialMatchId?: number | null
  onSaved?: () => void
}

export const CardGenerator = ({ initialMatchId = null, onSaved }: CardGeneratorProps) => {
  const { data: templates = [] } = useCardTemplates()
  const { data: matchesData } = useMatches({ limit: 50 })
  const previewMutation = usePreviewCard()
  const saveMutation = useSaveCard()
  const pushToast = useToastStore((s) => s.push)

  const [template, setTemplate] = useState<CardTemplateId>('i_was_there')
  const [matchId, setMatchId] = useState<number | null>(initialMatchId)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [note, setNote] = useState('')
  const [themeColor, setThemeColor] = useState<string>('#DA291C')
  const [isPublic, setIsPublic] = useState(true)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)

  const matches = matchesData?.items ?? []

  const previewPayload = useMemo(
    () => ({
      template,
      match_id: matchId,
      title: title || null,
      subtitle: subtitle || null,
      personal_note: note || null,
      theme_color: themeColor || null,
    }),
    [template, matchId, title, subtitle, note, themeColor]
  )

  // Auto-preview on any change (debounced)
  useEffect(() => {
    const handle = setTimeout(() => {
      previewMutation.mutate(previewPayload, {
        onSuccess: (data) => {
          setPreviewSrc(`data:image/${data.format};base64,${data.image_base64}`)
        },
      })
    }, 500)
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewPayload])

  const handleSave = () => {
    saveMutation.mutate(
      { ...previewPayload, is_public: isPublic },
      {
        onSuccess: () => {
          pushToast({
            type: 'success',
            message: 'Card saved to your gallery!',
          })
          onSaved?.()
          setTitle('')
          setSubtitle('')
          setNote('')
        },
        onError: () => {
          pushToast({ type: 'error', message: 'Failed to save card' })
        },
      }
    )
  }

  const showTitleField = template === 'custom'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left — controls */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-united-gray-700 mb-2">
            Template
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  template === t.id
                    ? 'border-united-red bg-united-red-soft shadow-united-md'
                    : 'border-united-gray-200 bg-white hover:border-united-red/40'
                }`}
                title={t.description}
              >
                <div
                  className="w-8 h-8 rounded-lg mb-2"
                  style={{ backgroundColor: t.preview_color }}
                />
                <div className="text-xs font-semibold text-united-gray-900 leading-tight">
                  {t.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-united-gray-700 mb-2">
            Match
          </label>
          <select
            value={matchId ?? ''}
            onChange={(e) =>
              setMatchId(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full px-4 py-2.5 rounded-xl border border-united-gray-200 focus:border-united-red focus:ring-2 focus:ring-united-red/20 outline-none bg-white"
          >
            <option value="">— No match selected —</option>
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                {m.opponent} · {new Date(m.match_date).toLocaleDateString()}
                {m.score_home != null && m.score_away != null
                  ? ` · ${m.score_home}-${m.score_away}`
                  : ''}
              </option>
            ))}
          </select>
        </div>

        {showTitleField && (
          <>
            <div>
              <label className="block text-sm font-semibold text-united-gray-700 mb-2">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
                placeholder="MY UNITED MOMENT"
                className="w-full px-4 py-2.5 rounded-xl border border-united-gray-200 focus:border-united-red focus:ring-2 focus:ring-united-red/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-united-gray-700 mb-2">
                Subtitle
              </label>
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                maxLength={120}
                placeholder="Optional subtitle"
                className="w-full px-4 py-2.5 rounded-xl border border-united-gray-200 focus:border-united-red focus:ring-2 focus:ring-united-red/20 outline-none"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-semibold text-united-gray-700 mb-2">
            Personal note <span className="text-united-gray-500 font-normal">({note.length}/280)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={280}
            rows={3}
            placeholder="What made this moment special?"
            className="w-full px-4 py-2.5 rounded-xl border border-united-gray-200 focus:border-united-red focus:ring-2 focus:ring-united-red/20 outline-none resize-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-united-gray-700 mb-2">
              Theme color
            </label>
            <input
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value.toUpperCase())}
              className="w-full h-11 rounded-xl cursor-pointer border border-united-gray-200"
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-united-gray-700 mt-6 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 accent-united-red"
            />
            Make public
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="united-btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveMutation.isPending ? 'Saving…' : 'Save to Gallery'}
        </button>
      </div>

      {/* Right — preview */}
      <div className="lg:sticky lg:top-8 self-start">
        <CardTemplate
          template={template}
          imageSrc={previewSrc}
          isLoading={previewMutation.isPending}
        />
        <p className="text-center text-xs text-united-gray-500 mt-4">
          Live preview · 1080 × 1080 PNG
        </p>
      </div>
    </div>
  )
}
