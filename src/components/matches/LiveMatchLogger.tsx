import { useState, useEffect, useMemo } from 'react'
import { useUpcomingWindows, useLogAttendance } from '../../hooks/useMatches'
import { format } from 'date-fns'

export const LiveMatchLogger = () => {
  const { data: fixtures, isLoading, refetch } = useUpcomingWindows()
  const logAttendance = useLogAttendance()
  const [loggingId, setLoggingId] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [selectedFixture, setSelectedFixture] = useState<any>(null)

  const liveMatches = fixtures?.filter((f: any) => f.window?.status === 'open' && !f.is_logged) || []
  const upcomingMatches = fixtures?.filter((f: any) => f.window?.status === 'upcoming') || []

  useEffect(() => {
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
        notes: notes || undefined,
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
        <span className="h-5 w-5 rounded-full border-2 border-united-gray-300 border-t-united-red animate-spin" />
      </div>
    )
  }

  if (liveMatches.length === 0 && upcomingMatches.length === 0) {
    return (
      <div className="rounded-2xl border border-united-gray-200 bg-united-white p-8 text-center">
        <p className="font-serif text-lg text-united-black mb-1">No live matches right now.</p>
        <p className="text-sm text-united-gray-600">Check back once a match kicks off.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Live matches */}
      {liveMatches.length > 0 && (
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="h-2 w-2 rounded-full bg-united-red animate-pulse" />
            <h2 className="font-serif text-xl text-united-black">Live Now</h2>
            <span className="text-sm text-united-gray-600">
              ({liveMatches.length} match{liveMatches.length > 1 ? 'es' : ''})
            </span>
          </div>

          <div className="space-y-4">
            {liveMatches.map((fixture: any) => {
              const matchDate = new Date(fixture.match_date)
              const isSelected = selectedFixture?.id === fixture.id
              const isPending = logAttendance.isPending && loggingId === fixture.id

              return (
                <div
                  key={fixture.id}
                  className={`flex gap-4 rounded-2xl border bg-united-white p-6 transition-colors ${
                    isSelected ? 'border-united-red' : 'border-united-gray-200'
                  }`}
                >
                  <div className="w-1 shrink-0 rounded-full bg-united-red" />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-serif text-lg text-united-black">vs {fixture.opponent}</span>
                          <span
                            className={`text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-sm ${
                              fixture.is_home
                                ? 'bg-united-red/10 text-united-red'
                                : 'bg-united-gray-100 text-united-gray-600'
                            }`}
                          >
                            {fixture.is_home ? 'Home' : 'Away'}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.1em] uppercase text-united-red">
                            <span className="h-1.5 w-1.5 rounded-full bg-united-red animate-pulse" />
                            Live
                          </span>
                        </div>

                        <p className="mt-1.5 text-sm text-united-gray-600 font-mono">
                          {format(matchDate, 'EEE, dd MMM yyyy')}
                          <span className="mx-1.5 text-united-gray-200">&middot;</span>
                          {format(matchDate, 'HH:mm')}
                          <span className="mx-1.5 text-united-gray-200">&middot;</span>
                          <span className="font-sans">{fixture.venue}</span>
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs text-united-gray-600">Logging window closes in</span>
                          <LiveCountdown durationRaw={fixture.window?.time_remaining} />
                        </div>
                      </div>

                      <div className="shrink-0">
                        {!isSelected ? (
                          <button
                            onClick={() => setSelectedFixture(fixture)}
                            className="w-full lg:w-auto inline-flex items-center gap-2 rounded-md bg-united-red px-5 py-2.5 font-semibold text-united-white transition-colors hover:bg-united-red-dark"
                          >
                            Log Attendance
                            <ArrowRightIcon className="h-4 w-4" />
                          </button>
                        ) : (
                          <div className="space-y-3 w-full lg:w-64">
                            <textarea
                              placeholder="Add personal notes..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-united-gray-200 rounded-md text-sm focus:outline-none focus:border-united-red resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleLogAttendance(fixture.id, 'in_person')}
                                disabled={isPending}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-united-red px-3 py-2 text-sm font-semibold text-united-white transition-colors hover:bg-united-red-dark disabled:opacity-50"
                              >
                                {isPending ? (
                                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                                ) : (
                                  'In the Ground'
                                )}
                              </button>
                              <button
                                onClick={() => handleLogAttendance(fixture.id, 'watched')}
                                disabled={isPending}
                                className="flex-1 rounded-md border border-united-gray-200 px-3 py-2 text-sm font-semibold text-united-black transition-colors hover:bg-united-gray-100 disabled:opacity-50"
                              >
                                Watched
                              </button>
                              <button
                                onClick={() => setSelectedFixture(null)}
                                aria-label="Cancel"
                                className="px-2 text-united-gray-600 hover:text-united-black transition-colors"
                              >
                                <XIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Upcoming preview */}
      {upcomingMatches.length > 0 && (
        <div>
          <h3 className="font-serif text-lg text-united-black mb-3">
            Upcoming Matches
            <span className="ml-2 text-sm font-sans font-normal text-united-gray-600">
              ({upcomingMatches.length})
            </span>
          </h3>
          <div className="border border-united-gray-200 rounded-2xl divide-y divide-united-gray-200">
            {upcomingMatches.slice(0, 3).map((fixture: any) => (
              <div key={fixture.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-united-black">vs {fixture.opponent}</span>
                  <span className="text-xs text-united-gray-600 font-mono">
                    {format(new Date(fixture.match_date), 'dd MMM, HH:mm')}
                  </span>
                </div>
                <span className="text-xs text-united-gray-600">Logging opens at kickoff</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- Live countdown (target-timestamp pattern) ---------- */

function parseDurationToMs(timeStr: string | undefined | null): number | null {
  if (!timeStr) return null
  const parts = timeStr.split(':').map((p) => parseFloat(p))
  if (parts.some((p) => Number.isNaN(p))) return null

  let seconds = 0
  if (parts.length === 3) {
    const [h, m, s] = parts
    seconds = h * 3600 + m * 60 + s
  } else if (parts.length === 4) {
    const [d, h, m, s] = parts
    seconds = d * 86400 + h * 3600 + m * 60 + s
  } else {
    return null
  }
  return seconds * 1000
}

function pad(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0')
}

function formatMs(ms: number): string {
  if (ms <= 0) return '00:00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

function LiveCountdown({ durationRaw }: { durationRaw: string | undefined }) {
  // Fixed once per snapshot from the API, then ticks down locally every second —
  // real wall-clock counting, independent of parent re-renders or the 10s refetch.
  const targetTimestamp = useMemo(() => {
    const ms = parseDurationToMs(durationRaw)
    return ms !== null ? Date.now() + ms : null
  }, [durationRaw])

  const [remaining, setRemaining] = useState<number | null>(
    targetTimestamp !== null ? targetTimestamp - Date.now() : null
  )

  useEffect(() => {
    if (targetTimestamp === null) {
      setRemaining(null)
      return
    }
    setRemaining(targetTimestamp - Date.now())
    const id = setInterval(() => {
      setRemaining(Math.max(0, targetTimestamp - Date.now()))
    }, 1000)
    return () => clearInterval(id)
  }, [targetTimestamp])

  if (remaining === null) {
    return <span className="text-xs text-united-gray-600">&mdash;</span>
  }

  return (
    <span className="font-mono tabular-nums text-sm font-bold text-united-red border border-united-red/30 bg-united-red/5 rounded-md px-2 py-0.5">
      {formatMs(remaining)}
    </span>
  )
}

/* ---------- Minimal functional icons ---------- */

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}