import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Sparkles } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'badge'

interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  icon?: string
  duration?: number
  onClose: (id: string) => void
}

export const Toast = ({ id, type, title, message, icon, duration = 5000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose(id)
    }, 300)
  }

  if (!isVisible) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'badge':
        return 'bg-gradient-to-r from-united-red to-red-700 text-white border-united-red/20'
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const getIcon = () => {
    if (icon) return <span className="text-2xl">{icon}</span>
    switch (type) {
      case 'badge':
        return <Sparkles className="w-5 h-5 text-united-gold" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <div
      className={`max-w-sm w-full rounded-2xl shadow-2xl border p-4 transform transition-all duration-300 ${
        isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      } ${getTypeStyles()}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold leading-tight">{title}</p>
          {message && <p className="text-sm mt-0.5 opacity-90">{message}</p>}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 -mt-1 -mr-1 p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 opacity-70 hover:opacity-100" />
        </button>
      </div>
      {type === 'badge' && (
        <div className="mt-2 pt-2 border-t border-white/20">
          <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
            <div className="bg-united-gold h-full rounded-full animate-pulse" style={{ width: '100%' }} />
          </div>
        </div>
      )}
    </div>
  )
}

// Toast Container
export const ToastContainer = ({ toasts, onClose }: { toasts: any[]; onClose: (id: string) => void }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  )
}
