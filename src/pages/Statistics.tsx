import {
  useDashboardStats,
  useSeasonBreakdown,
  useStreakTimeline,
  usePerformanceTimeline,
  usePointsHistory,
} from '../hooks/useStatistics'
import { useMyBadges } from '../hooks/useBadges'
import { useMatchStats } from '../hooks/useMatches'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'

const BRAND_CYCLE = ['#DA291C', '#C9A227', '#0C3B2E', '#1A1A1A', '#A31E17']

export const Statistics = () => {
  const { data: dashboard, isLoading: dashboardLoading } = useDashboardStats()
  const { data: matchStats, isLoading: matchStatsLoading } = useMatchStats()
  const { data: seasons, isLoading: seasonsLoading } = useSeasonBreakdown()
  const { data: streakData, isLoading: streakLoading } = useStreakTimeline()
  const { data: performanceData, isLoading: performanceLoading } = usePerformanceTimeline()
  const { data: pointsData, isLoading: pointsLoading } = usePointsHistory()
  const { data: badgesData, isLoading: badgesLoading } = useMyBadges()

  const isLoading =
    dashboardLoading ||
    matchStatsLoading ||
    seasonsLoading ||
    streakLoading ||
    performanceLoading ||
    pointsLoading ||
    badgesLoading

  if (isLoading) {
    return <LoadingSpinner />
  }

  // Data is now available
  const competitionData = dashboard?.competition_breakdown || []
  const competitionTotal = competitionData.reduce((sum, c) => sum + c.count, 0)
  const earnedBadges = badgesData?.earned || []

  // Prefer matchStats, fall back to dashboard for resilience
  const totalMatches = matchStats?.total_matches ?? dashboard?.total_matches ?? 0
  const winPercentage = matchStats?.win_percentage ?? dashboard?.win_percentage ?? 0
  const currentStreak = matchStats?.current_streak ?? dashboard?.current_streak ?? 0
  const totalPoints = matchStats?.total_points ?? dashboard?.total_points ?? 0
  const inPerson = matchStats?.in_person ?? dashboard?.in_person ?? 0
  const groundsVisited = matchStats?.grounds_visited ?? dashboard?.grounds_visited ?? 0
  const wins = matchStats?.wins ?? dashboard?.wins ?? 0
  const draws = matchStats?.draws ?? dashboard?.draws ?? 0
  const losses = matchStats?.losses ?? dashboard?.losses ?? 0
  const milesTravelled = dashboard?.miles_travelled ?? 0

  return (
    <div>
      {/* Masthead */}
      <section className="relative overflow-hidden bg-united-black">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 9px)',
          }}
        />
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-united-foil via-united-gold to-united-foil" />

        <div className="relative max-w-5xl mx-auto px-4 md:px-8 py-12">
          <span className="text-xs font-bold tracking-[0.25em] text-united-red uppercase">
            My United &middot; Season Dossier
          </span>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl text-united-white leading-tight">
            Statistics
          </h1>
          <p className="mt-2 text-united-white/50">Your United journey, visualized.</p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-united-white/10 border-t border-united-white/10 pt-6">
            <HeroStat label="Matches" value={totalMatches} />
            <HeroStat label="Win Rate" value={`${winPercentage}%`} accent="text-emerald-400" />
            <HeroStat label="Streak" value={currentStreak} accent="text-united-gold" />
            <HeroStat label="Points" value={totalPoints} accent="text-united-gold" />
            <HeroStat label="In Person" value={inPerson} />
            <HeroStat label="Grounds" value={groundsVisited} accent="text-emerald-400" />
            <HeroStat label="Badges" value={earnedBadges.length} accent="text-united-gold" />
            <HeroStat label="Miles" value={`${milesTravelled || 0}`} />
          </div>
        </div>
      </section>

      {/* Pull-quote */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 border-b border-united-gray-200">
        <p className="font-serif text-2xl md:text-3xl text-united-black leading-snug">
          You&rsquo;re on a <span className="text-united-red font-bold">{currentStreak}-match</span> run,
          holding a <span className="text-united-pitch font-bold">{winPercentage}%</span> win rate
          across <span className="font-bold">{totalMatches}</span> matches logged this season.
          <span className="block text-base text-united-gray-500 mt-2 font-sans">
            {wins}W – {draws}D – {losses}L
          </span>
        </p>
      </div>

      {/* Charts */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-united-charcoal p-6">
          <h3 className="font-serif text-lg text-united-white mb-4">Points Accumulation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pointsData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="match_number" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #2A2A2A',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                  formatter={(value) => [`${value} pts`, 'Total Points']}
                />
                <Area type="monotone" dataKey="running_total" stroke="#C9A227" fill="#0C3B2E" fillOpacity={0.35} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-united-gray-200 bg-united-white p-6">
          <h3 className="font-serif text-lg text-united-black mb-4">Competitions</h3>
          {competitionData.length > 0 ? (
            <>
              <div className="flex h-2 rounded-full overflow-hidden mb-5">
                {competitionData.map((item, i) => (
                  <div
                    key={item.competition}
                    style={{
                      width: `${(item.count / competitionTotal) * 100}%`,
                      backgroundColor: BRAND_CYCLE[i % BRAND_CYCLE.length],
                    }}
                  />
                ))}
              </div>
              <div className="space-y-3">
                {competitionData.map((item, i) => (
                  <div key={item.competition} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: BRAND_CYCLE[i % BRAND_CYCLE.length] }}
                      />
                      <span className="text-sm text-united-black truncate">{item.competition}</span>
                    </div>
                    <span className="font-mono tabular-nums text-sm font-bold text-united-black shrink-0">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-united-gray-600 text-center py-8">No competition data yet.</p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pb-10">
        <div className="rounded-2xl bg-united-charcoal p-6">
          <h3 className="font-serif text-lg text-united-white mb-4">Performance Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="match_number" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #2A2A2A',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                  formatter={(value) => [`${value}%`, 'Win Rate']}
                  labelFormatter={(label) => `Match ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="running_win_percentage"
                  stroke="#C9A227"
                  strokeWidth={2}
                  dot={{ fill: '#C9A227', r: 4 }}
                  name="Running Win Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pb-10">
        <h3 className="font-serif text-xl text-united-black mb-4">Season Breakdown</h3>
        {seasons && seasons.length > 0 ? (
          <div className="rounded-2xl border border-united-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-united-gray-100 border-b border-united-gray-200">
                  <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.12em] text-united-gray-600 uppercase">Season</th>
                  <th className="text-center px-3 py-3 text-[11px] font-bold tracking-[0.12em] text-united-gray-600 uppercase">Matches</th>
                  <th className="text-center px-3 py-3 text-[11px] font-bold tracking-[0.12em] text-united-gray-600 uppercase">Wins</th>
                  <th className="text-center px-3 py-3 text-[11px] font-bold tracking-[0.12em] text-united-gray-600 uppercase">Draws</th>
                  <th className="text-center px-3 py-3 text-[11px] font-bold tracking-[0.12em] text-united-gray-600 uppercase">Losses</th>
                  <th className="text-center px-3 py-3 text-[11px] font-bold tracking-[0.12em] text-united-gray-600 uppercase">Win %</th>
                  <th className="text-center px-5 py-3 text-[11px] font-bold tracking-[0.12em] text-united-gray-600 uppercase">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-united-gray-200">
                {seasons.map((season) => (
                  <tr key={season.season} className="hover:bg-united-gray-100 transition-colors">
                    <td className="px-5 py-3.5 font-serif text-united-black">{season.season}</td>
                    <td className="text-center px-3 py-3.5 font-mono tabular-nums text-united-gray-600">{season.total}</td>
                    <td className="text-center px-3 py-3.5 font-mono tabular-nums font-bold text-united-pitch">{season.wins}</td>
                    <td className="text-center px-3 py-3.5 font-mono tabular-nums font-bold text-united-foil">{season.draws}</td>
                    <td className="text-center px-3 py-3.5 font-mono tabular-nums font-bold text-united-red">{season.losses}</td>
                    <td className="text-center px-3 py-3.5 font-mono tabular-nums font-bold text-united-black">{season.win_percentage}%</td>
                    <td className="text-center px-5 py-3.5 font-mono tabular-nums font-bold text-united-foil">{season.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-united-gray-200 p-10 text-center">
            <p className="text-united-gray-600">No season data available.</p>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pb-14">
        <h3 className="font-serif text-xl text-united-black mb-4">Streak Timeline</h3>
        <div className="rounded-2xl border border-united-gray-200 p-6">
          {streakData && streakData.length > 0 ? (
            <StreakSkyline data={streakData} />
          ) : (
            <p className="text-united-gray-600 text-center py-6">No streak data available.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function StreakSkyline({ data }: { data: { opponent: string; streak: number }[] }) {
  const maxStreak = Math.max(...data.map((p) => p.streak), 1)
  const peakIndex = data.findIndex((p) => p.streak === maxStreak)

  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((point, index) => {
        const height = Math.max((point.streak / maxStreak) * 100, 8)
        const isPeak = index === peakIndex && point.streak > 0
        return (
          <div key={index} className="flex-1 flex flex-col items-center min-w-0">
            <div
              className={`w-full max-w-[36px] rounded-t transition-all duration-500 ${
                isPeak ? 'bg-united-foil' : 'bg-united-black'
              }`}
              style={{ height: `${height}%` }}
              title={`${point.opponent}: ${point.streak}`}
            />
            <p className="text-[10px] text-united-gray-600 mt-1.5 truncate w-full text-center">
              {point.opponent.slice(0, 8)}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function HeroStat({
  label,
  value,
  accent = 'text-united-white',
}: {
  label: string
  value: string | number
  accent?: string
}) {
  return (
    <div className="px-4 py-4 md:py-0 first:pl-0 text-center md:text-left">
      <p className="text-[10px] font-bold tracking-[0.12em] text-united-white/40 uppercase mb-1.5">{label}</p>
      <span className={`font-mono tabular-nums text-xl md:text-2xl font-bold ${accent}`}>{value}</span>
    </div>
  )
}