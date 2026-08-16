import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

interface LeaderboardUser {
  rank: number
  user_id: number
  username: string
  full_name: string | null
  avatar_url: string | null
  country: string | null
  total_points: number
  total_matches: number
  current_streak: number
  total_in_person: number
  wins: number
  badges_count: number
  total_kits: number
  total_spend: number
  total_miles: number
}

interface Category {
  id: string
  label: string
  unit: string
}

const categories: Category[] = [
  { id: 'points', label: 'Points', unit: 'pts' },
  { id: 'matches', label: 'Matches', unit: 'matches' },
  { id: 'streak', label: 'Streak', unit: '🔥' },
  { id: 'in_person', label: 'In Person', unit: 'grounds' },
  { id: 'wins', label: 'Wins', unit: 'wins' },
  { id: 'kits', label: 'Kit Collector', unit: '👕' },
  { id: 'spend', label: 'Derby Day Spender', unit: '£' },
  { id: 'miles', label: 'Red Mile', unit: 'mi' },
]

function categoryValue(user: LeaderboardUser, categoryId: string): number {
  switch (categoryId) {
    case 'points': return user.total_points
    case 'matches': return user.total_matches
    case 'streak': return user.current_streak
    case 'in_person': return user.total_in_person
    case 'wins': return user.wins
    case 'kits': return user.total_kits || 0
    case 'spend': return user.total_spend || 0
    case 'miles': return user.total_miles || 0
    default: return 0
  }
}

function categoryDisplayValue(user: LeaderboardUser, categoryId: string): string {
  const val = categoryValue(user, categoryId)
  if (categoryId === 'spend') return `£${val.toLocaleString()}`
  if (categoryId === 'miles') return `${val.toLocaleString()}`
  if (categoryId === 'kits') return `${val}`
  if (categoryId === 'streak') return `${val}`
  return val.toLocaleString()
}

function podiumAccent(rank: number): string {
  if (rank === 1) return 'bg-united-foil'
  if (rank === 2) return 'bg-gray-400'
  if (rank === 3) return 'bg-amber-700'
  return 'bg-united-gray-200'
}

// Helper to get the query key for a category
const getLeaderboardKey = (category: string, page: number, view: string) => 
  ['leaderboards', category, page, view]

