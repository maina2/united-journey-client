import { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, Users, Camera, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useUpcomingWindows, useLogAttendance } from '../../hooks/useMatches'
import { format, formatDistanceToNowStrict } from 'date-fns'

export const LiveMatchLogger = () => {
  const { data: fixtures, isLoading, refetch } = useUpcomingWindows()
  const logAttendance = useLogAttendance()
  const [loggingId, setLoggingId] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [selectedFixture, setSelectedFixture] = useState<any>(null)

  // Get only matches that are currently open
  const liveMatches = fixtures?.filter((f: any) => 
    f.window?.status === 'open' && !f.is_logged
  ) || []

  const upcomingMatches = fixtures?.filter((f: any) => 
    f.window?.status === 'upcoming'
  ) || []

  useEffect(() => {
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      refetch()
    }, 10000)
    return () => clearInterval(interval)
  }, [refetch])

  const handleLogAttendance = async (fixtureId: number, attendanceType: 'in_person' | 'watched') => {
    setLoggingId(fixtureId)
    try {
      await logAttendance.mutateAsync({ 
        fixtureId, 
        attendance_type: attendanceType,
        notes: notes || undefined 
      })
      setNotes('')
      setSelectedFixture(null)
      await refetch()
    } catch (error) {
      console.error('Failed to log attendance:', error)
    } finally {
      setLoggingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-united-red" />
      </div>
    )
  }

  if (liveMatches.length === 0 && upcomingMatches.length === 0) {
    return (
      <div className="bg-united-white rounded-2xl p-8 border border-united-gray-200 text-center">
        <div className="w-16 h-16 bg-united-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-united-gray-400" />
        </div>
        <h3 className="font-serif text-xl text-united-black mb-2">No Live Matches</h3>
        <p className="text-united-gray-500 text-sm">
          Check back during match time to log your attendance.
        </p>
        {upcomingMatches.length > 0 && (
          <div className="mt-4 text-sm text-united-gray-400">
            {upcomingMatches.length} upcoming matches scheduled
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-united-red animate-pulse" />
            <h2 className="font-serif text-xl text-united-black">Live Now</h2>
            <span className="text-sm text-united-gray-500">({liveMatches.length} match{liveMatches.length > 1 ? 'es' : ''})</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {liveMatches.map((fixture: any) => {
              const matchDate = new Date(fixture.match_date)
              const isSelected = selectedFixture?.id === fixture.id

              return (
                <div
                  key={fixture.id}
                  className={`bg-gradient-to-r from-united-red/5 to-white rounded-2xl border-2 ${
                    isSelected ? 'border-united-red' : 'border-united-red/20'
                  } p-6 transition-all`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-lg font-bold text-united-black">
                          vs {fixture.opponent}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          fixture.is_home
                            ? 'bg-united-red/10 text-united-red'
                            : 'bg-united-gray-200 text-united-gray-600'
                        }`}>
                          {fixture.is_home ? '🏠 Home' : '✈️ Away'}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-united-red/10 text-united-red font-medium animate-pulse">
                          🔴 Live
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-united-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {format(matchDate, 'EEEE, dd MMM yyyy')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {format(matchDate, 'HH:mm')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {fixture.venue}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-sm text-united-red font-medium">
                        <Clock className="w-4 h-4" />
                        <span>Logging window closes in </span>
                        <span className="font-mono">
                          {fixture.window?.time_remaining ? (
                            formatDistanceToNowStrict(
                              new Date(Date.now() + parseTimeRemaining(fixture.window.time_remaining)),
                              { unit: 'second' }
                            )
                          ) : (
                            '--:--:--'
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {!isSelected ? (
                        <button
                          onClick={() => setSelectedFixture(fixture)}
                          className="w-full lg:w-auto px-6 py-2.5 bg-united-red text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                        >
                          Log Attendance →
                        </button>
                      ) : (
                        <div className="space-y-3 w-full lg:w-64">
                          <textarea
                            placeholder="Add personal notes..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-united-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-united-red/20 focus:border-united-red outline-none resize-none"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleLogAttendance(fixture.id, 'in_person')}
                              disabled={logAttendance.isPending && loggingId === fixture.id}
                              className="flex-1 bg-united-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                            >
                              {logAttendance.isPending && loggingId === fixture.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                '🏟️ In Person'
                              )}
                            </button>
                            <button
                              onClick={() => handleLogAttendance(fixture.id, 'watched')}
                              disabled={logAttendance.isPending && loggingId === fixture.id}
                              className="flex-1 bg-united-gray-200 text-united-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-united-gray-300 transition-colors disabled:opacity-50"
                            >
                              📺 Watched
                            </button>
                            <button
                              onClick={() => setSelectedFixture(null)}
                              className="px-3 py-2 text-united-gray-400 hover:text-united-gray-600"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Upcoming Matches (Preview) */}
      {upcomingMatches.length > 0 && (
        <div className="mt-8">
          <h3 className="font-serif text-lg text-united-black mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-united-gray-400" />
            Upcoming Matches
            <span className="text-sm font-normal text-united-gray-400">({upcomingMatches.length})</span>
          </h3>
          <div className="space-y-2">
            {upcomingMatches.slice(0, 3).map((fixture: any) => (
              <div key={fixture.id} className="flex items-center justify-between p-3 bg-united-gray-50 rounded-xl border border-united-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-united-black">vs {fixture.opponent}</span>
                  <span className="text-xs text-united-gray-500">
                    {format(new Date(fixture.match_date), 'dd MMM, HH:mm')}
                  </span>
                </div>
                <span className="text-xs text-united-gray-400">
                  Opens at match time
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function parseTimeRemaining(timeStr: string): number {
  if (!timeStr) return 0
  const parts = timeStr.split(':')
  if (parts.length === 3) {
    const hours = parseInt(parts[0]) || 0
    const minutes = parseInt(parts[1]) || 0
    const seconds = parseFloat(parts[2]) || 0
    return (hours * 3600 + minutes * 60 + seconds) * 1000
  }
  return 0
}
