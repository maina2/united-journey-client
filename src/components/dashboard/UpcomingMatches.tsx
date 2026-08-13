import { useState, useEffect, useMemo } from 'react'
import { useUpcomingWindows, useLogAttendance } from '../../hooks/useMatches'
import { format } from 'date-fns'

export const UpcomingMatches = () => {
  const { data: fixtures, isLoading, refetch } = useUpcomingWindows()
  const logAttendance = useLogAttendance()
  const [loggingId, setLoggingId] = useState<number | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Auto-refresh every 30s so window status transitions (upcoming -> open -> closed)
  // catch up with the server. The countdown itself ticks locally every second below,
  // independent of this — so numbers move smoothly between refetches.
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshing(true)
      refetch().finally(() => setRefreshing(false))
    }, 30000)
    return () => clearInterval(interval)
  }, [refetch])

  const handleLogAttendance = async (fixtureId: number, attendanceType: 'in_person' | 'watched') => {
    setLoggingId(fixtureId)
    try {
      await logAttendance.mutateAsync({ fixtureId, attendance_type: attendanceType })
      await refetch()
    } catch (error) {
      console.error('Failed to log attendance:', error)
    } finally {
      setLoggingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-united-gray-200 bg-united-white p-6">
        <div className="flex items-center gap-3 text-united-gray-600">
          <span className="h-4 w-4 rounded-full border-2 border-united-gray-300 border-t-united-red animate-spin" />
          <span className="text-sm">Loading upcoming fixtures&hellip;</span>
        </div>
      </div>
    )
  }

  const list = Array.isArray(fixtures) ? fixtures : []

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-united-gray-200 bg-united-white p-8 text-center">
        <p className="font-serif text-lg text-united-black mb-1">No fixtures on the horizon.</p>
        <p className="text-sm text-united-gray-600">Check back once the schedule is announced.</p>
      </div>
    )
  }

  const openCount = list.filter((f: any) => f.window?.status === 'open' && !f.is_logged).length
  const upcomingCount = list.filter((f: any) => f.window?.status === 'upcoming').length
  const loggedCount = list.filter((f: any) => f.is_logged).length

  return (
    <div className="rounded-2xl border border-united-gray-200 bg-united-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-united-gray-200 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl text-united-black">Upcoming Fixtures</h2>
          <div className="flex items-center gap-3 mt-1 text-xs text-united-gray-600">
            <CountDot color="bg-united-red" label={`${openCount} open`} />
            <CountDot color="bg-united-gray-200" label={`${upcomingCount} upcoming`} />
            <CountDot color="bg-united-pitch" label={`${loggedCount} logged`} />
          </div>
        </div>
        <button
          onClick={() => {
            setRefreshing(true)
            refetch().finally(() => setRefreshing(false))
          }}
          disabled={refreshing}
          aria-label="Refresh fixtures"
          className="p-2 rounded-md hover:bg-united-gray-100 transition-colors text-united-gray-600"
        >
          <RefreshIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Fixture list */}
      <div className="divide-y divide-united-gray-200">
        {list.slice(0, 5).map((fixture: any) => {
          const isOpen = fixture.window?.status === 'open'
          const isUpcoming = fixture.window?.status === 'upcoming'
          const isClosed = fixture.window?.status === 'closed'
          const isLogged = fixture.is_logged
          const matchDate = new Date(fixture.match_date)
          const isPending = logAttendance.isPending && loggingId === fixture.id

          const accentClass = isLogged ? 'bg-united-pitch' : isOpen ? 'bg-united-red' : 'bg-united-gray-200'

          return (
            <div key={fixture.id} className="flex gap-4 px-6 py-4">
              <div className={`w-1 shrink-0 rounded-full ${accentClass}`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
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
                    </div>
                    <p className="mt-1 text-sm text-united-gray-600 font-mono">
                      {format(matchDate, 'EEE, dd MMM yyyy')}
                      <span className="mx-1.5 text-united-gray-200">&middot;</span>
                      {format(matchDate, 'HH:mm')}
                      <span className="mx-1.5 text-united-gray-200">&middot;</span>
                      <span className="font-sans">{fixture.venue}</span>
                    </p>
                  </div>

                  <FixtureTimer
                    status={fixture.window?.status}
                    timeRemainingRaw={fixture.window?.time_remaining}
                    timeUntilRaw={fixture.window?.time_until}
                    isLogged={isLogged}
                  />
                </div>

                {isOpen && !isLogged && (
                  <div className="mt-3 pt-3 border-t border-united-gray-200 flex gap-2">
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
                  </div>
                )}

                {isLogged && (
                  <p className="mt-2 text-xs font-semibold text-united-pitch flex items-center gap-1.5">
                    <CheckIcon className="h-3.5 w-3.5" />
                    Logged as {fixture.attendance_type === 'in_person' ? 'In the Ground' : 'Watched'}
                  </p>
                )}

                {isClosed && !isLogged && (
                  <p className="mt-2 text-xs text-united-gray-600">Logging window has closed.</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      {list.length > 5 && (
        <div className="px-6 py-3 border-t border-united-gray-200 text-center">
          <button className="inline-flex items-center gap-1 text-sm font-semibold text-united-red hover:text-united-red-dark transition-colors">
            View all {list.length} fixtures
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

/* ---------- Live countdown ---------- */

// Parses "H:MM:SS.mmm" (or "D:H:MM:SS") style strings from the API into milliseconds.
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
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (days > 0) return `${days}d ${pad(hours)}h ${pad(minutes)}m`
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

function FixtureTimer({
  status,
  timeRemainingRaw,
  timeUntilRaw,
  isLogged,
}: {
  status: 'open' | 'upcoming' | 'closed' | undefined
  timeRemainingRaw: string | undefined
  timeUntilRaw: string | undefined
  isLogged: boolean
}) {
  const isOpen = status === 'open' && !isLogged
  const isUpcoming = status === 'upcoming'

  // Compute a fixed target timestamp once per snapshot from the API, then tick
  // down from it locally every second — this is what makes it a real timer
  // rather than a value that only updates when the parent refetches.
  const targetTimestamp = useMemo(() => {
    const raw = isOpen ? timeRemainingRaw : isUpcoming ? timeUntilRaw : null
    const ms = parseDurationToMs(raw)
    return ms !== null ? Date.now() + ms : null
  }, [isOpen, isUpcoming, timeRemainingRaw, timeUntilRaw])

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

  if (isLogged) {
    return (
      <span className="shrink-0 text-xs font-bold tracking-[0.1em] uppercase text-united-pitch">
        Logged
      </span>
    )
  }

  if (status === 'closed') {
    return (
      <span className="shrink-0 text-xs font-bold tracking-[0.1em] uppercase text-united-gray-600">
        Closed
      </span>
    )
  }

  if (remaining === null) {
    return <span className="shrink-0 text-xs text-united-gray-600">&mdash;</span>
  }

  return (
    <div className="shrink-0 text-right">
      <span
        className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.1em] uppercase ${
          isOpen ? 'text-united-red' : 'text-united-gray-600'
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-united-red animate-pulse' : 'bg-united-gray-200'}`} />
        {isOpen ? 'Window closes in' : 'Opens in'}
      </span>
      <div
        className={`mt-1 font-mono tabular-nums text-lg font-bold rounded-md border px-3 py-1 ${
          isOpen
            ? 'text-united-red border-united-red/30 bg-united-red/5'
            : 'text-united-black border-united-gray-200'
        }`}
      >
        {formatMs(remaining)}
      </div>
    </div>
  )
}

/* ---------- Small pieces ---------- */

function CountDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
      {label}
    </span>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 4v5h5M20 20v-5h-5M4.5 15a8 8 0 0 0 14.5 2M19.5 9A8 8 0 0 0 5 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}