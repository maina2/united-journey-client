import { TrophyIcon, UserGroupIcon } from '@heroicons/react/24/solid'
import { useRank } from '../../hooks/useStatistics'

export const RankDisplay = () => {
  const { data: rankData, isLoading } = useRank()

  if (isLoading) {
    return (
      <div className="bg-united-charcoal rounded-2xl p-6 animate-pulse">
        <div className="h-5 w-24 bg-united-white/10 rounded mb-4" />
        <div className="h-8 w-16 bg-united-white/10 rounded mb-2" />
        <div className="h-4 w-32 bg-united-white/10 rounded" />
      </div>
    )
  }

  if (!rankData || rankData.global_rank === null) {
    return (
      <div className="bg-united-charcoal rounded-2xl p-6">
        <h3 className="font-serif text-lg text-united-white mb-1 flex items-center gap-2">
          <TrophyIcon className="w-5 h-5 text-united-gold" />
          Your Rank
        </h3>
        <p className="text-sm text-united-white/30">Log matches to earn a rank</p>
      </div>
    )
  }

  const { global_rank, total_users, country_rank, country } = rankData

  return (
    <div className="bg-united-charcoal rounded-2xl p-6">
      <h3 className="font-serif text-lg text-united-white mb-3 flex items-center gap-2">
        <TrophyIcon className="w-5 h-5 text-united-gold" />
        Your Rank
      </h3>

      {/* Global Rank */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-united-foil">#{global_rank}</span>
        <span className="text-sm text-united-white/40">of {total_users}</span>
        <span className="text-xs text-united-white/20 ml-2">🌍 Global</span>
      </div>

      {/* Progress bar */}
      <div className="mt-2 w-full bg-united-white/10 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-united-foil h-full rounded-full transition-all duration-1000"
          style={{
            width: `${total_users > 0 ? ((total_users - (global_rank || 0)) / total_users) * 100 : 0}%`,
          }}
        />
      </div>
      <p className="text-xs text-united-white/30 mt-1">
        You're in the top{' '}
        {total_users > 0
          ? Math.round(((total_users - (global_rank || 0)) / total_users) * 100)
          : 0}
        %
      </p>

      {/* Country Rank */}
      {country && country_rank !== null && (
        <div className="mt-3 pt-3 border-t border-united-white/10">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-united-white/80">#{country_rank}</span>
            <span className="text-sm text-united-white/40">in {country}</span>
          </div>
        </div>
      )}
    </div>
  )
}
