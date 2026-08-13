import { format } from 'date-fns'
import { X, Calendar, MapPin, Trophy, Users, Edit2, Trash2, Clock } from 'lucide-react'
import type { Match } from '../../types'

interface MatchDetailModalProps {
  match: Match
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export const MatchDetailModal = ({ match, onClose, onEdit, onDelete }: MatchDetailModalProps) => {
  const resultColors = {
    W: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    D: 'bg-amber-500/10 text-amber-700 border-amber-200',
    L: 'bg-red-500/10 text-red-700 border-red-200',
  }

  const resultLabels = {
    W: '✅ Win',
    D: '➖ Draw',
    L: '❌ Loss',
  }

  const resultConfig = match.result ? resultColors[match.result as keyof typeof resultColors] : 'bg-gray-100 text-gray-700 border-gray-200'
  const resultLabel = match.result ? resultLabels[match.result as keyof typeof resultLabels] : 'No Result'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">Match Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Result Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${resultConfig}`}>
            <span className="font-semibold">{resultLabel}</span>
          </div>

          {/* Opponent & Score */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{match.opponent}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                {match.competition}
              </p>
            </div>
            {match.score_home !== null && match.score_away !== null ? (
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">
                  {match.is_home ? match.score_home : match.score_away} - {match.is_home ? match.score_away : match.score_home}
                </p>
                <p className="text-xs text-gray-400">{match.is_home ? 'Home' : 'Away'}</p>
              </div>
            ) : (
              <p className="text-gray-400">No score recorded</p>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-medium text-gray-900">{format(new Date(match.match_date), 'dd MMM yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-500">Time</p>
                <p className="font-medium text-gray-900">{format(new Date(match.match_date), 'HH:mm')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-500">Venue</p>
                <p className="font-medium text-gray-900">{match.venue}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-500">Attendance</p>
                <p className="font-medium text-gray-900">
                  {match.attendance_type === 'in_person' ? '🏟️ In Person' : '📺 Watched'}
                  {match.seat_section && ` (${match.seat_section})`}
                </p>
              </div>
            </div>
          </div>

          {/* Points */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Points Earned</span>
            <span className="text-2xl font-bold text-[#DA291C]">{match.points_earned}</span>
          </div>

          {/* Notes */}
          {match.notes && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Personal Notes</p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{match.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={onEdit}
              className="flex-1 bg-[#DA291C] text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Match
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2.5 border border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
