import { Link } from 'react-router-dom'
import { getVehicleById } from '../data/vehicles'
import { useSavedConfigurations } from '../hooks/useAppState'
import { formatLKR } from '../utils/format'
import { usePageTitle } from '../hooks/usePageTitle'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Button } from '../components/ui/Button'
import { useToast } from '../hooks/useToast'

export function Saved() {
  usePageTitle('Saved Configurations')
  const { saved, deleteConfiguration } = useSavedConfigurations()
  const { showToast } = useToast()

  return (
    <div className="pt-24 sm:pt-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Ownership"
          title="Your saved configurations."
          description="Configurations are stored locally in this browser."
        />

        {saved.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-line bg-surface p-10 text-center">
            <p className="text-warm-dim">You haven't saved any configurations yet.</p>
            <Button to="/configurator/gr-supra" className="mt-5">
              Start Configuring
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {saved.map((config) => {
              const vehicle = getVehicleById(config.vehicleId)
              const color = vehicle?.colors.find((c) => c.id === config.colorId)
              const wheel = vehicle?.wheels.find((w) => w.id === config.wheelId)
              const interior = vehicle?.interiors.find((i) => i.id === config.interiorId)

              return (
                <div key={config.id} className="rounded-2xl border border-line bg-surface p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg text-warm">{config.vehicleName}</p>
                      <p className="text-xs text-warm-dim">
                        Saved {new Date(config.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {color && (
                      <span className="h-6 w-6 shrink-0 rounded-full border border-line" style={{ backgroundColor: color.hex }} />
                    )}
                  </div>

                  <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-warm-dim">Exterior</dt>
                      <dd className="text-warm">{color?.name ?? '-'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-warm-dim">Wheels</dt>
                      <dd className="text-warm">{wheel?.name ?? '-'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-warm-dim">Interior</dt>
                      <dd className="text-warm">{interior?.name ?? '-'}</dd>
                    </div>
                    <div className="flex justify-between border-t border-line pt-2">
                      <dt className="font-medium text-warm">Total</dt>
                      <dd className="font-medium text-warm">{formatLKR(config.totalPrice)}</dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex gap-2">
                    <Link
                      to={`/configurator/${config.vehicleId}`}
                      className="flex-1 rounded-full border border-line px-4 py-2.5 text-center text-xs font-medium text-warm-dim transition-colors hover:text-warm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        deleteConfiguration(config.id)
                        showToast('Configuration deleted')
                      }}
                      className="flex-1 rounded-full border border-line px-4 py-2.5 text-xs font-medium text-warm-dim transition-colors hover:border-accent hover:text-accent"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
