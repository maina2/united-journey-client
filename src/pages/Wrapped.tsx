import { useState } from 'react'
import { useWrappedHistory, useGenerateWrapped, useDeleteWrapped } from '../hooks/useWrapped'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { format } from 'date-fns'
import { 
  TrophyIcon, 
  FireIcon, 
  MapPinIcon, 
  TrashIcon,
  GlobeAltIcon,
  CalendarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  StarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid'
import { ShareIcon } from '@heroicons/react/24/outline'

export const Wrapped = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const { data: history, isLoading, refetch } = useWrappedHistory()
  const generateWrapped = useGenerateWrapped()
  const deleteWrapped = useDeleteWrapped()

  const handleGenerate = async () => {
    try {
      await generateWrapped.mutateAsync()
      refetch()
    } catch (error) {
      console.error('Failed to generate wrapped:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Delete this wrapped?')) {
      await deleteWrapped.mutateAsync(id)
      refetch()
      setExpandedId(null)
    }
  }

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl text-united-white">Season Wrapped</h1>
          <p className="text-united-white/60 mt-1">Your season in review.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generateWrapped.isPending}
          className="bg-united-red text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <ArrowPathIcon className={`w-4 h-4 ${generateWrapped.isPending ? 'animate-spin' : ''}`} />
          {generateWrapped.isPending ? 'Generating...' : 'Generate Wrapped'}
        </button>
      </div>

      {/* Wrapped List */}
      {!history || history.length === 0 ? (
        <div className="text-center py-20 bg-united-charcoal rounded-2xl border border-united-white/10">
          <div className="w-20 h-20 bg-united-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrophyIcon className="w-10 h-10 text-united-white/30" />
          </div>
          <h3 className="font-serif text-xl text-united-white mb-1">No wrapped yet</h3>
          <p className="text-united-white/50 text-sm">
            Generate your first season wrapped to see your journey.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((item: any) => {
            const data = item.data || {}
            const stats = data.stats || {}
            const rank = data.rank || {}
            const badges = data.badges || []
            const highlights = data.highlights || []
            const isExpanded = expandedId === item.id
            
            return (
              <div
                key={item.id}
                className="bg-united-charcoal rounded-2xl border border-united-white/10 overflow-hidden hover:border-united-white/20 transition-colors"
              >
                {/* Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-united-white/5 transition-colors"
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl text-united-white">{item.season}</h3>
                      <p className="text-sm text-united-white/60">
                        {item.total_matches} matches • {item.total_points} points
                      </p>
                      <p className="text-xs text-united-white/40 mt-1">
                        Generated {format(new Date(item.generated_at), 'dd MMM yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {data.summary && (
                        <span className="text-sm text-united-gold hidden md:block max-w-[200px] truncate">
                          {data.summary}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (item.share_url) {
                            window.open(item.share_url, '_blank')
                          }
                        }}
                        className="p-2 hover:bg-united-white/10 rounded-lg transition-colors text-united-white/50 hover:text-united-white"
                      >
                        <ShareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(item.id)
                        }}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-united-white/50 hover:text-red-400"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Expand indicator */}
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-xs text-united-white/40">
                      {isExpanded ? '▼ Tap to collapse' : '▶ Tap to expand'}
                    </span>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && data && (
                  <div className="px-6 pb-6 border-t border-united-white/5 pt-4 space-y-4">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <StatBox label="Matches" value={stats.total_matches || 0} color="text-united-gold" />
                      <StatBox label="Win Rate" value={`${stats.win_percentage || 0}%`} color="text-emerald-400" />
                      <StatBox label="Streak" value={stats.current_streak || 0} color="text-orange-400" />
                      <StatBox label="Points" value={stats.total_points || 0} color="text-united-gold" />
                    </div>

                    {/* Extended Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <StatBox label="In Person" value={stats.in_person || 0} color="text-blue-400" />
                      <StatBox label="Grounds" value={stats.grounds_visited || 0} color="text-emerald-400" />
                      <StatBox label="Kits" value={stats.total_kits || 0} color="text-amber-400" />
                      <StatBox label="Miles" value={stats.total_miles || 0} color="text-purple-400" />
                    </div>

                    {/* W/D/L Record */}
                    <div className="flex items-center gap-4 p-3 bg-united-white/5 rounded-xl">
                      <span className="text-sm text-united-white/70">Record:</span>
                      <span className="text-sm font-bold text-emerald-400">{stats.wins || 0}W</span>
                      <span className="text-sm font-bold text-amber-400">{stats.draws || 0}D</span>
                      <span className="text-sm font-bold text-red-400">{stats.losses || 0}L</span>
                    </div>

                    {/* Rank */}
                    {(rank.global_rank || rank.country_rank) && (
                      <div className="flex flex-wrap gap-4 p-3 bg-united-white/5 rounded-xl">
                        {rank.global_rank && (
                          <div className="flex items-center gap-2">
                            <GlobeAltIcon className="w-4 h-4 text-united-gold" />
                            <span className="text-sm text-united-white/70">Global Rank</span>
                            <span className="text-sm font-bold text-united-gold">#{rank.global_rank}</span>
                            <span className="text-xs text-united-white/50">of {rank.total_users}</span>
                          </div>
                        )}
                        {rank.country_rank && rank.country && (
                          <div className="flex items-center gap-2">
                            <MapPinIcon className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-united-white/70">in {rank.country}</span>
                            <span className="text-sm font-bold text-emerald-400">#{rank.country_rank}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Level */}
                    {data.level && (
                      <div className="flex items-center gap-3 p-3 bg-united-white/5 rounded-xl">
                        <span className="text-2xl">{data.level.icon_url || '⭐'}</span>
                        <div>
                          <p className="text-sm font-semibold text-united-white">{data.level.name}</p>
                          <p className="text-xs text-united-white/50">{data.level.description}</p>
                        </div>
                      </div>
                    )}

                    {/* Most Faced Opponent */}
                    {data.most_faced_opponent && (
                      <div className="p-3 bg-united-white/5 rounded-xl">
                        <p className="text-sm text-united-white/70">Most faced opponent</p>
                        <p className="text-lg font-bold text-united-white">
                          {data.most_faced_opponent.opponent} 
                          <span className="text-sm font-normal text-united-white/50 ml-2">
                            ({data.most_faced_opponent.count} times)
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Favorite Match */}
                    {data.favorite_match && (
                      <div className="p-3 bg-united-white/5 rounded-xl">
                        <p className="text-sm text-united-white/70">Favorite match</p>
                        <p className="text-lg font-bold text-united-gold">
                          vs {data.favorite_match.opponent}
                          <span className="text-sm font-normal text-united-white/50 ml-2">
                            {data.favorite_match.score} • {data.favorite_match.points} pts
                          </span>
                        </p>
                        <p className="text-xs text-united-white/40 mt-1">
                          {data.favorite_match.venue} • {format(new Date(data.favorite_match.date), 'dd MMM yyyy')}
                        </p>
                      </div>
                    )}

                    {/* Badges */}
                    {badges.length > 0 && (
                      <div>
                        <p className="text-xs text-united-white/50 uppercase tracking-wider mb-2">Badges Earned</p>
                        <div className="flex flex-wrap gap-2">
                          {badges.slice(0, 8).map((badge: any, i: number) => (
                            <span key={i} className="text-xs bg-united-white/10 px-3 py-1.5 rounded-full text-united-white/80 flex items-center gap-1.5">
                              {badge.icon_url || '🏅'} {badge.name}
                            </span>
                          ))}
                          {badges.length > 8 && (
                            <span className="text-xs bg-united-white/5 px-3 py-1.5 rounded-full text-united-white/50">
                              +{badges.length - 8} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Highlights */}
                    {highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {highlights.map((highlight: string, i: number) => (
                          <span key={i} className="text-xs bg-united-red/20 text-red-300 px-3 py-1 rounded-full">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Summary */}
                    {data.summary && (
                      <div className="mt-2 pt-3 border-t border-united-white/5">
                        <p className="text-sm text-united-white/60 italic">"{data.summary}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-united-white/5 rounded-xl p-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-united-white/50 uppercase tracking-wider">{label}</p>
    </div>
  )
}