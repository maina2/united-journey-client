import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut, Settings } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

const navLinks = [
  { to: '/news', label: 'News' },
  { to: '/mutv', label: 'MUTV' },
  { to: '/tickets', label: 'Tickets' },
  { to: '/store', label: 'United Store' },
  { to: '/membership', label: 'Membership' },
  { to: '/dashboard', label: 'My United' },
  { to: '/teams', label: 'Teams' },
  { to: '/club', label: 'Club' },
]

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Sponsor bar */}
      <div className="bg-united-black text-united-white">
        <div className="w-full pl-4 pr-4 md:pl-6 md:pr-6 py-3.5 flex items-center gap-5">
          <span className="flex items-center gap-2">
            <AdidasMark className="h-4 w-4" />
            <span className="text-sm font-bold tracking-wide">adidas</span>
          </span>
          <span className="h-4 w-px bg-united-white/30" />
          <span className="flex items-center gap-2">
            <SnapdragonMark className="h-4 w-4" />
            <span className="text-sm font-bold tracking-wide">Snapdragon</span>
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-united-white border-b border-united-gray-200 shadow-sm">
        <div className="w-full pl-4 pr-4 md:pl-6 md:pr-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg"
                  alt="Manchester United"
                  className="h-11 w-11"
                />
              </Link>

              <button
                aria-label="Toggle menu"
                className="hidden md:block text-united-black"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu size={22} />
              </button>

              <nav className="hidden md:flex items-center gap-7 font-serif text-lg text-united-black">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `transition-colors hover:text-united-red ${
                        isActive ? 'text-united-red font-semibold' : ''
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {user.is_admin && (
                    <Link to="/admin" className="hidden md:block text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                      Admin
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 hover:bg-united-gray-100 px-3 py-2 rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-full bg-united-red flex items-center justify-center overflow-hidden">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <User size={16} className="text-united-white" />
                      )}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-united-black">{user.username}</span>
                  </Link>
                  <Link
                    to="/preferences"
                    className="hidden md:flex hover:bg-united-gray-100 px-3 py-2 rounded-lg transition-colors text-united-black"
                  >
                    <Settings size={18} />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hidden md:flex hover:bg-united-gray-100 px-3 py-2 rounded-lg transition-colors text-united-black"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-united-black hover:text-united-red transition-colors">
                  <User size={22} />
                </Link>
              )}

              <button
                className="md:hidden p-2 hover:bg-united-gray-100 rounded-lg transition-colors text-united-black"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <nav className="mt-4 pt-4 border-t border-united-gray-200 flex flex-col gap-1 font-serif text-lg">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg hover:bg-united-gray-100 ${
                      isActive ? 'text-united-red font-semibold' : 'text-united-black'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              {user ? (
                <>
                  <Link to="/profile" className="px-4 py-3 rounded-lg hover:bg-united-gray-100 text-united-black" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/preferences" className="px-4 py-3 rounded-lg hover:bg-united-gray-100 text-united-black" onClick={() => setIsMenuOpen(false)}>
                    Preferences
                  </Link>
                  {user.is_admin && (
                    <Link to="/admin" className="px-4 py-3 rounded-lg hover:bg-united-gray-100 text-yellow-600" onClick={() => setIsMenuOpen(false)}>
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="px-4 py-3 rounded-lg hover:bg-united-gray-100 text-left text-united-red"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="px-4 py-3 rounded-lg bg-united-red text-united-white text-center" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

function AdidasMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="1" y="15" width="22" height="3" transform="rotate(-14 12 16.5)" />
      <rect x="1" y="9.5" width="22" height="3" transform="rotate(-14 12 11)" />
      <rect x="1" y="4" width="22" height="3" transform="rotate(-14 12 5.5)" />
    </svg>
  )
}

function SnapdragonMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 14c1.2 1.6 2.6 2.4 4 2.4 2.6 0 4.6-1.9 4.6-4.4S14.6 7.6 12 7.6c-1.2 0-2.4.6-3.4 1.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
