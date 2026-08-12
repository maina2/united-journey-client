import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useUserProfile, useUserStats, useUserPreferences, useUpdateProfile, useToggleVisibility } from '../hooks/useUser'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { AvatarUpload } from '../components/profile/AvatarUpload'
import { Camera, Edit2, Globe, Lock, Mail, MapPin, User, Trophy, Calendar, TrendingUp, X, Check } from 'lucide-react'

export const Profile = () => {
  const { user } = useAuthStore()
  const { data: profile, isLoading: profileLoading, refetch } = useUserProfile()
  const { data: stats, isLoading: statsLoading } = useUserStats()
  const { data: preferences, isLoading: prefsLoading } = useUserPreferences()
  const updateProfile = useUpdateProfile()
  const toggleVisibility = useToggleVisibility()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    country: '',
    city: '',
  })

  const isLoading = profileLoading || statsLoading || prefsLoading

  const handleEditClick = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        country: profile.country || '',
        city: profile.city || '',
      })
    }
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(formData)
      await refetch()
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleAvatarUploadSuccess = (newUrl: string) => {
    refetch()
  }

  const handleToggleVisibility = async () => {
    try {
      await toggleVisibility.mutateAsync()
      await refetch()
    } catch (error) {
      console.error('Failed to toggle visibility:', error)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="bg-[#DA291C] h-24 relative">
          <div className="absolute -bottom-12 left-6">
            <AvatarUpload
              currentAvatarUrl={profile?.avatar_url || null}
              username={profile?.username || ''}
              onUploadSuccess={handleAvatarUploadSuccess}
            />
          </div>
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="absolute top-3 right-4 bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        <div className="pt-14 px-6 pb-6">
          {isEditing ? (
            // Edit Mode
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateProfile.isPending}
                    className="px-4 py-2 bg-[#DA291C] text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" /> {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent"
                    placeholder="Tell us about your United journey..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // View Mode
            <>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profile?.full_name || profile?.username}</h1>
                  <p className="text-gray-500">@{profile?.username}</p>
                </div>
                <button
                  onClick={handleToggleVisibility}
                  disabled={toggleVisibility.isPending}
                  className="flex items-center gap-2"
                >
                  {preferences?.profile_public ? (
                    <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full hover:bg-green-100 transition-colors">
                      <Globe className="w-4 h-4" /> Public
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">
                      <Lock className="w-4 h-4" /> Private
                    </span>
                  )}
                </button>
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
            </>
          )}
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
