import {
  useDashboardStats,
  useSeasonBreakdown,
  useStreakTimeline,
  usePerformanceTimeline,
  usePointsHistory,
} from '../hooks/useStatistics'
import { useMyBadges } from '../hooks/useBadges'
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
  const { data: seasons, isLoading: seasonsLoading } = useSeasonBreakdown()
  const { data: streakData, isLoading: streakLoading } = useStreakTimeline()
  const { data: performanceData, isLoading: performanceLoading } = usePerformanceTimeline()
  const { data: pointsData, isLoading: pointsLoading } = usePointsHistory()
  const { data: badgesData } = useMyBadges()

  const isLoading = dashboardLoading || seasonsLoading || streakLoading || performanceLoading || pointsLoading

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!dashboard) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="font-serif text-xl text-united-black mb-1">No statistics yet.</p>
        <p className="text-united-gray-600">Log some matches to see your season take shape.</p>
      </div>
    )
  }

  const competitionData = dashboard.competition_breakdown || []
  const competitionTotal = competitionData.reduce((sum, c) => sum + c.count, 0)
  const earnedBadges = badgesData?.earned || []

  // Use dashboard data directly
  const stats = [
    { label: 'Matches', value: dashboard.total_matches || 0 },
    { label: 'Win Rate', value: `${dashboard.win_percentage || 0}%`, accent: 'text-emerald-400' },
    { label: 'Streak', value: dashboard.current_streak || 0, accent: 'text-united-foil' },
    { label: 'Points', value: dashboard.total_points || 0, accent: 'text-united-foil' },
    { label: 'In Person', value: dashboard.in_person || 0 },
    { label: 'Grounds', value: dashboard.grounds_visited || 0, accent: 'text-emerald-400' },
    { label: 'Badges', value: earnedBadges.length || 0, accent: 'text-united-foil' },
    { label: 'Miles', value: `${dashboard.miles_travelled || 0}`, accent: 'text-united-foil' },
  ]

  return (
    <div>
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
            {stats.map((stat) => (
              <HeroStat key={stat.label} label={stat.label} value={stat.value} accent={stat.accent || 'text-united-white'} />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 border-b border-united-gray-200">
        <p className="font-serif text-2xl md:text-3xl text-united-black leading-snug">
          You&rsquo;re on a <span className="text-united-red font-bold">{dashboard.current_streak || 0}-match</span> run,
          holding a <span className="text-united-pitch font-bold">{dashboard.win_percentage || 0}%</span> win rate
          across <span className="font-bold">{dashboard.total_matches || 0}</span> matches logged this season.
        </p>
      </div>

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
