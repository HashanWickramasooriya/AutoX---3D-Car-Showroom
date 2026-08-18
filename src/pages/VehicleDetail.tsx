import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getVehicleById, vehicles } from '../data/vehicles'
import { vehicleHotspots } from '../data/hotspots'
import { CarViewer } from '../components/3d/CarViewer'
import { formatLKR } from '../utils/format'
import { usePageTitle } from '../hooks/usePageTitle'
import { DemoBadge } from '../components/ui/DemoBadge'
import { Button } from '../components/ui/Button'
import { useCompareList, useFavorites, useRecentlyViewed } from '../hooks/useAppState'
import { useToast } from '../hooks/useToast'
import { CarSilhouette } from '../components/vehicles/CarSilhouette'
import type { WheelStyle } from '../components/3d/Wheel'

export function VehicleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const vehicle = id ? getVehicleById(id) : undefined
  const { addRecent } = useRecentlyViewed()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isComparing, toggleCompare, compareIds } = useCompareList()
  const { showToast } = useToast()

  const [colorId, setColorId] = useState(vehicle?.colors[0].id ?? '')
  const [wheelId, setWheelId] = useState<WheelStyle>((vehicle?.wheels[0].id as WheelStyle) ?? 'sport-19')
  const [interiorId, setInteriorId] = useState(vehicle?.interiors[0].id ?? '')

  usePageTitle(vehicle ? `${vehicle.name} - 3D Vehicle Experience` : 'Vehicle')

  useEffect(() => {
    if (vehicle) addRecent(vehicle.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle?.id])

  const color = useMemo(
    () => vehicle?.colors.find((c) => c.id === colorId) ?? vehicle?.colors[0],
    [vehicle, colorId],
  )
  const interior = useMemo(
    () => vehicle?.interiors.find((i) => i.id === interiorId) ?? vehicle?.interiors[0],
    [vehicle, interiorId],
  )

  if (!vehicle || !color || !interior) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="font-display text-2xl text-warm">Vehicle not found.</p>
        <Button to="/vehicles">Back to Models</Button>
      </div>
    )
  }

  const favorite = isFavorite(vehicle.id)
  const comparing = isComparing(vehicle.id)

  const handleCompare = () => {
    if (!comparing && compareIds.length >= 3) {
      showToast('You can compare up to 3 vehicles at a time.')
      return
    }
    toggleCompare(vehicle.id)
    showToast(comparing ? 'Removed from comparison' : 'Added to comparison')
  }

  const related = vehicles.filter((v) => v.id !== vehicle.id).slice(0, 3)

  return (
    <div className="pt-16 sm:pt-18">
      <section className="relative h-[70svh] min-h-[420px] w-full bg-ink">
        <CarViewer
          vehicleId={vehicle.id}
          type={vehicle.type}
          color={color}
          wheelStyle={wheelId}
          interiorHex={interior.hex}
          hotspots={vehicleHotspots}
          className="h-full w-full"
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-warm-dim">{vehicle.trim}</p>
                <h1 className="mt-1 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-warm">
                  {vehicle.name}
                </h1>
                <p className="mt-2 text-warm-dim">{vehicle.tagline}</p>
              </div>
              <button
                onClick={() => toggleFavorite(vehicle.id)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                  favorite ? 'border-accent text-accent' : 'border-line text-warm-dim hover:text-warm'
                }`}
              >
                {favorite ? 'Saved' : 'Save'}
              </button>
            </div>

            <p className="mt-6 max-w-2xl leading-relaxed text-warm-dim">{vehicle.description}</p>

            {/* Quick preview controls */}
            <div className="mt-10 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-warm-dim">Exterior - {color.name}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {vehicle.colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setColorId(c.id)}
                      aria-label={c.name}
                      className={`h-8 w-8 rounded-full border-2 transition-transform ${
                        c.id === colorId ? 'border-accent scale-110' : 'border-line'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-warm-dim">Wheels</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {vehicle.wheels.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setWheelId(w.id as WheelStyle)}
                      className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                        w.id === wheelId ? 'border-accent text-accent' : 'border-line text-warm-dim hover:text-warm'
                      }`}
                    >
                      {w.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-warm-dim">Interior - {interior.name}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {vehicle.interiors.map((i) => (
                    <button
                      key={i.id}
                      onClick={() => setInteriorId(i.id)}
                      aria-label={i.name}
                      className={`h-8 w-8 rounded-full border-2 transition-transform ${
                        i.id === interiorId ? 'border-accent scale-110' : 'border-line'
                      }`}
                      style={{ backgroundColor: i.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="mt-12">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-warm">Specifications</h2>
                <DemoBadge label="Manufacturer specifications" />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-4 sm:grid-cols-3">
                {[
                  ['Power', vehicle.spec.power],
                  ['Torque', vehicle.spec.torque],
                  ['0-100 km/h', vehicle.spec.zeroToHundred],
                  ['Top Speed', vehicle.spec.topSpeed],
                  ['Drive', vehicle.spec.drive],
                  ['Transmission', vehicle.spec.transmission],
                  ...(vehicle.spec.range ? [['Range', vehicle.spec.range]] : []),
                  ...(vehicle.spec.fastCharge ? [['Fast Charging', vehicle.spec.fastCharge]] : []),
                  ['Seats', String(vehicle.spec.seats)],
                  ['Boot Capacity', vehicle.spec.boot],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[11px] uppercase tracking-wider text-warm-dim">{label}</dt>
                    <dd className="mt-1 text-sm text-warm">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Features */}
            <div className="mt-12">
              <h2 className="font-display text-xl text-warm">Features</h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 border-t border-line pt-4 sm:grid-cols-2">
                {vehicle.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-warm-dim">
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gallery */}
            <div className="mt-12">
              <h2 className="font-display text-xl text-warm">Gallery</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {vehicle.gallery.map((g) => (
                  <div key={g} className="aspect-square overflow-hidden rounded-xl border border-line bg-surface-2">
                    <CarSilhouette type={vehicle.type} accent={vehicle.heroAccent} className="h-full w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-line bg-surface p-6">
              <p className="text-xs uppercase tracking-widest text-warm-dim">Starting from</p>
              <p className="mt-1 font-display text-3xl text-warm">{formatLKR(vehicle.basePrice)}</p>
              <DemoBadge label="Demo pricing" className="mt-2" />

              <div className="mt-6 flex flex-col gap-3">
                <Button to={`/configurator/${vehicle.id}`} className="w-full">
                  Configure This {vehicle.model}
                </Button>
                <Button to="/test-drive" variant="secondary" className="w-full">
                  Book a Test Drive
                </Button>
                <button
                  onClick={handleCompare}
                  className={`w-full rounded-full border px-5 py-3 text-sm font-medium transition-colors ${
                    comparing ? 'border-accent text-accent' : 'border-line text-warm-dim hover:text-warm'
                  }`}
                >
                  {comparing ? 'Added to Compare' : 'Add to Compare'}
                </button>
              </div>

              <div className="mt-6 border-t border-line pt-5 text-xs text-warm-dim">
                <p>Available in Colombo, Kandy and Galle showrooms.</p>
                <Link to="/showrooms" className="mt-2 inline-block text-warm hover:text-accent">
                  View showroom locations →
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related vehicles */}
        <div className="mt-20">
          <h2 className="font-display text-xl text-warm">You may also like</h2>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
            {related.map((v) => (
              <button
                key={v.id}
                onClick={() => navigate(`/vehicles/${v.id}`)}
                className="flex w-56 shrink-0 flex-col rounded-xl border border-line bg-surface p-4 text-left transition-colors hover:border-metal-dim"
              >
                <CarSilhouette type={v.type} accent={v.heroAccent} className="h-24 w-full" />
                <p className="mt-3 font-display text-warm">{v.name}</p>
                <p className="text-xs text-warm-dim">{formatLKR(v.basePrice)}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
