import {
  useDashboardStats,
  useSeasonBreakdown,
  useStreakTimeline,
  usePerformanceTimeline,
  usePointsHistory,
} from '../hooks/useStatistics'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import {
  TrophyIcon,
  CalendarDaysIcon,
  FireIcon,
  MapPinIcon,
  UserGroupIcon,
  ChartBarSquareIcon,
} from '@heroicons/react/24/solid'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'

const COLORS = ['#DA291C', '#FBE122', '#2E7D32', '#6B7280', '#3B82F6']

export const Statistics = () => {
  const { data: dashboard, isLoading: dashboardLoading } = useDashboardStats()
  const { data: seasons, isLoading: seasonsLoading } = useSeasonBreakdown()
  const { data: streakData, isLoading: streakLoading } = useStreakTimeline()
  const { data: performanceData, isLoading: performanceLoading } = usePerformanceTimeline()
  const { data: pointsData, isLoading: pointsLoading } = usePointsHistory()

  const isLoading = dashboardLoading || seasonsLoading || streakLoading || performanceLoading || pointsLoading

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!dashboard) {
    return (
      <div className="text-center py-20">
        <p className="text-united-gray-500">No statistics available yet. Log some matches to see your stats!</p>
      </div>
    )
  }

  const competitionData = dashboard.competition_breakdown || []
  const pieData = competitionData.map((item) => ({
    name: item.competition,
    value: item.count,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-united-black">Statistics</h1>
        <p className="text-united-gray-500 mt-1">Your United journey, visualized.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Matches"
          value={dashboard.total_matches}
          icon={<CalendarDaysIcon className="w-5 h-5 text-united-red" />}
        />
        <StatCard
          label="Win Rate"
          value={`${dashboard.win_percentage}%`}
          icon={<ChartBarSquareIcon className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          label="Current Streak"
          value={`${dashboard.current_streak} 🔥`}
          icon={<FireIcon className="w-5 h-5 text-orange-500" />}
        />
        <StatCard
          label="Points"
          value={dashboard.total_points}
          icon={<TrophyIcon className="w-5 h-5 text-united-foil" />}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Points History Chart */}
        <div className="bg-united-white rounded-2xl p-6 border border-united-gray-200 shadow-united-sm">
          <h3 className="font-serif text-lg text-united-black mb-4">Points Accumulation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pointsData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="match_number" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${value} pts`, 'Total Points']}
                />
                <Area
                  type="monotone"
                  dataKey="running_total"
                  stroke="#DA291C"
                  fill="#DA291C"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competition Breakdown Pie Chart */}
        <div className="bg-united-white rounded-2xl p-6 border border-united-gray-200 shadow-united-sm">
          <h3 className="font-serif text-lg text-united-black mb-4">Competition Breakdown</h3>
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-united-gray-400">
                No competition data yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Timeline */}
      <div className="bg-united-white rounded-2xl p-6 border border-united-gray-200 shadow-united-sm">
        <h3 className="font-serif text-lg text-united-black mb-4">Performance Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="match_number" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
                formatter={(value) => [`${value}%`, 'Win Rate']}
                labelFormatter={(label) => `Match ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="running_win_percentage"
                stroke="#DA291C"
                strokeWidth={2}
                dot={{ fill: '#DA291C', r: 4 }}
                name="Running Win Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Season Breakdown Table */}
      <div className="bg-united-white rounded-2xl p-6 border border-united-gray-200 shadow-united-sm">
        <h3 className="font-serif text-lg text-united-black mb-4">Season Breakdown</h3>
        {seasons && seasons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-united-gray-200">
                  <th className="text-left py-3 font-semibold text-united-gray-600">Season</th>
                  <th className="text-center py-3 font-semibold text-united-gray-600">Matches</th>
                  <th className="text-center py-3 font-semibold text-united-gray-600">Wins</th>
                  <th className="text-center py-3 font-semibold text-united-gray-600">Draws</th>
                  <th className="text-center py-3 font-semibold text-united-gray-600">Losses</th>
                  <th className="text-center py-3 font-semibold text-united-gray-600">Win %</th>
                  <th className="text-center py-3 font-semibold text-united-gray-600">Points</th>
                </tr>
              </thead>
              <tbody>
                {seasons.map((season) => (
                  <tr key={season.season} className="border-b border-united-gray-100 hover:bg-united-gray-50">
                    <td className="py-3 font-medium text-united-black">{season.season}</td>
                    <td className="text-center py-3">{season.total}</td>
                    <td className="text-center py-3 text-emerald-600">{season.wins}</td>
                    <td className="text-center py-3 text-amber-600">{season.draws}</td>
                    <td className="text-center py-3 text-red-600">{season.losses}</td>
                    <td className="text-center py-3 font-bold text-united-red">{season.win_percentage}%</td>
                    <td className="text-center py-3 font-bold text-united-foil">{season.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-united-gray-400 text-center py-4">No season data available</p>
        )}
      </div>

      {/* Streak Timeline */}
      <div className="bg-united-white rounded-2xl p-6 border border-united-gray-200 shadow-united-sm">
        <h3 className="font-serif text-lg text-united-black mb-4">Streak Timeline</h3>
        {streakData && streakData.length > 0 ? (
          <div className="flex items-end gap-2 h-32">
            {streakData.map((point, index) => {
              const height = Math.max((point.streak / Math.max(...streakData.map((p) => p.streak))) * 100, 10)
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full max-w-[40px] bg-gradient-to-t from-united-red to-united-foil rounded-t"
                    style={{ height: `${height}%` }}
                  />
                  <p className="text-[10px] text-united-gray-500 mt-1 truncate w-full text-center">
                    {point.opponent.slice(0, 8)}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-united-gray-400 text-center py-4">No streak data available</p>
        )}
      </div>
    </div>
  )
}

const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
}) => {
  return (
    <div className="bg-united-white rounded-xl p-4 border border-united-gray-200 text-center shadow-united-sm">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-2xl font-bold text-united-charcoal">{value}</p>
      <p className="text-xs text-united-gray-500 uppercase tracking-wider">{label}</p>
    </div>
  )
}
