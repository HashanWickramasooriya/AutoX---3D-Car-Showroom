import { useState } from 'react'
import { getVehicleById } from '../data/vehicles'
import { CarViewer } from '../components/3d/CarViewer'
import { usePageTitle } from '../hooks/usePageTitle'
import { DemoBadge } from '../components/ui/DemoBadge'
import { Button } from '../components/ui/Button'

export function Electric() {
  const nova = getVehicleById('nova')!
  usePageTitle(`${nova.name} - Electric`)
  const [charge, setCharge] = useState(72)

  const maxRangeKm = Number.parseInt(nova.spec.range ?? '0', 10) || 0
  const rangeKm = Math.round((charge / 100) * maxRangeKm)

  return (
    <div className="pt-16 sm:pt-18">
      <section className="relative h-[70svh] min-h-[420px] w-full bg-ink">
        <CarViewer
          vehicleId={nova.id}
          type={nova.type}
          color={nova.colors[4]}
          wheelStyle="carbon-21"
          interiorHex={nova.interiors[0].hex}
          className="h-full w-full"
        />
      </section>

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Electric</p>
            <h1 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] text-warm">{nova.name}</h1>
            <p className="mt-2 text-warm-dim">{nova.tagline}</p>
          </div>
          <DemoBadge label="Manufacturer specifications" />
        </div>

        <p className="mt-6 max-w-2xl leading-relaxed text-warm-dim">{nova.description}</p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-xs uppercase tracking-wider text-warm-dim">Range</p>
            <p className="mt-1 font-display text-3xl text-warm">{nova.spec.range}</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-xs uppercase tracking-wider text-warm-dim">Fast Charging</p>
            <p className="mt-1 font-display text-2xl text-warm">{nova.spec.fastCharge}</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-xs uppercase tracking-wider text-warm-dim">Power</p>
            <p className="mt-1 font-display text-3xl text-warm">{nova.spec.power}</p>
          </div>
        </div>

        {/* Interactive battery / range visual */}
        <div className="mt-10 rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-lg text-warm">Estimated range</h2>
            <p className="font-display text-2xl text-warm">{rangeKm} km</p>
          </div>
          <div className="mt-5 h-4 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-dim to-accent transition-all duration-300"
              style={{ width: `${charge}%` }}
            />
          </div>
          <input
            type="range"
            min={5}
            max={100}
            value={charge}
            onChange={(e) => setCharge(Number(e.target.value))}
            className="mt-4 w-full accent-accent"
            aria-label="Battery charge level"
          />
          <p className="mt-2 text-xs text-warm-dim">Battery charge: {charge}%. Drag to see estimated range change.</p>
          <p className="mt-4 text-[11px] text-warm-dim">
            {maxRangeKm} km is the manufacturer-published range at 100% charge. This slider is an illustrative demo
            interaction, not a live battery reading.
          </p>
        </div>

        <div className="mt-10">
          <Button to={`/configurator/${nova.id}`}>Configure {nova.model}</Button>
        </div>
      </div>
    </div>
  )
}
