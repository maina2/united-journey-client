import { useState, useEffect } from 'react'
import { useUserPreferences, useUpdatePreferences } from '../hooks/useUser'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { Bell, Eye, Moon, Sun, Monitor, Globe, Calendar, Mail, Save, Check } from 'lucide-react'

export const Preferences = () => {
  const { data: preferences, isLoading, refetch } = useUserPreferences()
  const updatePreferences = useUpdatePreferences()
  const [formData, setFormData] = useState<any>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (preferences) {
      setFormData(preferences)
    }
  }, [preferences])

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updatePreferences.mutateAsync(formData)
      await refetch()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to update preferences:', error)
    }
  }

  if (isLoading || !formData) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Preferences</h1>
          <p className="text-gray-500 text-sm">Manage your account settings and preferences</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={updatePreferences.isPending}
          className="bg-[#DA291C] text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {updatePreferences.isPending ? (
            <>Saving...</>
          ) : saved ? (
            <>
              <Check className="w-4 h-4" /> Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Notification Preferences */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-[#DA291C]" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          <div className="space-y-3">
            <ToggleSwitch
              label="Enable Notifications"
              description="Receive notifications about your United journey"
              checked={formData.notifications_enabled}
              onChange={(val) => handleChange('notifications_enabled', val)}
            />
            <ToggleSwitch
              label="Email Updates"
              description="Get match summaries and updates via email"
              checked={formData.email_updates}
              onChange={(val) => handleChange('email_updates', val)}
            />
            <ToggleSwitch
              label="Push Notifications"
              description="Receive push notifications in your browser"
              checked={formData.push_notifications}
              onChange={(val) => handleChange('push_notifications', val)}
            />
            <ToggleSwitch
              label="Match Reminders"
              description="Get reminded before United matches"
              checked={formData.match_reminders}
              onChange={(val) => handleChange('match_reminders', val)}
            />
            <ToggleSwitch
              label="Season Updates"
              description="Receive updates at the start of each season"
              checked={formData.season_updates}
              onChange={(val) => handleChange('season_updates', val)}
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-[#DA291C]" />
            <h2 className="text-lg font-semibold text-gray-900">Privacy</h2>
          </div>
          <div className="space-y-3">
            <ToggleSwitch
              label="Public Profile"
              description="Allow others to view your profile"
              checked={formData.profile_public}
              onChange={(val) => handleChange('profile_public', val)}
            />
            <ToggleSwitch
              label="Show Email"
              description="Display your email on your public profile"
              checked={formData.show_email}
              onChange={(val) => handleChange('show_email', val)}
            />
            <ToggleSwitch
              label="Show Country"
              description="Display your country on your public profile"
              checked={formData.show_country}
              onChange={(val) => handleChange('show_country', val)}
            />
            <ToggleSwitch
              label="Show Activity"
              description="Display your recent activity on your profile"
              checked={formData.show_activity}
              onChange={(val) => handleChange('show_activity', val)}
            />
          </div>
        </div>

        {/* Appearance & Language */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {formData.theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-[#DA291C]" />
                ) : formData.theme === 'united' ? (
                  <Monitor className="w-5 h-5 text-[#DA291C]" />
                ) : (
                  <Sun className="w-5 h-5 text-[#DA291C]" />
                )}
                <h2 className="text-lg font-semibold text-gray-900">Theme</h2>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['light', 'dark', 'united'].map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => handleChange('theme', theme)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium capitalize transition-all ${
                      formData.theme === theme
                        ? 'border-[#DA291C] bg-[#DA291C]/10 text-[#DA291C]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-[#DA291C]" />
                <h2 className="text-lg font-semibold text-gray-900">Language</h2>
              </div>
              <select
                value={formData.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </div>
        </div>

        {/* Marketing Preferences */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-[#DA291C]" />
            <h2 className="text-lg font-semibold text-gray-900">Marketing & Communications</h2>
          </div>
          <div className="space-y-3">
            <ToggleSwitch
              label="Marketing Emails"
              description="Receive special offers and updates from Manchester United"
              checked={formData.marketing_emails}
              onChange={(val) => handleChange('marketing_emails', val)}
            />
          </div>
        </div>
      </form>
    </div>
  )
}

interface ToggleSwitchProps {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}

const ToggleSwitch = ({ label, description, checked, onChange }: ToggleSwitchProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="font-medium text-gray-700">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-[#DA291C]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? 'left-7' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}
