import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut, Settings, ChevronRight } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

const navLinks = [
  { to: '/news', label: 'News' },
  { to: '/mutv', label: 'MUTV' },
  { to: '/tickets', label: 'Tickets' },
  { to: '/store', label: 'United Store' },
  { to: '/membership', label: 'Membership' },
  { to: '/dashboard', label: 'My United', isDropdown: true },
  { to: '/teams', label: 'Teams' },
  { to: '/club', label: 'Club' },
]

const myUnitedSubLinks = [
  { to: '/dashboard', label: 'Dashboard', hasSub: false },
  { to: '/matches', label: 'Match Log', hasSub: true },
  { to: '/statistics', label: 'Statistics', hasSub: false },
  { to: '/leaderboards', label: 'Leaderboards', hasSub: true },
  { to: '/badges', label: 'Badges', hasSub: false },
  { to: '/wrapped', label: 'Season Wrapped', hasSub: false },
  { to: '/cards', label: 'Story Cards', hasSub: true },
]

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle scroll - hide sponsor bar when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle mega-dropdown hover state
  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
      dropdownTimeoutRef.current = null
    }
    setActiveDropdown(label)
  }

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 180)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-united-white border-b border-united-gray-200">
      {/* Sponsor bar - hides on scroll */}
      <div 
        className={`bg-united-black text-united-white transition-all duration-300 overflow-hidden ${
          isScrolled ? 'h-0 py-0 opacity-0' : 'h-10 py-2 opacity-100'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center gap-6">
          <span className="flex items-center gap-2">
            <AdidasMark className="h-4 w-4" />
          </span>
          <span className="flex items-center gap-2">
            <SnapdragonMark className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="relative bg-united-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            
            {/* Left Nav Group */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg"
                  alt="Manchester United"
                  className="h-10 w-10 md:h-12 md:w-12"
                />
              </Link>

              <button
                aria-label="Toggle menu"
                className="hidden md:block text-united-black p-1 hover:bg-united-gray-100 rounded transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu size={24} />
              </button>

              <nav className="hidden md:flex items-center gap-8 font-serif text-lg text-united-black">
                {navLinks.map((link) => {
                  const isHovered = activeDropdown === link.label

                  return (
                    <div
                      key={link.to}
                      className="relative py-2"
                      onMouseEnter={() => link.isDropdown && handleDropdownEnter(link.label)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                          `transition-colors duration-200 flex items-center gap-1 font-serif tracking-tight ${
                            isActive || isHovered ? 'text-united-black font-semibold' : 'text-united-black/80 hover:text-united-black'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>

                      {/* Signature Red Underline Accent when active/hovered */}
                      {(isHovered) && (
                        <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-united-red" />
                      )}
                    </div>
                  )
                })}
              </nav>
            </div>

            {/* Right User Controls */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {user.is_admin && (
                    <Link to="/admin" className="hidden md:block text-yellow-600 hover:text-yellow-700 text-xs uppercase tracking-wider font-bold">
                      Admin
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 hover:bg-united-gray-100 px-3 py-2 rounded-md transition-colors">
                    <div className="w-8 h-8 rounded-full bg-united-black flex items-center justify-center overflow-hidden border border-united-gray-200">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <User size={18} className="text-white" />
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="hidden md:flex hover:bg-united-gray-100 p-2 rounded-md transition-colors text-united-black"
                  >
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-united-black hover:text-united-red transition-colors p-2">
                  <User size={24} />
                </Link>
              )}

              <button
                className="md:hidden p-2 hover:bg-united-gray-100 rounded-md transition-colors text-united-black"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          </div>
        </div>

        {/* FULL SCREEN MEGA-NAV DROPDOWN PANEL */}
        {activeDropdown === 'My United' && (
          <div
            className="absolute top-full left-0 w-screen bg-united-white border-t border-united-gray-200 shadow-2xl z-50 transition-all duration-200"
            onMouseEnter={() => handleDropdownEnter('My United')}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10">
              <div className="grid grid-cols-12 gap-8">
                
                {/* Left Column: Menu Links (Exact match to official layout) */}
                <div className="col-span-7 space-y-4">
                  {myUnitedSubLinks.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="group flex items-center justify-between text-united-black font-serif text-2xl tracking-tight py-1.5 hover:text-united-red transition-colors max-w-sm"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <span>{item.label}</span>
                      {item.hasSub && (
                        <ChevronRight className="w-5 h-5 text-united-black group-hover:text-united-red transition-colors" />
                      )}
                    </Link>
                  ))}
                </div>

                {/* Right Column: Featured Official Promo Section */}
                <div className="col-span-5">
                  <Link
                    to="/matches"
                    className="group relative block w-full h-[320px] rounded-2xl overflow-hidden bg-united-black shadow-lg"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80"
                      alt="Theatre of Dreams"
                      className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-united-black via-united-black/30 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="text-[10px] font-mono tracking-widest text-united-gold uppercase font-bold block mb-1">
                        MATCHDAY EXP
                      </span>
                      <h4 className="font-serif text-2xl text-white font-bold tracking-tight">
                        Track Your Journey at Old Trafford
                      </h4>
                    </div>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-united-gray-200 bg-united-white px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <div key={link.to}>
              <NavLink
                to={link.to}
                className="block font-serif text-2xl text-united-black py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
              {link.isDropdown && (
                <div className="pl-4 border-l-2 border-united-red my-2 space-y-2">
                  {myUnitedSubLinks.map((sub) => (
                    <Link
                      key={sub.to}
                      to={sub.to}
                      className="block text-base text-united-gray-600 py-1 font-sans"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  )
}

function AdidasMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 18h-4.2L12 8.4 14.5 4h4.3L22 18zM14.7 18h-4.2L7 11.2 9.5 6.8h4.3L14.7 18zM7.4 18H3.2L0 13.6h4.3L7.4 18z" />
    </svg>
  )
}

function SnapdragonMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" fill="none" />
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