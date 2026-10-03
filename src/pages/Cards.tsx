import { useState } from 'react'
import { CardGallery } from '../components/cards/CardGallery'
import { CardGenerator } from '../components/cards/CardGenerator'

type Tab = 'create' | 'gallery'

export const Cards = () => {
  const [tab, setTab] = useState<Tab>('create')
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero */}
      <div className="united-card-glow p-8 bg-gradient-to-br from-united-red to-united-red-dark text-white">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-4xl">🎨</span>
          <div>
            <h1 className="text-3xl font-bold">Story Cards</h1>
            <p className="text-white/80 text-sm mt-1">
              Turn your United moments into shareable artwork
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-united-gray-200">
        <button
          onClick={() => setTab('create')}
          className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
            tab === 'create'
              ? 'border-united-red text-united-red'
              : 'border-transparent text-united-gray-500 hover:text-united-gray-900'
          }`}
        >
          Create
        </button>
        <button
          onClick={() => setTab('gallery')}
          className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
            tab === 'gallery'
              ? 'border-united-red text-united-red'
              : 'border-transparent text-united-gray-500 hover:text-united-gray-900'
          }`}
        >
          My Gallery
        </button>
      </div>

      {/* Content */}
      {tab === 'create' ? (
        <CardGenerator onSaved={() => setRefreshKey((k) => k + 1)} />
      ) : (
        <CardGallery key={refreshKey} />
      )}
    </div>
  )
}
