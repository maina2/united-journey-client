import { useState, useEffect } from 'react'
import { Clock, AlertCircle, CheckCircle } from 'lucide-react'

interface MatchTimerProps {
  status: 'upcoming' | 'open' | 'closed'
  timeUntil?: string | null
  timeRemaining?: string | null
  opensAt?: string
  closesAt?: string
  isLogged?: boolean
  onOpen?: () => void
}

export const MatchTimer = ({
  status,
  timeUntil,
  timeRemaining,
  opensAt,
  closesAt,
  isLogged = false,
  onOpen,
}: MatchTimerProps) => {
  const [countdown, setCountdown] = useState<string>('')

  useEffect(() => {
    if (status === 'open' && timeRemaining) {
      // Parse the time remaining string and update every second
      const updateCountdown = () => {
        // If timeRemaining is a string like "0:12:34.567", parse it
        const parts = timeRemaining?.split(':') || []
        if (parts.length === 3) {
          const hours = parseInt(parts[0])
          const minutes = parseInt(parts[1])
          const seconds = Math.floor(parseFloat(parts[2]))
          
          const totalSeconds = hours * 3600 + minutes * 60 + seconds
          if (totalSeconds > 0) {
            const h = Math.floor(totalSeconds / 3600)
            const m = Math.floor((totalSeconds % 3600) / 60)
            const s = totalSeconds % 60
            setCountdown(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
          } else {
            setCountdown('00:00:00')
          }
        }
      }

      updateCountdown()
      const interval = setInterval(updateCountdown, 1000)
      return () => clearInterval(interval)
    } else if (status === 'upcoming' && timeUntil) {
      // Similar for upcoming
      const updateCountdown = () => {
        const parts = timeUntil?.split(':') || []
        if (parts.length === 3) {
          const hours = parseInt(parts[0])
          const minutes = parseInt(parts[1])
          const seconds = Math.floor(parseFloat(parts[2]))
          
          const totalSeconds = hours * 3600 + minutes * 60 + seconds
          if (totalSeconds > 0) {
            const h = Math.floor(totalSeconds / 3600)
            const m = Math.floor((totalSeconds % 3600) / 60)
            const s = totalSeconds % 60
            setCountdown(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
          } else {
            setCountdown('00:00:00')
          }
        }
      }

      updateCountdown()
      const interval = setInterval(updateCountdown, 1000)
      return () => clearInterval(interval)
    }
  }, [status, timeRemaining, timeUntil])

  if (status === 'closed') {
    return (
      <div className="flex items-center gap-2 text-united-gray-500">
        <CheckCircle className="w-4 h-4 text-emerald-500" />
        <span className="text-sm font-medium">Window Closed</span>
      </div>
    )
  }

  if (isLogged) {
    return (
      <div className="flex items-center gap-2 text-emerald-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Attendance Logged ✅</span>
      </div>
    )
  }

  if (status === 'open') {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-united-red">
          <Clock className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-medium">Logging Open</span>
        </div>
        <div className="text-xs font-mono text-united-gray-600">
          {countdown || '--:--:--'} remaining
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-united-gray-600">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">Opens in</span>
      </div>
      <div className="text-xs font-mono text-united-gray-500">
        {countdown || '--:--:--'}
      </div>
    </div>
  )
}
