import { usePageTitle } from '../hooks/usePageTitle'
import { SectionHeading } from '../components/ui/SectionHeading'
import { DemoBadge } from '../components/ui/DemoBadge'

const safetyFeatures = [
  { title: 'Adaptive Cruise Control', body: 'Maintains a set following distance automatically, adjusting speed to traffic ahead.' },
  { title: 'Lane Assist', body: 'Gently corrects steering if the vehicle drifts out of its lane without signalling.' },
  { title: 'Collision Warning', body: 'Detects slowing traffic and obstacles, alerting the driver before automatic braking engages.' },
  { title: '360° Camera', body: 'A stitched overhead view helps with tight parking and low-speed manoeuvring.' },
  { title: 'Blind Spot Monitoring', body: 'Warns of vehicles in adjacent lanes that aren’t visible in the mirrors.' },
]

export function Safety() {
  usePageTitle('Safety')
  return (
    <div className="pt-24 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Safety" title="Confidence, built in." />
          <DemoBadge label="Demo specifications" />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {safetyFeatures.map((f) => (
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
