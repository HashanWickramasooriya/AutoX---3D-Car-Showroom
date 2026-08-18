import { usePageTitle } from '../hooks/usePageTitle'
import { SectionHeading } from '../components/ui/SectionHeading'
import { DemoBadge } from '../components/ui/DemoBadge'

const features = [
  {
    title: 'Adaptive Drive',
    body: 'Suspension stiffness, throttle mapping and steering weight adjust automatically to road surface and driving mode.',
  },
  {
    title: 'Advanced Safety',
    body: 'Collision warning, lane keep assist and blind spot monitoring run continuously in the background.',
  },
  {
    title: 'Digital Cockpit',
    body: 'A 12.3" configurable display puts navigation, performance data and media exactly where you want them.',
  },
  {
    title: 'Performance AWD',
    body: 'Torque is distributed corner to corner hundreds of times per second for consistent grip.',
  },
  {
    title: 'Smart Connectivity',
    body: 'Over-the-air updates keep navigation, infotainment and vehicle software current without a workshop visit.',
  },
  {
    title: 'Premium Audio',
    body: 'A 14-speaker system is tuned specifically for the acoustic shape of each AUTOX cabin.',
  },
]

export function Technology() {
  usePageTitle('Technology')
  return (
    <div className="pt-24 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Technology" title="Technology that moves you." />
          <DemoBadge label="Demo specifications" />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="font-display text-lg text-warm">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-warm-dim">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
