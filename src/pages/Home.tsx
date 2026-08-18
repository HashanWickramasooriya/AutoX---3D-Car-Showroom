import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { CarViewer, type CameraPreset } from '../components/3d/CarViewer'
import { getVehicleById, vehicles } from '../data/vehicles'
import { vehicleHotspots } from '../data/hotspots'
import { formatLKR } from '../utils/format'
import { usePageTitle } from '../hooks/usePageTitle'
import { useActiveSection } from '../hooks/useActiveSection'
import { useInView } from '../hooks/useInView'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { DemoBadge } from '../components/ui/DemoBadge'
import { SectionHeading } from '../components/ui/SectionHeading'
import { VehicleCard } from '../components/vehicles/VehicleCard'
import { Button } from '../components/ui/Button'

const storyPanels: { eyebrow: string; title: string; body: string; preset: CameraPreset }[] = [
  {
    eyebrow: '01 - Exterior',
    title: 'A shape carved by air.',
    body: 'The double-bubble roofline and ducktail spoiler aren’t styling flourishes. They’re carried over from the GR Supra’s motorsport-bred aerodynamics.',
    preset: 'exterior',
  },
  {
    eyebrow: '02 - Performance',
    title: 'Power that stays composed.',
    body: '382 HP from a turbocharged inline-six, sent through an 8-speed automatic to the rear wheels, tuned for a chassis that talks back.',
    preset: 'side',
  },
  {
    eyebrow: '03 - Engineering',
    title: 'Built on a shared platform.',
    body: 'Developed jointly by Toyota and BMW, the GR Supra pairs a BMW-sourced drivetrain with Toyota’s own chassis tuning and design language.',
    preset: 'rear',
  },
  {
    eyebrow: '04 - Interior',
    title: 'A cockpit built around the driver.',
    body: 'A digital gauge cluster, wide infotainment display and low, wraparound dash keep everything you need within reach.',
    preset: 'interior',
  },
]

const techFeatures = [
  { title: 'Adaptive Variable Suspension', body: 'Damping adjusts in real time to road surface and driving mode.' },
  { title: 'Toyota Safety Sense 2.0', body: 'Collision warning, lane assist and adaptive cruise work together in the background.' },
  { title: 'Digital Gauge Cluster', body: 'A configurable driver display replaces analogue dials with clarity you control.' },
  { title: 'Active Differential', body: 'An electronically controlled limited-slip differential manages power to the rear wheels corner to corner.' },
  { title: 'Wireless CarPlay', body: 'Navigation, media and calls stay connected without reaching for a cable.' },
  { title: 'JBL Premium Audio', body: 'A purpose-tuned speaker system built around the GR Supra’s cabin shape.' },
]

