import { useState } from 'react'
import { useAvailableBadges, useMyBadges } from '../hooks/useBadges'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { BadgeDetailModal } from '../components/badges/BadgeDetailModal'

export const Badges = () => {
  const { data: availableBadges, isLoading: availableLoading } = useAvailableBadges()
  const { data: myBadges, isLoading: myLoading } = useMyBadges()
  const [selectedBadge, setSelectedBadge] = useState<any>(null)
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const isLoading = availableLoading || myLoading

  if (isLoading) {
    return <LoadingSpinner />
  }

  let filteredBadges = availableBadges || []

  if (filter === 'earned') {
    filteredBadges = filteredBadges.filter((b: any) => b.is_earned)
  } else if (filter === 'locked') {
    filteredBadges = filteredBadges.filter((b: any) => !b.is_earned)
  }

  if (searchTerm) {
    filteredBadges = filteredBadges.filter(
      (b: any) =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  filteredBadges = [...filteredBadges].sort((a: any, b: any) => {
    if (a.is_earned && !b.is_earned) return -1
    if (!a.is_earned && b.is_earned) return 1
    return b.progress_percentage - a.progress_percentage
  })

  const earnedCount = availableBadges?.filter((b: any) => b.is_earned).length || 0
  const totalCount = availableBadges?.length || 0
  const overallPct = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0

  const filters: { id: 'all' | 'earned' | 'locked'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'earned', label: 'Earned' },
    { id: 'locked', label: 'Locked' },
  ]

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
          <span className="text-xs font-bold tracking-[0.25em] text-united-red uppercase">
            My United &middot; Honours
          </span>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl text-united-white leading-tight">Badges</h1>
          <p className="mt-2 text-united-white/50">
            Track your progress and unlock honours as you grow your United journey.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <span className="font-mono tabular-nums text-lg font-bold text-united-white shrink-0">
              {earnedCount} / {totalCount}
            </span>
            <div className="flex-1 max-w-xs h-1.5 rounded-full bg-united-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-united-white/40 to-united-foil transition-all duration-700"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <span className="text-xs text-united-white/50 shrink-0">earned</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        {/* ---------- Filter tabs + search ---------- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex gap-7 border-b border-united-gray-200 sm:border-b-0">
            {filters.map((f) => {
              const isActive = filter === f.id
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`relative pb-3 sm:pb-0 font-serif text-lg transition-colors ${
                    isActive ? 'text-united-black font-semibold' : 'text-united-gray-600 hover:text-united-black'
                  }`}
                >
                  {f.label}
                  {isActive && (
                    <span className="absolute left-0 -bottom-px sm:-bottom-2 h-0.5 w-full bg-united-black" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-united-gray-600" />
            <input
              type="text"
              placeholder="Search honours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-united-gray-200 rounded-md text-sm focus:outline-none focus:border-united-red"
            />
          </div>
        </div>

        {/* ---------- Honours board ---------- */}
        {filteredBadges.length === 0 ? (
          <div className="border border-united-gray-200 rounded-2xl p-14 text-center">
            <p className="font-serif text-xl text-united-black mb-1">Nothing here yet.</p>
            <p className="text-united-gray-600">
              {searchTerm ? 'Try adjusting your search term.' : 'Keep logging matches to earn honours.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBadges.map((badge: any) => (
              <BadgePlaque key={badge.id} badge={badge} onClick={() => setSelectedBadge(badge)} />
            ))}
          </div>
        )}
      </div>

      {selectedBadge && (
        <BadgeDetailModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
      )}
    </div>
  )
}

/* ---------- Plaque ---------- */

function BadgePlaque({ badge, onClick }: { badge: any; onClick: () => void }) {
  const isEarned = badge.is_earned
  const progress = badge.progress_percentage || 0

  if (isEarned) {
    return (
      <button
        onClick={onClick}
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-united-charcoal to-united-black p-5 text-center transition-transform hover:-translate-y-0.5"
      >
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-united-foil via-united-gold to-united-foil" />

        <div className="mx-auto h-14 w-14 rounded-full border-2 border-united-foil/60 flex items-center justify-center">
          {badge.icon_url ? (
            <span className="text-2xl">{badge.icon_url}</span>
          ) : (
            <LaurelIcon className="h-6 w-6 text-united-foil" />
          )}
        </div>

        <p className="mt-3 font-serif text-sm text-united-white truncate">{badge.name}</p>
        <p className="text-[10px] text-united-white/40 capitalize mt-0.5 tracking-[0.05em]">{badge.category}</p>

        <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.1em] uppercase text-united-foil">
          <CheckIcon className="h-3 w-3" />
          Earned
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="group relative rounded-2xl border border-dashed border-united-gray-200 bg-united-gray-100 p-5 text-center transition-colors hover:border-united-gray-600"
    >
      <div className="mx-auto h-14 w-14 rounded-full border-2 border-united-gray-200 flex items-center justify-center">
        {progress > 0 ? (
          <LaurelIcon className="h-6 w-6 text-united-gray-600" />
        ) : (
          <LockIcon className="h-5 w-5 text-united-gray-600" />
        )}
      </div>

      <p className="mt-3 font-serif text-sm text-united-gray-600 truncate">{badge.name}</p>
      <p className="text-[10px] text-united-gray-600/70 capitalize mt-0.5 tracking-[0.05em]">{badge.category}</p>

      {progress > 0 ? (
        <div className="mt-2.5">
          <div className="h-1 w-16 mx-auto rounded-full bg-united-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-united-red"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="mt-1 inline-block text-[10px] font-bold tracking-[0.1em] uppercase text-united-gray-600">
            {Math.round(progress)}%
          </span>
        </div>
      ) : (
        <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.1em] uppercase text-united-gray-600">
          <LockIcon className="h-3 w-3" />
          Locked
        </span>
      )}
    </button>
  )
}

/* ---------- Custom icons ---------- */

function LaurelIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 4v16"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M12 6c-2 1-4 .5-5.5-1C6 7.5 7 9.5 9 10c-2 .5-3.5 2-4 4 2-.5 3.8.2 4.7 1.8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6c2 1 4 .5 5.5-1C18 7.5 17 9.5 15 10c2 .5 3.5 2 4 4-2-.5-3.8.2-4.7 1.8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20 20l-4.3-4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}