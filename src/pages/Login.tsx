import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Loader2, ShieldAlert, ArrowRight, Lock, Mail, ChevronRight } from 'lucide-react'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Verify credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-pitch-black text-text-primary font-sans flex items-center justify-center p-4 selection:bg-united-red selection:text-white">
      
      {/* COMPACT FLOATING CONTAINER */}
      <div className="w-full max-w-4xl bg-panel-black border border-border-strong grid grid-cols-1 md:grid-cols-12 overflow-hidden shadow-2xl relative">
        
        {/* TOP ACCENT LINE */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-united-red z-20" />

        {/* LEFT COLUMN: BRANDING & COMPACT EDITORIAL PANEL */}
        <div className="hidden md:flex md:col-span-5 relative bg-pitch-black p-8 flex-col justify-between border-r border-border-subtle">
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#DA291C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Header Tag */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-6 h-6 bg-united-red text-white font-black text-[10px] flex items-center justify-center">
              MU
            </div>
            <span className="font-mono text-[10px] tracking-widest text-text-muted uppercase">
              SUPPORTER LEDGER
            </span>
          </div>

          {/* Hero Copy */}
          <div className="relative z-10 my-auto py-4">
            <span className="text-[9px] font-mono tracking-widest text-united-gold uppercase block mb-1">
              THEATRE OF DREAMS
            </span>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-white mb-2 leading-tight">
              Welcome back to Old Trafford.
            </h2>
            <p className="text-text-secondary text-xs leading-relaxed font-mono">
              Access your matchday history, turnstile records, and personal supporter metrics.
            </p>
          </div>

          {/* Footer Status Indicator */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-text-muted pt-4 border-t border-border-subtle">
            <span>GATEWAY 01</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> READY
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: COMPACT AUTH FORM */}
        <div className="col-span-1 md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-panel-black">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-white">
                Member Sign In
              </h1>
              <p className="text-text-muted text-[11px] font-mono mt-0.5">
                Authenticate to load profile
              </p>
            </div>
            <Link 
              to="/register" 
              className="text-[11px] font-mono text-united-red hover:underline flex items-center gap-1 uppercase tracking-wider font-bold"
            >
              Register <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-united-red/10 border border-united-red/40 text-united-red px-3 py-2 mb-4 text-[11px] font-mono flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-text-secondary mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="supporter@manutd.com"
                  className="w-full bg-pitch-black border border-border-strong text-white pl-9 pr-3 py-2 text-xs font-mono focus:outline-none focus:border-united-red transition-colors placeholder:text-text-muted/40"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-text-secondary">
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-[10px] font-mono text-text-muted hover:text-white transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-pitch-black border border-border-strong text-white pl-9 pr-3 py-2 text-xs font-mono focus:outline-none focus:border-united-red transition-colors placeholder:text-text-muted/40"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-united-red hover:bg-united-red-dark text-white font-mono font-bold text-xs uppercase tracking-widest py-3 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>SIGN IN TO DASHBOARD</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>

    </div>
  )
}