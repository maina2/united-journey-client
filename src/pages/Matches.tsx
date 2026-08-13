import { useState, useEffect, useMemo } from 'react'
import { format } from 'date-fns'
import { useMatches, useMatchStats, useDeleteMatch } from '../hooks/useMatches'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { MatchDetailModal } from '../components/matches/MatchDetailModal'
import { EditMatchModal } from '../components/matches/EditMatchModal'
import { DeleteConfirmationModal } from '../components/matches/DeleteConfirmationModal'
import { MatchForm } from '../components/matches/MatchForm'
import { BulkImport } from '../components/matches/BulkImport'
import type { Match } from '../types'

export const Matches = () => {
  const [showForm, setShowForm] = useState(false)
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [matchToDelete, setMatchToDelete] = useState<Match | null>(null)
  const [activeFilters, setActiveFilters] = useState({
    competition: '',
    attendance_type: '',
    result: '',
    season: '',
    page: 1,
  })
  const [limit] = useState(10)

  const deleteMatch = useDeleteMatch()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const queryFilters = useMemo(() => {
    const filters: any = {}
    if (debouncedSearch) filters.opponent = debouncedSearch
    if (activeFilters.competition) filters.competition = activeFilters.competition
    if (activeFilters.attendance_type) filters.attendance_type = activeFilters.attendance_type
    if (activeFilters.result) filters.result = activeFilters.result
    if (activeFilters.season) filters.season = activeFilters.season
    filters.page = activeFilters.page
    filters.limit = limit
    return filters
  }, [debouncedSearch, activeFilters, limit])

  const { data: matches, isLoading, refetch } = useMatches(queryFilters)
  const { data: stats } = useMatchStats()

  const handleFilterChange = (key: string, value: string | number) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const clearFilters = () => {
    setSearchTerm('')
    setDebouncedSearch('')
    setActiveFilters({
      competition: '',
      attendance_type: '',
      result: '',
      season: '',
      page: 1,
    })
  }

  const handleMatchClick = (match: Match) => {
    setSelectedMatch(match)
    setShowDetail(true)
  }

  const handleEditClick = () => {
    setShowDetail(false)
    setShowEdit(true)
  }

  const handleDeleteClick = (match: Match) => {
    setShowDetail(false)
    setMatchToDelete(match)
    setShowDelete(true)
  }

  const handleDeleteConfirm = async () => {
    if (matchToDelete) {
      await deleteMatch.mutateAsync(matchToDelete.id)
      setShowDelete(false)
      setMatchToDelete(null)
      refetch()
    }
  }

  const handleSuccess = () => {
    setShowEdit(false)
    setShowForm(false)
    setShowBulkImport(false)
    refetch()
  }

  const hasActiveFilters = Object.values(activeFilters).some((v) => v) || searchTerm

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
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

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-xs font-bold tracking-[0.25em] text-united-red uppercase">
                My United &middot; Full Record
              </span>
              <h1 className="mt-2 font-serif text-4xl md:text-5xl text-united-white leading-tight">
                Match History
              </h1>
              <p className="mt-2 text-united-white/50">Every match, logged and kept.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkImport(true)}
                className="inline-flex items-center gap-2 rounded-md bg-united-white/10 px-5 py-2.5 font-semibold text-united-white border border-united-white/20 hover:bg-united-white/20 transition-colors"
              >
                <FileSpreadsheetIcon className="h-4 w-4" />
                Bulk Import
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 rounded-md bg-united-red px-5 py-2.5 font-semibold text-united-white transition-colors hover:bg-united-red-dark"
              >
                <PlusIcon className="h-4 w-4" />
                Log Match
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        {/* ---------- Stats strip ---------- */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-united-gray-200 border border-united-gray-200 rounded-2xl overflow-hidden mb-10">
            <RecordCell label="Total" value={stats.total_matches} valueClass="text-united-black" />
            <RecordCell label="Wins" value={stats.wins} valueClass="text-united-pitch" />
            <RecordCell label="Draws" value={stats.draws} valueClass="text-united-foil" />
            <RecordCell label="Losses" value={stats.losses} valueClass="text-united-red" />
            <RecordCell label="Win Rate" value={`${stats.win_percentage}%`} valueClass="text-united-black" />
          </div>
        )}

        {/* ---------- Filter panel ---------- */}
        <div className="bg-united-parchment rounded-2xl p-5 mb-8">
          <p className="text-xs font-bold tracking-[0.15em] text-united-black/60 uppercase mb-3">
            Filter Your Record
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-united-black/40 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by opponent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-united-white border border-united-black/10 rounded-md text-sm focus:outline-none focus:border-united-red"
              />
            </div>
            <select
              className="px-3 py-2.5 bg-united-white border border-united-black/10 rounded-md text-sm focus:outline-none focus:border-united-red"
              value={activeFilters.competition}
              onChange={(e) => handleFilterChange('competition', e.target.value)}
            >
              <option value="">All Competitions</option>
              <option value="Premier League">Premier League</option>
              <option value="FA Cup">FA Cup</option>
              <option value="Carabao Cup">Carabao Cup</option>
              <option value="UEFA Champions League">UEFA Champions League</option>
            </select>
            <select
              className="px-3 py-2.5 bg-united-white border border-united-black/10 rounded-md text-sm focus:outline-none focus:border-united-red"
              value={activeFilters.attendance_type}
              onChange={(e) => handleFilterChange('attendance_type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="in_person">In the Ground</option>
              <option value="watched">Watched</option>
            </select>
            <select
              className="px-3 py-2.5 bg-united-white border border-united-black/10 rounded-md text-sm focus:outline-none focus:border-united-red"
              value={activeFilters.result}
              onChange={(e) => handleFilterChange('result', e.target.value)}
            >
              <option value="">All Results</option>
              <option value="W">Win</option>
              <option value="D">Draw</option>
              <option value="L">Loss</option>
            </select>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2.5 text-sm font-medium text-united-red hover:text-united-red-dark transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ---------- Ledger ---------- */}
        {matches?.items?.length === 0 ? (
          <div className="border border-united-gray-200 rounded-2xl p-14 text-center">
            <p className="font-serif text-xl text-united-black mb-1">The record book is empty.</p>
            <p className="text-united-gray-600 mb-6">
              {searchTerm || hasActiveFilters
                ? 'Try adjusting your filters.'
                : 'Log your first match to open your season.'}
            </p>
            <button
              onClick={() => (searchTerm || hasActiveFilters ? clearFilters() : setShowForm(true))}
              className="inline-flex items-center gap-2 rounded-md bg-united-red px-5 py-2.5 font-semibold text-united-white transition-colors hover:bg-united-red-dark"
            >
              {!(searchTerm || hasActiveFilters) && <PlusIcon className="h-4 w-4" />}
              {searchTerm || hasActiveFilters ? 'Clear Filters' : 'Log Your First Match'}
            </button>
          </div>
        ) : (
          <div className="border border-united-gray-200 rounded-2xl overflow-hidden divide-y divide-united-gray-200">
            {matches?.items?.map((match: Match) => (
              <MatchRow key={match.id} match={match} onClick={() => handleMatchClick(match)} />
            ))}
          </div>
        )}

        {/* ---------- Pagination ---------- */}
        {matches && matches.total_pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handleFilterChange('page', Math.max(1, activeFilters.page - 1))}
              disabled={activeFilters.page === 1}
              className="text-xs font-bold tracking-[0.1em] uppercase px-3 py-2 text-united-black disabled:text-united-gray-200 hover:text-united-red transition-colors disabled:hover:text-united-gray-200"
            >
              Prev
            </button>
            {Array.from({ length: Math.min(matches.total_pages, 5) }, (_, i) => {
              const page = i + 1
              const isActive = page === activeFilters.page
              return (
                <button
                  key={page}
                  onClick={() => handleFilterChange('page', page)}
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
            {matches.total_pages > 5 && <span className="px-2 text-united-gray-600">&hellip;</span>}
            <button
              onClick={() =>
                handleFilterChange('page', Math.min(matches.total_pages, activeFilters.page + 1))
              }
              disabled={activeFilters.page === matches.total_pages}
              className="text-xs font-bold tracking-[0.1em] uppercase px-3 py-2 text-united-black disabled:text-united-gray-200 hover:text-united-red transition-colors disabled:hover:text-united-gray-200"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ---------- Modals ---------- */}
      {showDetail && selectedMatch && (
        <MatchDetailModal
          match={selectedMatch}
          onClose={() => setShowDetail(false)}
          onEdit={handleEditClick}
          onDelete={() => handleDeleteClick(selectedMatch)}
        />
      )}

      {showEdit && selectedMatch && (
        <EditMatchModal
          match={selectedMatch}
          onClose={() => setShowEdit(false)}
          onSuccess={handleSuccess}
        />
      )}

      {showDelete && matchToDelete && (
        <DeleteConfirmationModal
          matchOpponent={matchToDelete.opponent}
          matchDate={format(new Date(matchToDelete.match_date), 'dd MMM yyyy')}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDelete(false)}
          isDeleting={deleteMatch.isPending}
        />
      )}

      {showForm && (
        <div className="fixed inset-0 bg-united-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-united-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative bg-united-charcoal px-6 py-5 rounded-t-2xl">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-united-foil via-united-gold to-united-foil rounded-t-2xl" />
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl text-united-white">Log a Match</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 hover:bg-united-white/10 rounded-md transition-colors"
                >
                  <XIcon className="h-4 w-4 text-united-white/70" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <MatchForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      )}

      {showBulkImport && (
        <div className="fixed inset-0 bg-united-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-united-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative bg-united-charcoal px-6 py-5 rounded-t-2xl">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-united-foil via-united-gold to-united-foil rounded-t-2xl" />
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl text-united-white">Bulk Import</h2>
                <button
                  onClick={() => setShowBulkImport(false)}
                  className="p-1.5 hover:bg-united-white/10 rounded-md transition-colors"
                >
                  <XIcon className="h-4 w-4 text-united-white/70" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <BulkImport
                onSuccess={handleSuccess}
                onCancel={() => setShowBulkImport(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- Ledger row ---------- */

const resultStyles: Record<'W' | 'D' | 'L', string> = {
  W: 'bg-united-pitch text-united-white',
  D: 'bg-united-foil text-united-black',
  L: 'bg-united-red-dark text-united-white',
}

const resultLabels: Record<'W' | 'D' | 'L', string> = {
  W: 'Win',
  D: 'Draw',
  L: 'Loss',
}

const MatchRow = ({ match, onClick }: { match: Match; onClick: () => void }) => {
  const result = match.result as 'W' | 'D' | 'L' | undefined

  return (
    <div
      className="flex items-center gap-4 px-5 py-4 hover:bg-united-gray-100 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`shrink-0 h-9 w-9 rounded-md flex items-center justify-center font-mono font-bold text-sm ${
          result ? resultStyles[result] : 'bg-united-gray-100 text-united-gray-600'
        }`}
        title={result ? resultLabels[result] : 'Unknown'}
      >
        {result || '–'}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-serif text-lg text-united-black truncate">{match.opponent}</p>
        <p className="text-sm text-united-gray-600 truncate">
          {match.competition} <span className="mx-1.5 text-united-gray-200">&middot;</span> {match.venue}
        </p>
      </div>

      <div className="text-right shrink-0">
        {match.score_home !== null ? (
          <p className="font-mono tabular-nums text-xl font-bold text-united-black">
            {match.is_home ? match.score_home : match.score_away}
            <span className="text-united-gray-200 mx-0.5">&ndash;</span>
            {match.is_home ? match.score_away : match.score_home}
          </p>
        ) : (
          <p className="text-sm text-united-gray-600">No score</p>
        )}
        <p className="text-xs text-united-gray-600 font-mono">
          {format(new Date(match.match_date), 'dd MMM yyyy')}
        </p>
        <p className="text-[11px] font-bold tracking-[0.08em] uppercase text-united-gray-600 mt-0.5">
          {match.attendance_type === 'in_person' ? 'In the Ground' : 'Watched'}
        </p>
      </div>
    </div>
  )
}

function RecordCell({
  label,
  value,
  valueClass,
}: {
  label: string
  value: string | number
  valueClass: string
}) {
  return (
    <div className="px-4 py-5 text-center">
      <p className="text-[11px] font-bold tracking-[0.15em] text-united-gray-600 uppercase mb-2">{label}</p>
      <span className={`font-mono tabular-nums text-2xl font-bold ${valueClass}`}>{value}</span>
    </div>
  )
}

/* ---------- Minimal functional icons ---------- */

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

function FileSpreadsheetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 2v6h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
