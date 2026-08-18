import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Vehicle } from '../../data/types'
import { formatLKR } from '../../utils/format'
import { CarSilhouette } from './CarSilhouette'
import { useCompareList, useFavorites } from '../../hooks/useAppState'
import { useToast } from '../../hooks/useToast'

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isComparing, toggleCompare, compareIds } = useCompareList()
  const { showToast } = useToast()
  const [imageFailed, setImageFailed] = useState(false)
  const favorite = isFavorite(vehicle.id)
  const comparing = isComparing(vehicle.id)

  const handleCompare = () => {
    if (!comparing && compareIds.length >= 3) {
      showToast('You can compare up to 3 vehicles at a time.')
      return
    }
    toggleCompare(vehicle.id)
    showToast(comparing ? `${vehicle.name} removed from comparison` : `${vehicle.name} added to comparison`)
  }

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-300 hover:border-metal-dim hover:bg-surface-2/40">
      <Link
        to={`/vehicles/${vehicle.id}`}
        className="relative block aspect-[16/10] overflow-hidden bg-[radial-gradient(ellipse_at_50%_70%,rgba(255,255,255,0.06),transparent_65%)] bg-surface-2"
      >
        {imageFailed ? (
          <CarSilhouette
            type={vehicle.type}
            accent={vehicle.heroAccent}
            className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <img
            src={`/images/vehicles/${vehicle.id}.jpg`}
            alt={vehicle.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      <button
        onClick={() => toggleFavorite(vehicle.id)}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        aria-pressed={favorite}
        className="absolute right-3 top-3 rounded-full border border-line/70 bg-ink/60 p-2 text-warm backdrop-blur-md transition-colors hover:text-accent"
      >
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 15.5s-6.5-3.9-6.5-8.4A3.6 3.6 0 0 1 9 4.9a3.6 3.6 0 0 1 6.5 2.2c0 4.5-6.5 8.4-6.5 8.4Z"
            stroke="currentColor"
            strokeWidth="1.4"
            fill={favorite ? 'currentColor' : 'none'}
          />
        </svg>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl text-warm">{vehicle.name}</h3>
            <p className="text-xs uppercase tracking-wider text-warm-dim">{vehicle.tagline}</p>
          </div>
          <p className="whitespace-nowrap font-mono text-sm text-metal">{formatLKR(vehicle.basePrice)}</p>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-warm-dim">Power</dt>
            <dd className="mt-1 text-sm text-warm">{vehicle.spec.power}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-warm-dim">
              {vehicle.spec.range ? 'Range' : '0-100'}
            </dt>
            <dd className="mt-1 text-sm text-warm">{vehicle.spec.range ?? vehicle.spec.zeroToHundred}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-warm-dim">Drive</dt>
            <dd className="mt-1 text-sm text-warm">{vehicle.spec.drive}</dd>
          </div>
        </dl>

        <div className="mt-5 flex gap-2 pt-1">
          <Link
            to={`/vehicles/${vehicle.id}`}
            className="flex-1 rounded-full bg-accent px-4 py-2.5 text-center text-xs font-medium tracking-wide text-ink transition-colors hover:bg-accent-dim"
          >
            Explore
          </Link>
          <button
            onClick={handleCompare}
            className={`flex-1 rounded-full border px-4 py-2.5 text-xs font-medium tracking-wide transition-colors ${
              comparing ? 'border-accent text-accent' : 'border-line text-warm-dim hover:text-warm'
            }`}
          >
            {comparing ? 'Comparing' : 'Compare'}
          </button>
        </div>
      </div>
    </div>
  )
}
