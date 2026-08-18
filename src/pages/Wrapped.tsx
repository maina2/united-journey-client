import { useState, useEffect } from 'react'
import { useWrappedHistory, useGenerateWrapped, useDeleteWrapped, useWrapped } from '../hooks/useWrapped'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { format } from 'date-fns'
import { 
  TrophyIcon, 
  FireIcon, 
  MapPinIcon, 
  TrashIcon,
  GlobeAltIcon
} from '@heroicons/react/24/solid'
import { ShareIcon } from '@heroicons/react/24/outline'

export const Wrapped = () => {
  const [selectedWrappedId, setSelectedWrappedId] = useState<number | null>(null)
  const [expandedWrapped, setExpandedWrapped] = useState<any>(null)
  const { data: history, isLoading, refetch } = useWrappedHistory()
  const generateWrapped = useGenerateWrapped()
  const deleteWrapped = useDeleteWrapped()

  // Fetch full wrapped data when a history item is selected
  const { data: fullWrapped, isLoading: fullLoading } = useWrapped(
    selectedWrappedId ? String(selectedWrappedId) : ''
  )

  useEffect(() => {
    if (fullWrapped) {
      setExpandedWrapped(fullWrapped)
    }
  }, [fullWrapped])

  const handleGenerate = async () => {
    try {
      const result = await generateWrapped.mutateAsync()
      refetch()
    } catch (error) {
      console.error('Failed to generate wrapped:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Delete this wrapped?')) {
      await deleteWrapped.mutateAsync(id)
      refetch()
      setExpandedWrapped(null)
    }
  }

  const handleViewDetails = (item: any) => {
    setSelectedWrappedId(item.id)
    // Also try to get from the item's data if it exists
    if (item.data) {
      setExpandedWrapped(item.data)
    }
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
          <p className="text-united-white/50 mt-1">Your season in review.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generateWrapped.isPending}
          className="bg-united-red text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {generateWrapped.isPending ? 'Generating...' : 'Generate Wrapped'}
        </button>
      </div>

      {/* Wrapped List */}
      {!history || history.length === 0 ? (
        <div className="text-center py-20 bg-united-charcoal rounded-2xl border border-united-white/10">
          <div className="w-20 h-20 bg-united-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrophyIcon className="w-10 h-10 text-united-white/20" />
          </div>
          <h3 className="font-serif text-xl text-united-white mb-1">No wrapped yet</h3>
          <p className="text-united-white/40 text-sm">
            Generate your first season wrapped to see your journey.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((item: any) => {
            // Try to get data from the item or from expanded state
            const data = item.data || expandedWrapped || {}
            const stats = data.stats || {}
            const rank = data.rank || {}
            const badges = data.badges || []
            const highlights = data.highlights || []
            
            return (
              <div
                key={item.id}
                className="bg-united-charcoal rounded-2xl border border-united-white/10 p-6 hover:border-united-white/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="cursor-pointer" onClick={() => handleViewDetails(item)}>
                    <h3 className="font-serif text-xl text-united-white">{item.season}</h3>
                    <p className="text-sm text-united-white/40">
                      {item.total_matches} matches • {item.total_points} points
                    </p>
                    <p className="text-xs text-united-white/30 mt-1">
                      Generated {format(new Date(item.generated_at), 'dd MMM yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(item.share_url, '_blank')}
                      className="p-2 hover:bg-united-white/10 rounded-lg transition-colors text-united-white/40 hover:text-united-white"
                    >
                      <ShareIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-united-white/40 hover:text-red-400"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Stats Grid - Only show if data exists */}
                {stats.total_matches > 0 && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-united-white/5 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-united-foil">{stats.total_matches || 0}</p>
                        <p className="text-[10px] text-united-white/40 uppercase tracking-wider">Matches</p>
                      </div>
                      <div className="bg-united-white/5 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-emerald-400">{stats.win_percentage || 0}%</p>
                        <p className="text-[10px] text-united-white/40 uppercase tracking-wider">Win Rate</p>
                      </div>
                      <div className="bg-united-white/5 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-orange-400">{stats.current_streak || 0}</p>
                        <p className="text-[10px] text-united-white/40 uppercase tracking-wider">Streak</p>
                      </div>
                      <div className="bg-united-white/5 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-united-foil">{stats.total_points || 0}</p>
                        <p className="text-[10px] text-united-white/40 uppercase tracking-wider">Points</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-united-white/5 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-blue-400">{stats.in_person || 0}</p>
                        <p className="text-[10px] text-united-white/40 uppercase tracking-wider">In Person</p>
                      </div>
                      <div className="bg-united-white/5 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-emerald-400">{stats.grounds_visited || 0}</p>
                        <p className="text-[10px] text-united-white/40 uppercase tracking-wider">Grounds</p>
                      </div>
                      <div className="bg-united-white/5 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-amber-400">{stats.total_kits || 0}</p>
                        <p className="text-[10px] text-united-white/40 uppercase tracking-wider">Kits</p>
                      </div>
                      <div className="bg-united-white/5 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-purple-400">{stats.total_miles || 0}</p>
                        <p className="text-[10px] text-united-white/40 uppercase tracking-wider">Miles</p>
                      </div>
                    </div>

                    {/* Rank */}
                    {(rank.global_rank || rank.country_rank) && (
                      <div className="flex flex-wrap gap-4 mb-4 p-3 bg-united-white/5 rounded-xl">
                        {rank.global_rank && (
                          <div className="flex items-center gap-2">
                            <GlobeAltIcon className="w-4 h-4 text-united-foil" />
                            <span className="text-sm text-united-white/60">Global Rank</span>
                            <span className="text-sm font-bold text-united-foil">#{rank.global_rank}</span>
                            <span className="text-xs text-united-white/30">of {rank.total_users}</span>
                          </div>
                        )}
                        {rank.country_rank && (
                          <div className="flex items-center gap-2">
                            <MapPinIcon className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-united-white/60">Country Rank</span>
                            <span className="text-sm font-bold text-emerald-400">#{rank.country_rank}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Badges */}
                    {badges.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-united-white/40 uppercase tracking-wider mb-2">Badges Earned</p>
                        <div className="flex flex-wrap gap-2">
                          {badges.slice(0, 6).map((badge: any, i: number) => (
                            <span key={i} className="text-xs bg-united-white/10 px-3 py-1 rounded-full text-united-white/60">
                              {badge.icon_url || '🏅'} {badge.name}
                            </span>
                          ))}
                          {badges.length > 6 && (
                            <span className="text-xs bg-united-white/5 px-3 py-1 rounded-full text-united-white/30">
                              +{badges.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Highlights */}
                    {highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-united-white/5">
                        {highlights.map((highlight: string, i: number) => (
                          <span key={i} className="text-xs bg-united-red/10 text-united-red px-3 py-1 rounded-full">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