export function Home() {
  usePageTitle('3D Car Showroom & Configurator')
  const supra = getVehicleById('gr-supra')!
  const panelRefs = useRef(storyPanels.map(() => ({ current: null as HTMLDivElement | null })))
  const activeIndex = useActiveSection(panelRefs.current)
  const activePreset = storyPanels[activeIndex]?.preset ?? 'exterior'

  const showroomVehicles = useMemo(() => vehicles, [])
  const hero = useInView<HTMLElement>()
  const isWideViewport = useMediaQuery('(min-width: 640px)')
  const story = useInView<HTMLDivElement>()

  return (
    <div>
      {/* HERO */}
      <section ref={hero.ref} className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink">
        {hero.inView && (
          <CarViewer
            vehicleId={supra.id}
            type={supra.type}
            color={supra.colors[0]}
            wheelStyle="performance-20"
            interiorHex={supra.interiors[0].hex}
            className="h-full w-full"
            underFixedNavbar
            cameraOverride={
              isWideViewport ? { distanceScale: 0.78, cameraHeightBias: -0.18 } : { distanceScale: 1.25, cameraHeightBias: 0.3 }
            }
          />
        )}

        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-4 pb-24 pt-36 sm:px-6 sm:pb-12 sm:pt-32 lg:px-12">
          <div className="pointer-events-auto max-w-xl">
            <DemoBadge label="Real production vehicle" />
            <h1 className="mt-5 text-balance font-display text-[clamp(2.25rem,7vw,4.5rem)] font-medium leading-[1.02] text-warm">
              Meet the Toyota GR Supra.
            </h1>
            <p className="mt-5 max-w-md text-balance text-base leading-relaxed text-warm-dim sm:text-lg">
              Performance, design and technology, configured around you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/vehicles/gr-supra" size="lg">
                Explore GR Supra
              </Button>
              <Button
                to="/configurator/gr-supra"
                size="lg"
                variant="secondary"
                className="bg-ink/80 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none"
              >
                Configure Yours
              </Button>
            </div>
          </div>

          <div className="pointer-events-auto flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-warm-dim">Starting from</p>
              <p className="mt-1 font-display text-2xl text-warm sm:text-3xl">{formatLKR(supra.basePrice)}</p>
              <DemoBadge label="Demo pricing" className="mt-2" />
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-xs uppercase tracking-widest text-warm-dim">Scroll to explore</p>
              <div className="mx-auto mt-2 h-8 w-px animate-pulse bg-metal-dim" />
            </div>
          </div>
        </div>
      </section>

      {/* SCROLL STORYTELLING */}
      <section className="relative bg-ink">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div ref={story.ref} className="lg:sticky lg:top-16 lg:h-[calc(100svh-4rem)]">
            {story.inView && (
              <CarViewer
                vehicleId={supra.id}
                type={supra.type}
                color={supra.colors[2]}
                wheelStyle="carbon-21"
                interiorHex={supra.interiors[0].hex}
                hotspots={vehicleHotspots}
                externalPreset={activePreset}
                showControls={false}
                cameraOverride={{ distanceScale: 0.85 }}
                className="h-[52vh] w-full rounded-2xl border border-line sm:h-[60vh] lg:h-full lg:rounded-none lg:border-0"
              />
            )}
          </div>

          <div className="flex flex-col gap-24 py-16 sm:gap-32 sm:py-24 lg:gap-[40vh] lg:py-[20vh]">
            {storyPanels.map((panel, i) => (
              <div
                key={panel.title}
                ref={(el) => {
                  panelRefs.current[i].current = el
                }}
                className="max-w-md"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{panel.eyebrow}</p>
                <h3 className="mt-4 text-balance font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight text-warm">
                  {panel.title}
                </h3>
                <p className="mt-4 text-balance leading-relaxed text-warm-dim">{panel.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERFORMANCE STATS */}
      <section className="border-t border-line bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Performance" title="Built to move." />
            <DemoBadge label="Manufacturer specifications" />
          </div>
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { label: '0-100 km/h', value: supra.spec.zeroToHundred },
              { label: 'Top Speed', value: supra.spec.topSpeed },
              { label: 'Power', value: supra.spec.power },
              { label: 'Torque', value: supra.spec.torque },
            ].map((stat) => (
              <div key={stat.label} className="border-t border-line pt-4">
                <p className="font-display text-3xl text-warm sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-warm-dim">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section className="border-t border-line bg-ink py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Technology" title="Technology that moves you." align="left" />
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {techFeatures.map((f) => (
              <div key={f.title} className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="font-display text-lg text-warm">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-warm-dim">{f.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Button to="/technology" variant="secondary">
              Explore Technology
            </Button>
          </div>
        </div>
      </section>

      {/* SHOWROOM */}
      <section className="border-t border-line bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="The Range" title="Choose your AUTOX." />
            <Link to="/vehicles" className="text-sm font-medium text-warm-dim hover:text-warm">
              View all models →
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {showroomVehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-ink py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-balance font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight text-warm">
            Choose the details that make it yours.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-warm-dim">
            Build your GR Supra with real-time colour, wheel and interior changes, then book a test drive at a
            showroom near you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/configurator/gr-supra" size="lg">
              Start Configuring
            </Button>
            <Button to="/test-drive" size="lg" variant="secondary">
              Book a Test Drive
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
