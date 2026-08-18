import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { vehicles } from '../data/vehicles'
import { useCompareList } from '../hooks/useAppState'
import { formatLKR } from '../utils/format'
import { usePageTitle } from '../hooks/usePageTitle'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Button } from '../components/ui/Button'
import { CarSilhouette } from '../components/vehicles/CarSilhouette'

const rows: { label: string; get: (v: (typeof vehicles)[number]) => string }[] = [
  { label: 'Price', get: (v) => formatLKR(v.basePrice) },
  { label: 'Power', get: (v) => v.spec.power },
  { label: 'Torque', get: (v) => v.spec.torque },
  { label: '0-100 km/h', get: (v) => v.spec.zeroToHundred },
  { label: 'Top Speed', get: (v) => v.spec.topSpeed },
  { label: 'Drive', get: (v) => v.spec.drive },
  { label: 'Transmission', get: (v) => v.spec.transmission },
  { label: 'Fuel Type', get: (v) => v.spec.fuel },
  { label: 'Range', get: (v) => v.spec.range ?? '-' },
  { label: 'Seats', get: (v) => String(v.spec.seats) },
  { label: 'Boot Capacity', get: (v) => v.spec.boot },
]

export function Compare() {
  usePageTitle('Compare Vehicles')
  const { compareIds, toggleCompare, clearCompare } = useCompareList()

  const selected = useMemo(() => vehicles.filter((v) => compareIds.includes(v.id)), [compareIds])
  const available = vehicles.filter((v) => !compareIds.includes(v.id))

  return (
    <div className="pt-24 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Compare"
            title="Compare AUTOX vehicles."
            description="Choose up to 3 vehicles to compare side by side."
          />
          {selected.length > 0 && (
            <button onClick={clearCompare} className="text-sm text-warm-dim hover:text-warm">
              Clear all
            </button>
          )}
        </div>

        {selected.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-line bg-surface p-10 text-center">
            <p className="text-warm-dim">You haven't added any vehicles to compare yet.</p>
            <Button to="/vehicles" className="mt-5">
              Browse Models
            </Button>
          </div>
        ) : (
          <>
            {available.length > 0 && selected.length < 3 && (
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="mr-1 self-center text-xs text-warm-dim">Add:</span>
                {available.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => toggleCompare(v.id)}
                    className="rounded-full border border-line px-3 py-1.5 text-xs text-warm-dim transition-colors hover:border-metal-dim hover:text-warm"
                  >
                    + {v.model}
                  </button>
                ))}
              </div>
            )}

            {/* Desktop table */}
            <div className="mt-8 hidden overflow-x-auto rounded-2xl border border-line md:block">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="bg-surface">
                    <th className="w-40 border-b border-line p-4 text-left text-xs uppercase tracking-wider text-warm-dim">
                      Spec
                    </th>
                    {selected.map((v) => (
                      <th key={v.id} className="border-b border-line p-4 text-left">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="font-display text-lg text-warm">{v.name}</p>
                            <p className="text-xs text-warm-dim">{v.tagline}</p>
                          </div>
                          <button
                            onClick={() => toggleCompare(v.id)}
                            aria-label={`Remove ${v.name}`}
                            className="text-warm-dim hover:text-accent"
                          >
                            ✕
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={row.label} className={idx % 2 === 0 ? 'bg-ink' : 'bg-surface'}>
                      <td className="border-b border-line p-4 text-xs uppercase tracking-wider text-warm-dim">
                        {row.label}
                      </td>
                      {selected.map((v) => (
                        <td key={v.id} className="border-b border-line p-4 text-warm">
                          {row.get(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-4" />
                    {selected.map((v) => (
                      <td key={v.id} className="p-4">
                        <Link to={`/vehicles/${v.id}`} className="text-sm text-accent hover:underline">
                          View {v.model} →
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile stacked cards */}
            <div className="mt-8 flex flex-col gap-6 md:hidden">
              {selected.map((v) => (
                <div key={v.id} className="rounded-2xl border border-line bg-surface p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CarSilhouette type={v.type} accent={v.heroAccent} className="h-12 w-20" />
                      <div>
                        <p className="font-display text-lg text-warm">{v.name}</p>
                        <p className="text-xs text-warm-dim">{v.tagline}</p>
                      </div>
                    </div>
                    <button onClick={() => toggleCompare(v.id)} aria-label={`Remove ${v.name}`} className="text-warm-dim">
                      ✕
                    </button>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4">
                    {rows.map((row) => (
                      <div key={row.label}>
                        <dt className="text-[10px] uppercase tracking-wider text-warm-dim">{row.label}</dt>
                        <dd className="mt-0.5 text-sm text-warm">{row.get(v)}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link to={`/vehicles/${v.id}`} className="mt-4 inline-block text-sm text-accent hover:underline">
                    View {v.model} →
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
