import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useMatchStats, useMatches } from '../hooks/useMatches'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { BadgesCarousel } from '../components/dashboard/BadgesCarousel'
import { RankDisplay } from '../components/dashboard/RankDisplay'
import { formatDistanceToNow } from 'date-fns'
import {
  TrophyIcon,
  CalendarDaysIcon,
  FireIcon,
  StarIcon,
} from '@heroicons/react/24/solid'
import { UpcomingMatches } from '../components/dashboard/UpcomingMatches'

const SEASON_MONTHS = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']

function getSeasonProgress(): number {
  const now = new Date()
  const seasonStartYear = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1
  const start = new Date(seasonStartYear, 7, 1).getTime()
  const end = new Date(seasonStartYear + 1, 4, 31).getTime()
  return Math.min(1, Math.max(0, (now.getTime() - start) / (end - start)))
}

function getCurrentSeasonMonthIndex(): number {
  const monthShort = new Date().toLocaleString('default', { month: 'short' })
  return SEASON_MONTHS.indexOf(monthShort)
}

function getTier(caps: number): { name: string; className: string } {
  if (caps >= 30) return { name: 'Club Legend', className: 'text-united-foil border-united-foil/60' }
  if (caps >= 15) return { name: 'First Team', className: 'text-united-white border-united-white/40' }
  if (caps >= 5) return { name: 'Regular Starter', className: 'text-united-white/70 border-united-white/25' }
  return { name: 'Debutant', className: 'text-united-white/50 border-united-white/15' }
}

