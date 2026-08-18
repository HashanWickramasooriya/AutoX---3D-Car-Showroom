import { useMemo, useState } from 'react'
import { vehicles } from '../data/vehicles'
import type { BodyType, FuelType } from '../data/types'
import { VehicleCard } from '../components/vehicles/VehicleCard'
import { SectionHeading } from '../components/ui/SectionHeading'
import { usePageTitle } from '../hooks/usePageTitle'

type SortKey = 'price-asc' | 'price-desc' | 'power' | 'newest'

const bodyTypes: { id: BodyType | 'all'; label: string }[] = [
  { id: 'all', label: 'All Types' },
  { id: 'coupe', label: 'Coupe' },
  { id: 'sedan', label: 'Sedan' },
  { id: 'suv', label: 'SUV' },
]

const fuelTypes: { id: FuelType | 'all'; label: string }[] = [
  { id: 'all', label: 'All Fuel Types' },
  { id: 'petrol', label: 'Petrol' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'electric', label: 'Electric' },
]

export function Vehicles() {
  usePageTitle('Models')
  const priceCeiling = useMemo(() => Math.max(...vehicles.map((v) => v.basePrice)), [])

  const [search, setSearch] = useState('')
  const [bodyType, setBodyType] = useState<BodyType | 'all'>('all')
  const [fuel, setFuel] = useState<FuelType | 'all'>('all')
  const [maxPrice, setMaxPrice] = useState(priceCeiling)
  const [sort, setSort] = useState<SortKey>('newest')

  const filtered = useMemo(() => {
    let list = vehicles.filter((v) => {
      const matchesSearch = search
        ? [v.name, v.model, v.tagline, v.type].join(' ').toLowerCase().includes(search.toLowerCase())
        : true
      const matchesType = bodyType === 'all' || v.type === bodyType
      const matchesFuel = fuel === 'all' || v.spec.fuel === fuel
      const matchesPrice = v.basePrice <= maxPrice
      return matchesSearch && matchesType && matchesFuel && matchesPrice
    })

    list = [...list].sort((a, b) => {
      if (sort === 'price-asc') return a.basePrice - b.basePrice
      if (sort === 'price-desc') return b.basePrice - a.basePrice
      if (sort === 'power') return parseInt(b.spec.power) - parseInt(a.spec.power)
      return 0
    })

    return list
  }, [search, bodyType, fuel, maxPrice, sort])

  return (
    <div className="pt-24 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="The Range" title="Every AUTOX model." description="Seven vehicles. One standard of presentation." />

        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, type…"
            className="w-full rounded-lg border border-line bg-surface-2 px-4 py-2.5 text-sm text-warm placeholder:text-warm-dim/60 focus:outline-none"
            aria-label="Search vehicles"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex flex-col gap-1.5 text-xs text-warm-dim">
              Body type
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value as BodyType | 'all')}
                className="rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-warm focus:outline-none"
              >
                {bodyTypes.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-xs text-warm-dim">
              Fuel type
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value as FuelType | 'all')}
                className="rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-warm focus:outline-none"
              >
                {fuelTypes.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-xs text-warm-dim">
              Max price: <span className="text-warm">LKR {maxPrice.toLocaleString()}</span>
              <input
                type="range"
                min={10_000_000}
                max={priceCeiling}
                step={500_000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-2 accent-accent"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs text-warm-dim">
              Sort by
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-warm focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="power">Power</option>
              </select>
            </label>
          </div>
        </div>

        <p className="mt-6 text-sm text-warm-dim">
          {filtered.length} {filtered.length === 1 ? 'vehicle' : 'vehicles'} found
        </p>

        <div className="mb-24 mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="mb-24 rounded-2xl border border-line bg-surface p-12 text-center text-warm-dim">
            No vehicles match your filters.
          </div>
        )}
      </div>
    </div>
  )
}
