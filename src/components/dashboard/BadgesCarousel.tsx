import { ShieldCheckIcon } from '@heroicons/react/24/solid'
import { useMyBadges } from '../../hooks/useBadges'

export const BadgesCarousel = () => {
  const { data: badgesData, isLoading } = useMyBadges()

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

  const badges = badgesData?.earned || []

  return (
    <div className="bg-united-white rounded-2xl p-6 border border-united-gray-200 shadow-united-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg text-united-black flex items-center gap-2">
          <ShieldCheckIcon className="w-5 h-5 text-united-gold-dark" />
          Badges Earned
        </h3>
        <span className="text-sm font-medium text-united-gray-500">
          {badges.length} / 10
        </span>
      </div>

      {badges.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-united-gray-400 text-sm">
            No badges earned yet.
          </p>
          <p className="text-united-gray-400 text-xs mt-1">
            Keep logging matches to unlock achievements!
          </p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-united-gray-300">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex-shrink-0 text-center group cursor-default"
              title={badge.description}
            >
              <div className="w-16 h-16 rounded-full bg-united-gray-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200 border-2 border-united-red/10 group-hover:border-united-red/30">
                {badge.icon_url || '🏅'}
              </div>
              <p className="text-xs font-medium text-united-black mt-1 max-w-[64px] truncate">
                {badge.name}
              </p>
              <p className="text-[10px] text-united-gray-400">
                {badge.category}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