export const Dashboard = () => {
  const { user } = useAuthStore()
  const { data: stats, isLoading: statsLoading } = useMatchStats()
  const { data: matchesData, isLoading: matchesLoading } = useMatches({ limit: 5 })

  if (statsLoading || matchesLoading) {
    return <LoadingSpinner />
  }

  const caps = stats?.total_matches ?? 0
  const wins = stats?.wins ?? 0
  const draws = stats?.draws ?? 0
  const losses = stats?.losses ?? 0
  const winRate = stats?.win_percentage ?? 0
  const inPerson = stats?.in_person ?? 0
  const grounds = stats?.grounds_visited ?? 0
  const currentStreak = stats?.current_streak ?? 0
  const totalPoints = stats?.total_points ?? 0
  const topOpponents = stats?.top_opponents ?? []
  const recentMatches = matchesData?.items ?? []

  const tier = getTier(caps)
  const memberSince = user?.created_at ? new Date(user.created_at).getFullYear() : '—'
  const seasonProgress = getSeasonProgress()
  const currentMonthIndex = getCurrentSeasonMonthIndex()

  const honours = [
    { name: 'First Cap', detail: caps >= 1 ? '✅ Unlocked!' : 'Log your first match', unlocked: caps >= 1 },
    { name: 'Away Day Loyalty', detail: inPerson >= 5 ? '✅ Unlocked!' : `${5 - inPerson} more needed`, unlocked: inPerson >= 5 },
    { name: 'Streak Master', detail: currentStreak >= 5 ? '✅ Unlocked!' : `${5 - currentStreak} more needed`, unlocked: currentStreak >= 5 },
    { name: 'Century Club', detail: caps >= 100 ? '✅ Unlocked!' : `${100 - caps} more needed`, unlocked: caps >= 100 },
  ]

  return (
    <div>
      {/* ---------- Full-bleed member card hero ---------- */}
      <section className="relative overflow-hidden bg-united-black">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 9px)',
          }}
        />
        <img
          src="https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-[420px] w-[420px] opacity-[0.04]"
        />
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-united-foil via-united-gold to-united-foil" />

        <div className="relative max-w-5xl mx-auto px-4 md:px-8 py-14">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold tracking-[0.25em] text-united-red uppercase">
                  My United
                </span>
                <span className={`text-[11px] font-bold tracking-[0.15em] uppercase border rounded-full px-2.5 py-1 ${tier.className}`}>
                  {tier.name}
                </span>
                {currentStreak >= 3 && (
                  <span className="text-[11px] font-bold tracking-[0.15em] uppercase border border-orange-500/50 text-orange-400 rounded-full px-2.5 py-1">
                    🔥 {currentStreak} Streak
                  </span>
                )}
              </div>
              <h1 className="mt-3 font-serif text-4xl md:text-5xl text-united-white leading-tight">
                {user?.full_name || user?.username}
              </h1>
              <p className="mt-1 text-sm text-united-white/50">Member since {memberSince}</p>
            </div>

            <div className="relative shrink-0">
              <div className="absolute -inset-1.5 rounded-full border border-dashed border-united-foil/30" />
              <div className="h-16 w-16 rounded-full border-2 border-united-foil/70 flex items-center justify-center">
                <span className="font-serif text-xl text-united-foil tracking-wide">MU</span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <span className="font-mono tabular-nums text-6xl md:text-7xl font-bold text-united-white">
                {caps}
              </span>
              <p className="mt-1 text-xs font-bold tracking-[0.2em] text-united-white/50 uppercase">
                Caps &middot; Total Appearances
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-united-foil">{totalPoints}</p>
              <p className="text-[11px] tracking-[0.15em] text-united-white/30 uppercase">Total Points</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative h-1.5 rounded-full bg-united-white/10">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-united-red to-united-foil"
                style={{ width: `${seasonProgress * 100}%` }}
              />
              <div
                className="absolute -top-1.5 h-4 w-4 -translate-x-1/2 rounded-full bg-united-white shadow-[0_0_0_4px_rgba(255,255,255,0.12)] animate-pulse"
                style={{ left: `${seasonProgress * 100}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-10 text-center">
              {SEASON_MONTHS.map((month, i) => (
                <span
                  key={month}
                  className={`text-[10px] font-bold tracking-[0.1em] uppercase ${
                    i === currentMonthIndex ? 'text-united-white' : 'text-united-white/30'
                  }`}
                >
                  {month}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Body ---------- */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-sm text-united-gray-500">Season Progress</p>
            <p className="text-sm font-semibold text-united-black">{Math.round(seasonProgress * 100)}% complete</p>
          </div>
          <Link
            to="/matches"
            className="inline-flex items-center gap-2 rounded-md bg-united-red px-5 py-2.5 font-semibold text-united-white transition-colors hover:bg-united-red-dark"
          >
            <PlusIcon className="h-4 w-4" />
            Log Match
          </Link>
        </div>

        {/* Stats Cards - Real data from backend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCardSmall label="Matches" value={caps} icon={<CalendarDaysIcon className="w-5 h-5 text-united-red" />} />
          <StatCardSmall label="Wins" value={wins} icon={<TrophyIcon className="w-5 h-5 text-emerald-500" />} />
          <StatCardSmall label="Points" value={totalPoints} icon={<StarIcon className="w-5 h-5 text-united-foil" />} />
          <StatCardSmall label="Streak" value={currentStreak} icon={<FireIcon className="w-5 h-5 text-orange-500" />} />
        </div>

        <div className="grid grid-cols-3 divide-x divide-united-gray-200 border border-united-gray-200 rounded-2xl overflow-hidden mb-12">
          <RecordCell label="Win Rate" value={`${winRate}%`} valueClass="text-united-red" />
          <RecordCell label="In Person" value={inPerson} valueClass="text-emerald-600" />
          <RecordCell label="Grounds" value={grounds} valueClass="text-united-foil" />
        </div>

        {/* NEW: Badges & Rank Row */}

        <div className="mb-8">
  <UpcomingMatches />
</div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Matches - Real data */}
          <div className="lg:col-span-2 rounded-2xl border border-united-gray-200 bg-united-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-united-black">Recent Appearances</h2>
              {recentMatches.length > 0 && (
                <span className="text-sm font-mono tracking-wider text-united-gray-500">
                  {recentMatches.slice(0, 5).map(m => m.result === 'W' ? '✅' : m.result === 'D' ? '➖' : '❌').join(' ')}
                </span>
              )}
            </div>
            <div className="h-px w-full bg-united-gray-200 mb-4" />
            {caps === 0 ? (
              <div className="py-10 text-center">
                <p className="font-medium text-united-black">No appearances logged yet.</p>
                <p className="text-sm text-united-gray-600 mt-1">Log a match to start your record.</p>
              </div>
            ) : recentMatches.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-united-gray-500">No recent matches found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMatches.map((match: any) => {
                  const resultColor = match.result === 'W' ? 'text-emerald-600 bg-emerald-50' 
                    : match.result === 'D' ? 'text-amber-600 bg-amber-50' 
                    : 'text-red-600 bg-red-50'
                  return (
                    <Link
                      key={match.id}
                      to={`/matches/${match.id}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-united-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${resultColor}`}>
                          {match.result || '—'}
                        </span>
                        <div>
                          <p className="font-semibold text-united-black">{match.opponent}</p>
                          <p className="text-xs text-united-gray-500">
                            {match.competition} • {match.venue}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {match.score_home !== null ? (
                          <p className="font-bold text-united-black">
                            {match.is_home ? match.score_home : match.score_away} - {match.is_home ? match.score_away : match.score_home}
                          </p>
                        ) : (
                          <p className="text-xs text-united-gray-400">No score</p>
                        )}
                        <p className="text-[10px] text-united-gray-400">
                          {formatDistanceToNow(new Date(match.match_date), { addSuffix: true })}
                        </p>
                      </div>
                    </Link>
                  )
                })}
                {caps > 5 && (
                  <Link
                    to="/matches"
                    className="block text-center text-sm font-medium text-united-red hover:underline mt-4"
                  >
                    View all {caps} matches →
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Top Opponents & Honours */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-united-charcoal p-6">
              <h2 className="font-serif text-lg text-united-white mb-1">Most Faced</h2>
              <div className="h-px w-full bg-united-white/10 mb-4" />
              {topOpponents.length === 0 ? (
                <p className="text-sm text-united-white/30">Log matches to see stats</p>
              ) : (
                <div className="space-y-3">
                  {topOpponents.slice(0, 4).map((opp: any) => (
                    <div key={opp.opponent} className="flex items-center justify-between">
                      <span className="text-sm text-united-white/70">{opp.opponent}</span>
                      <span className="text-sm font-bold text-united-foil">{opp.count}x</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-united-charcoal p-6">
              <h2 className="font-serif text-xl text-united-foil mb-1">Honours Board</h2>
              <div className="h-px w-full bg-united-white/10 mb-4" />
              <div className="space-y-4">
                {honours.map((honour) => (
                  <div key={honour.name} className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`font-serif text-sm ${honour.unlocked ? 'text-united-white' : 'text-united-white/35'}`}>
                        {honour.name}
                      </p>
                      <p className="text-xs text-united-white/30 mt-0.5">{honour.detail}</p>
                    </div>
                    <span
                      className={`shrink-0 text-[10px] font-bold tracking-[0.1em] uppercase mt-0.5 ${
                        honour.unlocked ? 'text-united-foil' : 'text-united-white/25'
                      }`}
                    >
                      {honour.unlocked ? '✅' : '🔒'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RecordCell({
  label,
  value,
  valueClass,
}: {
  label: string
  value: string | number
  valueClass: string
}) {
  return (
    <div className="px-4 py-6 text-center">
      <p className="text-xs font-bold tracking-[0.15em] text-united-gray-600 uppercase mb-2">{label}</p>
      <span className={`font-mono tabular-nums text-3xl font-bold ${valueClass}`}>{value}</span>
    </div>
  )
}

function StatCardSmall({
  label,
  value,
  icon,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
}) {
  return (
    <div className="bg-united-white rounded-xl p-4 border border-united-gray-200 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-2xl font-bold text-united-charcoal">{value}</p>
      <p className="text-xs text-united-gray-500 uppercase tracking-wider">{label}</p>
    </div>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
