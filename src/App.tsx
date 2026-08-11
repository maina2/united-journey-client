import { useState } from 'react'
import { Calendar, Trophy, Users, Star, Menu, X } from 'lucide-react'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - United Red */}
      <header className="bg-[#DA291C] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#DA291C] font-bold text-xl">MU</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">My United</h1>
                <p className="text-xs text-white/80">Journey Hub</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'bg-white/20 font-semibold' 
                    : 'hover:bg-white/10'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('matches')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'matches' 
                    ? 'bg-white/20 font-semibold' 
                    : 'hover:bg-white/10'
                }`}
              >
                Matches
              </button>
              <button 
                onClick={() => setActiveTab('leaderboard')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'leaderboard' 
                    ? 'bg-white/20 font-semibold' 
                    : 'hover:bg-white/10'
                }`}
              >
                Leaderboard
              </button>
              <button className="bg-white text-[#DA291C] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Log In
              </button>
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
              <button 
                onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false) }}
                className={`px-4 py-3 rounded-lg transition-colors text-left ${
                  activeTab === 'dashboard' 
                    ? 'bg-white/20 font-semibold' 
                    : 'hover:bg-white/10'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => { setActiveTab('matches'); setIsMenuOpen(false) }}
                className={`px-4 py-3 rounded-lg transition-colors text-left ${
                  activeTab === 'matches' 
                    ? 'bg-white/20 font-semibold' 
                    : 'hover:bg-white/10'
                }`}
              >
                Matches
              </button>
              <button 
                onClick={() => { setActiveTab('leaderboard'); setIsMenuOpen(false) }}
                className={`px-4 py-3 rounded-lg transition-colors text-left ${
                  activeTab === 'leaderboard' 
                    ? 'bg-white/20 font-semibold' 
                    : 'hover:bg-white/10'
                }`}
              >
                Leaderboard
              </button>
              <button className="bg-white text-[#DA291C] px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-100 transition-colors">
                Log In
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm font-medium">Matches</h3>
              <Calendar className="text-[#DA291C]" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">47</p>
            <p className="text-sm text-gray-500 mt-1">+3 this season</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm font-medium">Win Rate</h3>
              <Trophy className="text-[#DA291C]" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">68%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-[#DA291C] h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm font-medium">Grounds Visited</h3>
              <Users className="text-[#DA291C]" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-500 mt-1">5 new this season</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm font-medium">Level</h3>
              <Star className="text-[#DA291C]" size={20} />
            </div>
            <p className="text-3xl font-bold text-[#DA291C]">Gold</p>
            <p className="text-sm text-gray-500 mt-1">1,247 points</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Matches List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Matches</h2>
              <div className="space-y-3">
                {[
                  { opponent: 'Liverpool', score: '2-1', result: 'W', date: 'Aug 10, 2026' },
                  { opponent: 'Arsenal', score: '1-1', result: 'D', date: 'Aug 3, 2026' },
                  { opponent: 'Chelsea', score: '3-0', result: 'W', date: 'Jul 27, 2026' },
                  { opponent: 'Manchester City', score: '0-2', result: 'L', date: 'Jul 20, 2026' },
                ].map((match, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-50">
                    <div className="flex items-center gap-4">
                      <span className={`font-bold px-3 py-1 rounded-lg text-sm ${
                        match.result === 'W' ? 'bg-green-100 text-green-700' :
                        match.result === 'D' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {match.result}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">{match.opponent}</p>
                        <p className="text-sm text-gray-500">{match.date}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{match.score}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="united-btn w-full mt-4 text-center">
                View All Matches
              </button>
            </div>
          </div>

          {/* Sidebar - Badges & Quick Actions */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Badges</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Old Trafford Regular', emoji: '🏟️' },
                  { name: 'Away Day Warrior', emoji: '🛫' },
                  { name: 'European Nights', emoji: '🌙' },
                  { name: 'Streak Master', emoji: '🔥' },
                ].map((badge, index) => (
                  <div key={index} className="bg-gray-50 px-3 py-2 rounded-lg flex items-center gap-2 border border-gray-100">
                    <span className="text-xl">{badge.emoji}</span>
                    <span className="text-sm font-medium text-gray-700">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#DA291C] text-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">Ready to Log a Match?</h2>
              <p className="text-white/80 text-sm mb-4">Track your attendance and earn points</p>
              <button className="bg-white text-[#DA291C] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-full">
                Log Match →
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>© 2026 My United Journey. Made with ❤️ for Manchester United fans</p>
          <p className="mt-1">🔴 Glory Glory Man United</p>
        </footer>
      </main>
    </div>
  )
}

export default App
