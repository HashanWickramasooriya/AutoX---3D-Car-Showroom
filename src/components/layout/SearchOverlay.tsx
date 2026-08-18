import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { vehicles } from '../../data/vehicles'
import { formatLKR } from '../../utils/format'

interface SearchOverlayProps {
  onClose: () => void
}

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return vehicles
    return vehicles.filter((v) => {
      const haystack = [v.name, v.model, v.type, v.tagline, v.spec.fuel, v.spec.power].join(' ').toLowerCase()
      if (q === 'electric' || q === 'ev') return v.spec.fuel === 'electric'
      if (q === 'suv') return v.type === 'suv'
      return haystack.includes(q)
    })
  }, [query])

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-ink/97 backdrop-blur-md" role="dialog" aria-modal="true">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pt-24 sm:pt-32">
        <div className="flex items-center gap-3 border-b border-line pb-4">
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search model, type, or 'electric', 'SUV'..."
            className="w-full bg-transparent font-display text-2xl text-warm placeholder:text-warm-dim/50 focus:outline-none sm:text-3xl"
            aria-label="Search vehicles"
          />
          <button
            onClick={onClose}
            className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs text-warm-dim hover:text-warm"
          >
            Close
          </button>
        </div>

        <div className="mt-6 flex-1 space-y-2 overflow-y-auto pb-10">
          {results.length === 0 && <p className="text-sm text-warm-dim">No vehicles match "{query}".</p>}
          {results.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                navigate(`/vehicles/${v.id}`)
                onClose()
              }}
              className="flex w-full items-center justify-between rounded-lg border border-transparent px-3 py-3 text-left transition-colors hover:border-line hover:bg-surface-2"
            >
              <span>
                <span className="block font-display text-lg text-warm">{v.name}</span>
                <span className="block text-xs text-warm-dim">{v.tagline}</span>
              </span>
              <span className="font-mono text-xs text-metal">{formatLKR(v.basePrice)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
