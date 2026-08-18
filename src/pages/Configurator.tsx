import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getVehicleById, vehicles } from '../data/vehicles'
import { CarViewer } from '../components/3d/CarViewer'
import { formatLKR } from '../utils/format'
import { usePageTitle } from '../hooks/usePageTitle'
import { DemoBadge } from '../components/ui/DemoBadge'
import { Button } from '../components/ui/Button'
import { useSavedConfigurations } from '../hooks/useAppState'
import { useToast } from '../hooks/useToast'
import type { WheelStyle } from '../components/3d/Wheel'

export function Configurator() {
  const { id } = useParams()
  const navigate = useNavigate()
  const vehicle = getVehicleById(id ?? 'gr-supra') ?? vehicles[0]
  const { saveConfiguration } = useSavedConfigurations()
  const { showToast } = useToast()

  usePageTitle(`Configure ${vehicle.name}`)

  const [colorId, setColorId] = useState(vehicle.colors[0].id)
  const [wheelId, setWheelId] = useState(vehicle.wheels[0].id)
  const [interiorId, setInteriorId] = useState(vehicle.interiors[0].id)

  const color = vehicle.colors.find((c) => c.id === colorId) ?? vehicle.colors[0]
  const wheel = vehicle.wheels.find((w) => w.id === wheelId) ?? vehicle.wheels[0]
  const interior = vehicle.interiors.find((i) => i.id === interiorId) ?? vehicle.interiors[0]

  const isSpecialColor = color.id !== vehicle.colors[0].id
  const specialColorPrice = isSpecialColor ? 180_000 : 0

  const total = useMemo(
    () => vehicle.basePrice + wheel.price + interior.price + specialColorPrice,
    [vehicle.basePrice, wheel.price, interior.price, specialColorPrice],
  )

  const reset = () => {
    setColorId(vehicle.colors[0].id)
    setWheelId(vehicle.wheels[0].id)
    setInteriorId(vehicle.interiors[0].id)
    showToast('Configuration reset')
  }

  const handleSave = () => {
    saveConfiguration({
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      colorId: color.id,
      wheelId: wheel.id,
      interiorId: interior.id,
      totalPrice: total,
    })
    showToast('Configuration saved')
  }

  const handleTestDrive = () => {
    handleSave()
    navigate('/test-drive', { state: { vehicleId: vehicle.id } })
  }

  return (
    <div className="pt-16 sm:pt-18">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px]">
        <section className="relative h-[52vh] min-h-[380px] w-full bg-ink lg:h-[calc(100svh-4.5rem)] lg:sticky lg:top-18">
          <CarViewer
            vehicleId={vehicle.id}
            type={vehicle.type}
            color={color}
            wheelStyle={wheel.id as WheelStyle}
            interiorHex={interior.hex}
            className="h-full w-full"
          />
        </section>

        <aside className="border-t border-line bg-surface lg:border-l lg:border-t-0">
          <div className="px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-xs uppercase tracking-widest text-warm-dim">{vehicle.trim}</p>
            <h1 className="mt-1 font-display text-2xl text-warm sm:text-3xl">Configure your {vehicle.model}.</h1>

            <div className="mt-4 flex flex-wrap gap-2">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => navigate(`/configurator/${v.id}`)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    v.id === vehicle.id ? 'border-accent text-accent' : 'border-line text-warm-dim hover:text-warm'
                  }`}
                >
                  {v.model}
                </button>
              ))}
            </div>

            {/* Exterior */}
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-warm">Exterior</h2>
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap sm:overflow-visible">
                {vehicle.colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColorId(c.id)}
                    className="flex shrink-0 flex-col items-center gap-1.5"
                  >
                    <span
                      className={`h-10 w-10 rounded-full border-2 transition-transform ${
                        c.id === colorId ? 'border-accent scale-110' : 'border-line'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-[10px] text-warm-dim">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wheels */}
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-warm">Wheels</h2>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap sm:overflow-visible">
                {vehicle.wheels.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setWheelId(w.id)}
                    className={`shrink-0 rounded-xl border px-4 py-3 text-left transition-colors ${
                      w.id === wheelId ? 'border-accent bg-accent/10' : 'border-line hover:border-metal-dim'
                    }`}
                  >
                    <p className="text-xs font-medium text-warm">{w.name}</p>
                    <p className="mt-0.5 text-[11px] text-warm-dim">
                      {w.price > 0 ? `+ ${formatLKR(w.price)}` : 'Included'}
                    </p>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-warm-dim">
                3D preview shows the finish for each option on our demo wheel asset.
              </p>
            </div>

            {/* Interior */}
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-warm">Interior</h2>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap sm:overflow-visible">
                {vehicle.interiors.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => setInteriorId(i.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors ${
                      i.id === interiorId ? 'border-accent bg-accent/10' : 'border-line hover:border-metal-dim'
                    }`}
                  >
                    <span className="h-6 w-6 rounded-full border border-line" style={{ backgroundColor: i.hex }} />
                    <span className="text-left">
                      <span className="block text-xs font-medium text-warm">{i.name}</span>
                      <span className="block text-[11px] text-warm-dim">
                        {i.price > 0 ? `+ ${formatLKR(i.price)}` : 'Included'}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="mt-10 rounded-2xl border border-line bg-surface-2 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-warm">Your configuration</h2>
                <DemoBadge label="Demo pricing" />
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-warm-dim">Base vehicle</dt>
                  <dd className="text-warm">{formatLKR(vehicle.basePrice)}</dd>
                </div>
                {isSpecialColor && (
                  <div className="flex justify-between">
                    <dt className="text-warm-dim">Special paint</dt>
                    <dd className="text-warm">+ {formatLKR(specialColorPrice)}</dd>
                  </div>
                )}
                {wheel.price > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-warm-dim">{wheel.name}</dt>
                    <dd className="text-warm">+ {formatLKR(wheel.price)}</dd>
                  </div>
                )}
                {interior.price > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-warm-dim">{interior.name}</dt>
                    <dd className="text-warm">+ {formatLKR(interior.price)}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <span className="text-sm font-semibold text-warm">Total</span>
                <span className="font-display text-2xl text-warm">{formatLKR(total)}</span>
              </div>

              <div className="mt-5 flex flex-col gap-2.5">
                <Button onClick={handleSave} className="w-full">
                  Save Configuration
                </Button>
                <Button onClick={handleTestDrive} variant="secondary" className="w-full">
                  Request Test Drive
                </Button>
                <button
                  onClick={reset}
                  className="w-full rounded-full py-2.5 text-xs font-medium text-warm-dim hover:text-warm"
                >
                  Reset Configuration
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
