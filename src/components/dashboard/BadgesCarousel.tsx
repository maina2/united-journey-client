import { useState } from 'react'
import { ShieldCheckIcon } from '@heroicons/react/24/solid'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useMyBadges, useAvailableBadges } from '../../hooks/useBadges'
import { BadgeDetailModal } from '../badges/BadgeDetailModal'
import { Link } from 'react-router-dom'

export const BadgesCarousel = () => {
  const { data: badgesData, isLoading } = useMyBadges()
  const { data: availableBadges } = useAvailableBadges()
  const [selectedBadge, setSelectedBadge] = useState<any>(null)

  if (isLoading) {
    return (
      <div className="bg-united-white rounded-2xl p-6 border border-united-gray-200 shadow-united-sm animate-pulse">
        <div className="h-6 w-32 bg-united-gray-200 rounded mb-4" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-16 h-16 bg-united-gray-200 rounded-full" />
          ))}
        </div>
      </div>
    )
  }

  const earnedBadges = badgesData?.earned || []
  const totalBadges = availableBadges?.length || 0

  return (
    <div className="bg-united-white rounded-2xl p-6 border border-united-gray-200 shadow-united-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="w-5 h-5 text-united-gold-dark" />
          <h3 className="font-serif text-lg text-united-black">Badges Earned</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-united-gray-500">
            {earnedBadges.length} / {totalBadges}
          </span>
          <Link
            to="/badges"
            className="text-sm font-medium text-united-red hover:text-red-700 transition-colors flex items-center gap-0.5"
          >
            View All
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {earnedBadges.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 bg-united-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldCheckIcon className="w-7 h-7 text-united-gray-300" />
          </div>
          <p className="text-united-gray-400 text-sm font-medium">No badges earned yet.</p>
          <p className="text-united-gray-400 text-xs mt-1">
            Keep logging matches to unlock achievements!
          </p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-united-gray-300">
          {earnedBadges.map((badge) => {
            const fullBadge = availableBadges?.find((b: any) => b.id === badge.id)
            return (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(fullBadge || badge)}
                className="flex-shrink-0 text-center group cursor-pointer"
                title={badge.description}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-united-red/10 to-united-red/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200 border-2 border-united-red/30 group-hover:border-united-red shadow-sm group-hover:shadow-md">
                  {badge.icon_url || '🏅'}
                </div>
                <p className="text-xs font-medium text-united-black mt-1 max-w-[64px] truncate">
                  {badge.name}
                </p>
                <p className="text-[10px] text-united-gray-400 capitalize">
                  {badge.category}
                </p>
              </button>
            )
          })}
        </div>
      )}

      {/* Progress Preview */}
      {availableBadges && availableBadges.length > 0 && earnedBadges.length > 0 && (
        <div className="mt-4 pt-4 border-t border-united-gray-100">
          <p className="text-xs text-united-gray-500">Next badge progress</p>
          <div className="mt-2 space-y-1.5">
            {availableBadges
              .filter((b: any) => !b.is_earned && b.progress_percentage > 0)
              .slice(0, 2)
              .map((badge: any) => (
                <div key={badge.id} className="flex items-center gap-2">
                  <span className="text-sm">{badge.icon_url || '🏅'}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-united-gray-600 truncate max-w-[100px]">{badge.name}</span>
                      <span className="text-united-gray-400">{Math.round(badge.progress_percentage)}%</span>
                    </div>
                    <div className="w-full bg-united-gray-200 rounded-full h-1">
                      <div
                        className="bg-united-red h-1 rounded-full transition-all duration-700"
                        style={{ width: `${badge.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <BadgeDetailModal
          badge={selectedBadge}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </div>
  )
}
