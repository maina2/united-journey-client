import { X, Lock, CheckCircle, TrendingUp, Trophy, Flame, MapPin, Star } from 'lucide-react'
import type { AvailableBadge } from '../../types'

interface BadgeDetailModalProps {
  badge: AvailableBadge
  onClose: () => void
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'attendance': return <MapPin className="w-4 h-4" />
    case 'loyalty': return <Flame className="w-4 h-4" />
    case 'achievement': return <Trophy className="w-4 h-4" />
    case 'special': return <Star className="w-4 h-4" />
    default: return <TrendingUp className="w-4 h-4" />
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'attendance': return 'bg-blue-500/10 text-blue-600 border-blue-200'
    case 'loyalty': return 'bg-amber-500/10 text-amber-600 border-amber-200'
    case 'achievement': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
    case 'special': return 'bg-united-red/10 text-united-red border-united-red/20'
    default: return 'bg-united-gray-100 text-united-gray-600 border-united-gray-200'
  }
}

const ProgressBar = ({ current, required, label }: { current: number; required: number; label: string }) => {
  const percentage = Math.min((current / required) * 100, 100)
  const isComplete = current >= required

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-united-gray-600">{label}</span>
        <span className="font-medium text-united-black">
          {isComplete ? (
            <span className="text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Complete
            </span>
          ) : (
            `${current} / ${required}`
          )}
        </span>
      </div>
      <div className="w-full bg-united-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isComplete ? 'bg-emerald-500' : 'bg-united-red'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export const BadgeDetailModal = ({ badge, onClose }: BadgeDetailModalProps) => {
  const hasRequirements = badge.requirements.matches_required || 
    badge.requirements.in_person_required || 
    badge.requirements.away_games_required || 
    badge.requirements.streak_required || 
    badge.requirements.points_required

  return (
    <div className="fixed inset-0 bg-united-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div 
        className="bg-united-charcoal rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-united-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-united-white/10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-united-white/5 flex items-center justify-center text-4xl border border-united-white/10">
              {badge.icon_url || '🏅'}
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-united-white">{badge.name}</h3>
              <p className="text-xs text-united-white/40 flex items-center gap-1">
                {getCategoryIcon(badge.category)}
                <span className="capitalize">{badge.category}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-united-white/10 rounded-lg transition-colors text-united-white/40 hover:text-united-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {badge.is_earned ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="w-3.5 h-3.5" />
                Earned
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-united-white/5 text-united-white/40 border border-united-white/10">
                <Lock className="w-3.5 h-3.5" />
                Locked
              </span>
            )}
            <span className={`text-xs px-3 py-1 rounded-full font-medium border ${getCategoryColor(badge.category)}`}>
              {badge.category}
            </span>
            {badge.progress_percentage > 0 && !badge.is_earned && (
              <span className="text-xs font-medium text-united-white/40">
                {Math.round(badge.progress_percentage)}% complete
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-united-white/70">{badge.description}</p>
          </div>

          {/* Requirements */}
          {hasRequirements && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-united-white">Requirements</h4>
              <div className="space-y-2">
                {badge.requirements.matches_required && (
                  <ProgressBar
                    current={badge.progress.matches_current || 0}
                    required={badge.requirements.matches_required}
                    label="Matches Attended"
                  />
                )}
                {badge.requirements.in_person_required && (
                  <ProgressBar
                    current={badge.progress.in_person_current || 0}
                    required={badge.requirements.in_person_required}
                    label="In Person"
                  />
                )}
                {badge.requirements.away_games_required && (
                  <ProgressBar
                    current={badge.progress.away_games_current || 0}
                    required={badge.requirements.away_games_required}
                    label="Away Games"
                  />
                )}
                {badge.requirements.streak_required && (
                  <ProgressBar
                    current={badge.progress.streak_current || 0}
                    required={badge.requirements.streak_required}
                    label="Consecutive Streak"
                  />
                )}
                {badge.requirements.points_required && (
                  <ProgressBar
                    current={badge.progress.points_current || 0}
                    required={badge.requirements.points_required}
                    label="Points"
                  />
                )}
              </div>
            </div>
          )}

          {badge.is_earned && badge.earned_at && (
            <div className="pt-3 border-t border-united-white/10">
              <p className="text-xs text-united-white/40">
                Earned on {new Date(badge.earned_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
