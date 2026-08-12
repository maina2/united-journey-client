import { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useUserProfile, useUserStats, useUserPreferences } from '../hooks/useUser'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { Camera, Edit2, Globe, Lock, Mail, MapPin, User, Trophy, Calendar, TrendingUp } from 'lucide-react'

export const Profile = () => {
  const { user } = useAuthStore()
  const { data: profile, isLoading: profileLoading } = useUserProfile()
  const { data: stats, isLoading: statsLoading } = useUserStats()
  const { data: preferences, isLoading: prefsLoading } = useUserPreferences()
  const [isEditing, setIsEditing] = useState(false)

  const isLoading = profileLoading || statsLoading || prefsLoading

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="bg-[#DA291C] h-24 relative">
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-[#DA291C] text-white p-1.5 rounded-full shadow-lg hover:bg-red-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-3 right-4 bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        <div className="pt-14 px-6 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile?.full_name || profile?.username}</h1>
              <p className="text-gray-500">@{profile?.username}</p>
            </div>
            <div className="flex items-center gap-2">
              {preferences?.profile_public ? (
                <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <Globe className="w-4 h-4" /> Public
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  <Lock className="w-4 h-4" /> Private
                </span>
              )}
            </div>
          </div>

          {profile?.bio && (
            <p className="mt-2 text-gray-700">{profile.bio}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
            {profile?.country && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {profile.country}
                {profile?.city && `, ${profile.city}`}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" /> {profile?.email}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Joined {new Date(profile?.created_at || '').toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard
          icon={<Trophy className="w-5 h-5 text-[#DA291C]" />}
          label="Total Matches"
          value={stats?.total_matches || 0}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
          label="Win Rate"
          value={`${stats?.win_percentage || 0}%`}
        />
        <StatCard
          icon={<User className="w-5 h-5 text-blue-600" />}
          label="Grounds Visited"
          value={stats?.grounds_visited || 0}
        />
        <StatCard
          icon={<Trophy className="w-5 h-5 text-yellow-600" />}
          label="Total Points"
          value={stats?.total_points || 0}
        />
      </div>

      {/* User Level */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Your Level</h3>
          <span className="text-sm font-medium text-[#DA291C]">
            {profile?.current_level?.name || 'Bronze'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-[#DA291C] h-3 rounded-full transition-all duration-500"
            style={{ width: '65%' }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>0 pts</span>
          <span>Next level: 100 pts</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mt-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <p className="text-gray-500 text-center py-4">No recent activity yet.</p>
      </div>
    </div>
  )
}

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 text-center">
    <div className="flex justify-center mb-1">{icon}</div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
)
