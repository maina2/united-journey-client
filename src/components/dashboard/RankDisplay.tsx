import { useRank } from '../../hooks/useStatistics'
import { Link } from 'react-router-dom'

function getTier(topPercentage: number): { label: string; accent: string } {
  if (topPercentage >= 95) return { label: 'Elite', accent: 'text-united-foil border-united-foil/50' }
  if (topPercentage >= 80) return { label: 'Platinum', accent: 'text-united-gray-600 border-united-gray-300' }
  if (topPercentage >= 60) return { label: 'Gold', accent: 'text-amber-600 border-amber-300' }
  if (topPercentage >= 40) return { label: 'Silver', accent: 'text-gray-500 border-gray-300' }
  if (topPercentage >= 20) return { label: 'Bronze', accent: 'text-amber-700 border-amber-400' }
  return { label: 'Debutant', accent: 'text-united-gray-600 border-united-gray-300' }
}

export const RankDisplay = () => {
  const { data: rankData, isLoading } = useRank()

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-united-gray-200 bg-united-white p-6 animate-pulse">
        <div className="h-5 w-32 bg-united-gray-200 rounded mb-4" />
        <div className="h-12 w-20 bg-united-gray-200 rounded mb-3" />
        <div className="h-2 w-full bg-united-gray-200 rounded mb-2" />
        <div className="h-4 w-40 bg-united-gray-200 rounded" />
      </div>
    )
  }

  if (!rankData || rankData.global_rank === null) {
    return (
      <div className="rounded-2xl border border-united-gray-200 bg-united-white p-8 text-center">
        <p className="font-serif text-lg text-united-black mb-1">No rank yet.</p>
        <p className="text-sm text-united-gray-600 mb-3">Log matches to earn your rank.</p>
        <Link
          to="/matches"
          className="text-sm font-semibold text-united-red hover:text-united-red-dark transition-colors"
        >
          Log a match &rarr;
        </Link>
      </div>
    )
  }

  const { global_rank, total_users, country_rank, country } = rankData

  const topPercentage =
    total_users > 0 ? Math.round(((total_users - (global_rank || 0)) / total_users) * 100) : 0

  const tier = getTier(topPercentage)

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-united-charcoal to-united-black">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 9px)',
        }}
      />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-united-foil via-united-gold to-united-foil" />

      {/* Header */}
      <div className="relative px-6 pt-5 pb-1 flex items-center justify-between">
        <h3 className="font-serif text-lg text-united-white">Your Rank</h3>
        <Link
          to="/leaderboards"
          className="text-xs font-bold tracking-[0.08em] uppercase text-united-white/50 hover:text-united-white transition-colors"
        >
          View All &rarr;
        </Link>
      </div>

      {/* Content */}
      <div className="relative px-6 pb-6 pt-4">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="font-mono tabular-nums text-4xl font-bold text-united-white">
            #{global_rank}
          </span>
          <span className="text-sm text-united-white/50">of {total_users} fans</span>
          <span className={`text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full border ${tier.accent}`}>
            {tier.label}
          </span>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-united-white/50 mb-1.5">
            <span>Ahead of {topPercentage}% of fans</span>
            <span className="font-mono tabular-nums text-united-foil font-bold">{topPercentage}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-united-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-united-white/40 to-united-foil transition-all duration-700"
              style={{ width: `${topPercentage}%` }}
            />
          </div>
        </div>

        {/* Country rank */}
        {country && country_rank !== null && (
          <div className="mt-4 pt-4 border-t border-united-white/10 flex items-center justify-between">
            <span className="text-sm text-united-white/60">in {country}</span>
            <span className="font-mono tabular-nums text-lg font-bold text-united-white">
              #{country_rank}
            </span>
          </div>
        )}

        {/* Quick stats */}
        <div className="mt-4 grid grid-cols-3 divide-x divide-united-white/10 border-t border-united-white/10 pt-4">
          <QuickStat label="Global" value={`#${global_rank}`} />
          <QuickStat label="Fans" value={total_users} />
          <QuickStat label="Top" value={`${topPercentage}%`} accent="text-united-foil" />
        </div>
      </div>
    </div>
  )
}

function QuickStat({
  label,
  value,
  accent = 'text-united-white',
}: {
  label: string
  value: string | number
  accent?: string
}) {
  return (
    <div className="text-center px-2 first:pl-0">
      <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-united-white/40 mb-1">{label}</p>
      <span className={`font-mono tabular-nums text-sm font-bold ${accent}`}>{value}</span>
    </div>
  )
}