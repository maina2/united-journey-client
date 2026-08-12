import { useAuthStore } from '../stores/authStore'

export const Dashboard = () => {
  const { user } = useAuthStore()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.full_name || user?.username}!</h1>
        <p className="text-gray-500 mt-1">Track your United journey and earn badges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Matches', value: user?.total_matches || 0, icon: '⚽' },
          { label: 'Points', value: user?.total_points || 0, icon: '⭐' },
          { label: 'Level', value: user?.current_level?.name || 'Bronze', icon: '🏆' },
          { label: 'Streak', value: `${user?.current_streak || 0} 🔥`, icon: '🔥' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Matches</h2>
          <p className="text-gray-500 text-center py-8">No matches logged yet. Start your journey!</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Badges</h2>
          <p className="text-gray-500 text-center py-8">Complete matches to earn badges!</p>
        </div>
      </div>
    </div>
  )
}
