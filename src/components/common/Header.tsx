import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut, Settings, Award } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="bg-[#DA291C] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#DA291C] font-bold text-xl">MU</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My United</h1>
              <p className="text-xs text-white/80">Journey Hub</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">
              Dashboard
            </Link>
            <Link to="/matches" className="hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">
              Matches
            </Link>
            <Link to="/leaderboards" className="hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">
              Leaderboard
            </Link>
            <Link to="/wrapped" className="hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">
              Wrapped
            </Link>
            <Link to="/cards" className="hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">
              Cards
            </Link>

            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/20">
              {user?.is_admin && (
                <Link to="/admin" className="text-yellow-300 hover:text-yellow-200">
                  Admin
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <span className="text-sm font-medium">{user?.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-white/20 flex flex-col gap-2">
            <Link to="/dashboard" className="px-4 py-3 rounded-lg hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
            <Link to="/matches" className="px-4 py-3 rounded-lg hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
              Matches
            </Link>
            <Link to="/leaderboards" className="px-4 py-3 rounded-lg hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
              Leaderboard
            </Link>
            <Link to="/wrapped" className="px-4 py-3 rounded-lg hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
              Wrapped
            </Link>
            <Link to="/cards" className="px-4 py-3 rounded-lg hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
              Cards
            </Link>
            {user?.is_admin && (
              <Link to="/admin" className="px-4 py-3 rounded-lg hover:bg-white/10 text-yellow-300" onClick={() => setIsMenuOpen(false)}>
                Admin
              </Link>
            )}
            <Link to="/profile" className="px-4 py-3 rounded-lg hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout()
                setIsMenuOpen(false)
              }}
              className="px-4 py-3 rounded-lg hover:bg-white/10 text-left text-red-200"
            >
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}
