import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Loader2, ShieldAlert, ArrowRight, Lock, Mail, User, Globe, ChevronRight } from 'lucide-react'

export const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    confirm_password: '',
    country: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      await register(formData)
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Check your inputs.')
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

        {/* LEFT COLUMN: BRANDING & EDITORIAL PANEL */}
        <div className="hidden md:flex md:col-span-5 relative bg-pitch-black p-8 flex-col justify-between border-r border-border-subtle">
          {/* Background Ambient Grid */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#DA291C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Header Tag */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-6 h-6 bg-united-red text-white font-black text-[10px] flex items-center justify-center">
              MU
            </div>
            <span className="font-mono text-[10px] tracking-widest text-text-muted uppercase">
              SUPPORTER ENROLLMENT
            </span>
          </div>

          {/* Hero Copy */}
          <div className="relative z-10 my-auto py-4">
            <span className="text-[9px] font-mono tracking-widest text-united-gold uppercase block mb-1">
              THEATRE OF DREAMS
            </span>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-white mb-2 leading-tight">
              Join the global matchday ledger.
            </h2>
            <p className="text-text-secondary text-xs leading-relaxed font-mono">
              Create your official profile to log stadium attendance, track fixtures, and verify broadcast views.
            </p>
          </div>

          {/* Footer Status Indicator */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-text-muted pt-4 border-t border-border-subtle">
            <span>REGISTRATION OPEN</span>
            <span className="text-united-red flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-united-red animate-pulse" /> GATE 01
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: COMPACT REGISTER FORM */}
        <div className="col-span-1 md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-panel-black">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-white">
                Create Account
              </h1>
              <p className="text-text-muted text-[11px] font-mono mt-0.5">
                Register details to initialize ledger
              </p>
            </div>
            <Link 
              to="/login" 
              className="text-[11px] font-mono text-united-red hover:underline flex items-center gap-1 uppercase tracking-wider font-bold"
            >
              Sign In <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-united-red/10 border border-united-red/40 text-united-red px-3 py-1.5 mb-3 text-[11px] font-mono flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* ROW 1: EMAIL & USERNAME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-text-secondary mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="supporter@manutd.com"
                    className="w-full bg-pitch-black border border-border-strong text-white pl-8 pr-3 py-1.5 text-xs font-mono focus:outline-none focus:border-united-red transition-colors placeholder:text-text-muted/40"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-text-secondary mb-1">
                  Username *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="stretford_end_7"
                    className="w-full bg-pitch-black border border-border-strong text-white pl-8 pr-3 py-1.5 text-xs font-mono focus:outline-none focus:border-united-red transition-colors placeholder:text-text-muted/40"
                    required
                  />
                </div>
              </div>
            </div>

            {/* ROW 2: FULL NAME & COUNTRY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-text-secondary mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Optional"
                    className="w-full bg-pitch-black border border-border-strong text-white pl-8 pr-3 py-1.5 text-xs font-mono focus:outline-none focus:border-united-red transition-colors placeholder:text-text-muted/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-text-secondary mb-1">
                  Country
                </label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Optional"
                    className="w-full bg-pitch-black border border-border-strong text-white pl-8 pr-3 py-1.5 text-xs font-mono focus:outline-none focus:border-united-red transition-colors placeholder:text-text-muted/40"
                  />
                </div>
              </div>
            </div>

            {/* ROW 3: PASSWORDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-text-secondary mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full bg-pitch-black border border-border-strong text-white pl-8 pr-3 py-1.5 text-xs font-mono focus:outline-none focus:border-united-red transition-colors placeholder:text-text-muted/40"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-text-secondary mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <input
                    type="password"
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full bg-pitch-black border border-border-strong text-white pl-8 pr-3 py-1.5 text-xs font-mono focus:outline-none focus:border-united-red transition-colors placeholder:text-text-muted/40"
                    required
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-united-red hover:bg-united-red-dark text-white font-mono font-bold text-xs uppercase tracking-widest py-2.5 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 mt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>CREATING ACCOUNT...</span>
                </>
              ) : (
                <>
                  <span>ENROLL MEMBER PROFILE</span>
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