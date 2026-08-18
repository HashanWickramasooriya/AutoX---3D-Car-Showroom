import { Link } from 'react-router-dom'
import { showrooms } from '../data/showrooms'
import { getVehicleById } from '../data/vehicles'
import { usePageTitle } from '../hooks/usePageTitle'
import { SectionHeading } from '../components/ui/SectionHeading'
import { DemoBadge } from '../components/ui/DemoBadge'
import { Button } from '../components/ui/Button'

export function Showrooms() {
  usePageTitle('Showrooms')

  return (
    <div className="pt-24 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Ownership" title="Visit an AUTOX showroom." />
          <DemoBadge label="Demo locations" />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showrooms.map((s) => (
            <div key={s.id} className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="font-display text-xl text-warm">{s.name}</h2>
              <p className="mt-1 text-sm text-warm-dim">{s.address}</p>

              <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-warm-dim">Hours</dt>
                  <dd className="text-right text-warm">{s.hours}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-warm-dim">Phone</dt>
                  <dd className="text-warm">{s.phone}</dd>
                </div>
              </dl>

              <div className="mt-4">
                <p className="text-xs uppercase tracking-wider text-warm-dim">Available models</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.models.map((id) => {
                    const v = getVehicleById(id)
                    return v ? (
                      <Link
                        key={id}
                        to={`/vehicles/${id}`}
                        className="rounded-full border border-line px-2.5 py-1 text-[11px] text-warm-dim transition-colors hover:border-metal-dim hover:text-warm"
                      >
                        {v.model}
                      </Link>
                    ) : null
                  })}
                </div>
              </div>

              <Button to="/test-drive" size="sm" variant="secondary" className="mt-5 w-full">
                Book Test Drive Here
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