export const Leaderboards = () => {
  const [selectedCategory, setSelectedCategory] = useState('points')
  const [currentPage, setCurrentPage] = useState(1)
  const [view, setView] = useState<'global' | 'country'>('global')
  const limit = 20
  const queryClient = useQueryClient()

  // Prefetch all categories in the background
  useEffect(() => {
    const prefetchAllCategories = async () => {
      // Get all categories except the current one (already loading)
      const categoriesToPrefetch = categories
        .map(c => c.id)
        .filter(id => id !== selectedCategory)

      // Prefetch each category
      for (const categoryId of categoriesToPrefetch) {
        await queryClient.prefetchQuery({
          queryKey: getLeaderboardKey(categoryId, currentPage, view),
          queryFn: async () => {
            const response = await apiClient.get('/leaderboards', {
              params: { category: categoryId, page: currentPage, limit },
            })
            return response.data
          },
          staleTime: 60000, // 1 minute
        })
      }
    }

    prefetchAllCategories()
  }, [currentPage, view, selectedCategory, queryClient, limit])

  // Main query for current category
  const { data: leaderboardData, isLoading, refetch } = useQuery({
    queryKey: getLeaderboardKey(selectedCategory, currentPage, view),
    queryFn: async () => {
      const response = await apiClient.get('/leaderboards', {
        params: { category: selectedCategory, page: currentPage, limit },
      })
      return response.data
    },
    staleTime: 60000, // 1 minute
  })

  const { data: myRank } = useQuery({
    queryKey: ['leaderboards', 'my-rank', selectedCategory],
    queryFn: async () => {
      const response = await apiClient.get('/leaderboards/my-rank', {
        params: { category: selectedCategory },
      })
      return response.data
    },
    staleTime: 60000,
  })

  const { data: stats } = useQuery({
    queryKey: ['leaderboards', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/leaderboards/stats')
      return response.data
    },
    staleTime: 60000,
  })

  const users = leaderboardData?.results || []
  const totalPages = Math.ceil((leaderboardData?.total || 0) / limit)
  const activeCategory = categories.find((c) => c.id === selectedCategory)!

  // Check if data is loading (only show spinner on initial load)
  const isInitialLoading = isLoading && !leaderboardData

  // Handle category change - instant switch using cached data
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  if (isInitialLoading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      {/* ---------- Masthead ---------- */}
      <section className="relative overflow-hidden bg-united-black">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 9px)',
          }}
        />
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-united-foil via-united-gold to-united-foil" />

        <div className="relative max-w-5xl mx-auto px-4 md:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-xs font-bold tracking-[0.25em] text-united-red uppercase">
                My United &middot; Global Rankings
              </span>
              <h1 className="mt-2 font-serif text-4xl md:text-5xl text-united-white leading-tight">
                Leaderboards
              </h1>
              <p className="mt-2 text-united-white/50">Compete with United fans around the world.</p>
            </div>

            <div className="inline-flex rounded-md border border-united-white/20 overflow-hidden self-start">
              <button
                onClick={() => {
                  setView('global')
                  setCurrentPage(1)
                }}
                className={`px-4 py-2 text-xs font-bold tracking-[0.1em] uppercase transition-colors ${
                  view === 'global' ? 'bg-united-white text-united-black' : 'text-united-white/60 hover:text-united-white'
                }`}
              >
                Global
              </button>
              <button
                onClick={() => {
                  setView('country')
                  setCurrentPage(1)
                }}
                className={`px-4 py-2 text-xs font-bold tracking-[0.1em] uppercase transition-colors ${
                  view === 'country' ? 'bg-united-white text-united-black' : 'text-united-white/60 hover:text-united-white'
                }`}
              >
                Country
              </button>
            </div>
          </div>

          {stats && (
            <div className="mt-10 grid grid-cols-3 divide-x divide-united-white/10 border-t border-united-white/10 pt-6">
              <StatBlock label="Total Fans" value={stats.total_users} />
              <StatBlock label="Total Points" value={stats.total_points.toLocaleString()} accent="text-united-foil" />
              <StatBlock label="Matches Logged" value={stats.total_matches.toLocaleString()} accent="text-united-pitch" />
            </div>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        {/* ---------- Category tabs ---------- */}
        <div className="flex gap-7 border-b border-united-gray-200 mb-8 overflow-x-auto">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id
            // Check if this category is cached (for visual feedback)
            const isCached = queryClient.getQueryData(
              getLeaderboardKey(cat.id, currentPage, view)
            )
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`relative pb-3 whitespace-nowrap font-serif text-lg transition-colors ${
                  isActive ? 'text-united-black font-semibold' : 'text-united-gray-600 hover:text-united-black'
                }`}
              >
                {cat.label}
                {isCached && !isActive && (
                  <span className="absolute -top-1 right-0 translate-x-full text-[8px] text-emerald-500">●</span>
                )}
                {isActive && <span className="absolute left-0 -bottom-px h-0.5 w-full bg-united-black" />}
              </button>
            )
          })}
        </div>

        {/* ---------- Your rank ---------- */}
        {myRank && myRank.rank && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-united-charcoal to-united-black p-6 mb-8">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-united-foil via-united-gold to-united-foil" />
            <div className="relative flex items-center justify-between gap-6 flex-wrap">
              <div>
                <span className="text-xs font-bold tracking-[0.2em] text-united-white/50 uppercase">
                  Your Standing
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono tabular-nums text-4xl font-bold text-united-white">
                    #{myRank.rank}
                  </span>
                  <span className="text-sm text-united-white/50">of {myRank.total_users} fans</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold tracking-[0.2em] text-united-white/50 uppercase">
                  {activeCategory.label}
                </span>
                <p className="mt-1 font-mono tabular-nums text-3xl font-bold text-united-foil">
                  {myRank.value}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ---------- Table ---------- */}
        {users.length === 0 ? (
          <div className="border border-united-gray-200 rounded-2xl p-14 text-center">
            <p className="font-serif text-xl text-united-black mb-1">No rankings yet.</p>
            <p className="text-united-gray-600">Start logging matches to climb the table.</p>
          </div>
        ) : (
          <div className="border border-united-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-united-gray-100 border-b border-united-gray-200">
                  <th className="px-5 py-3 text-left text-[11px] font-bold tracking-[0.12em] text-united-gray-600 uppercase">Pos</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold tracking-[0.12em] text-united-gray-600 uppercase">Fan</th>
                  <th className="px-5 py-3 text-right text-[11px] font-bold tracking-[0.12em] text-united-gray-600 uppercase">
                    {activeCategory.label}
                  </th>
                  <th className="px-5 py-3 text-center text-[11px] font-bold tracking-[0.12em] text-united-gray-600 uppercase">Badges</th>
                  <th className="px-5 py-3 text-right text-[11px] font-bold tracking-[0.12em] text-united-gray-600 uppercase">Country</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-united-gray-200">
                {users.map((user: LeaderboardUser) => (
                  <tr key={user.user_id} className="hover:bg-united-gray-100 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`h-6 w-1 rounded-full ${podiumAccent(user.rank)}`} />
                        <span className="font-mono tabular-nums font-bold text-united-black">{user.rank}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-united-black flex items-center justify-center overflow-hidden shrink-0">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.username} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-united-white">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-united-black truncate">
                            {user.full_name || user.username}
                          </p>
                          <p className="text-xs text-united-gray-600 truncate">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-mono tabular-nums font-bold text-united-black">
                        {categoryDisplayValue(user, selectedCategory)}
                      </span>
                      <span className="ml-1 text-xs text-united-gray-600">{activeCategory.unit}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="font-mono tabular-nums font-semibold text-united-foil">
                        {user.badges_count}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm text-united-gray-600">
                      {user.country || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-united-gray-200">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="text-xs font-bold tracking-[0.1em] uppercase px-3 py-2 text-united-black disabled:text-united-gray-200 hover:text-united-red transition-colors disabled:hover:text-united-gray-200"
                >
                  Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1
                  const isActive = page === currentPage
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 w-9 rounded-md font-mono text-sm font-bold transition-colors ${
                        isActive
                          ? 'bg-united-black text-united-white'
                          : 'border border-united-gray-200 text-united-black hover:border-united-black'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                {totalPages > 5 && <span className="px-2 text-united-gray-600">&hellip;</span>}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="text-xs font-bold tracking-[0.1em] uppercase px-3 py-2 text-united-black disabled:text-united-gray-200 hover:text-united-red transition-colors disabled:hover:text-united-gray-200"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function StatBlock({
  label,
  value,
  accent = 'text-united-white',
}: {
  label: string
  value: string | number
  accent?: string
}) {
  return (
    <div className="px-6 first:pl-0">
      <p className="text-[11px] font-bold tracking-[0.15em] text-united-white/40 uppercase mb-1.5">{label}</p>
      <span className={`font-mono tabular-nums text-2xl font-bold ${accent}`}>{value}</span>
    </div>
  )
}
