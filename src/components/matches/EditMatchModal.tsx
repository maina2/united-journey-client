import { useState, useEffect } from 'react'
import { X, Loader2, Check } from 'lucide-react'
import { useUpdateMatch } from '../../hooks/useMatches'
import type { Match, MatchCreate } from '../../types'
import { format } from 'date-fns'

interface EditMatchModalProps {
  match: Match
  onClose: () => void
  onSuccess: () => void
}

export const EditMatchModal = ({ match, onClose, onSuccess }: EditMatchModalProps) => {
  const [formData, setFormData] = useState<Partial<MatchCreate>>({
    match_date: match.match_date,
    opponent: match.opponent,
    competition: match.competition,
    venue: match.venue,
    attendance_type: match.attendance_type,
    is_home: match.is_home,
    score_home: match.score_home,
    score_away: match.score_away,
    seat_section: match.seat_section,
    notes: match.notes,
  })
  const [error, setError] = useState('')
  const updateMatch = useUpdateMatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await updateMatch.mutateAsync({
        id: match.id,
        data: formData as MatchCreate,
      })
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update match')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">Edit Match</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Opponent</label>
              <input
                type="text"
                required
                value={formData.opponent || ''}
                onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Competition</label>
              <select
                value={formData.competition || ''}
                onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent outline-none bg-white"
              >
                <option value="Premier League">Premier League</option>
                <option value="FA Cup">FA Cup</option>
                <option value="Carabao Cup">Carabao Cup</option>
                <option value="UEFA Champions League">UEFA Champions League</option>
                <option value="Friendly">Friendly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Venue</label>
              <input
                type="text"
                required
                value={formData.venue || ''}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Attendance</label>
              <select
                value={formData.attendance_type || 'in_person'}
                onChange={(e) => setFormData({ ...formData, attendance_type: e.target.value as any })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent outline-none bg-white"
              >
                <option value="in_person">🏟️ In Person</option>
                <option value="watched">📺 Watched</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Home/Away</label>
              <select
                value={formData.is_home ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, is_home: e.target.value === 'true' })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent outline-none bg-white"
              >
                <option value="true">🏠 Home</option>
                <option value="false">✈️ Away</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Seat Section</label>
              <input
                type="text"
                placeholder="Optional"
                value={formData.seat_section || ''}
                onChange={(e) => setFormData({ ...formData, seat_section: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Score (Home)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={formData.score_home ?? ''}
                onChange={(e) => setFormData({ ...formData, score_home: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Score (Away)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={formData.score_away ?? ''}
                onChange={(e) => setFormData({ ...formData, score_away: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Points</label>
              <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500">
                {match.points_earned} pts
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
            <textarea
              rows={3}
              placeholder="Match experience..."
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={updateMatch.isPending}
              className="flex-1 bg-[#DA291C] text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {updateMatch.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Check className="w-5 h-5" />
              )}
              {updateMatch.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
