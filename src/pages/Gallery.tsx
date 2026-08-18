import { useState } from 'react'
import { vehicles } from '../data/vehicles'
import { CarSilhouette } from '../components/vehicles/CarSilhouette'
import { usePageTitle } from '../hooks/usePageTitle'
import { SectionHeading } from '../components/ui/SectionHeading'
import type { Vehicle } from '../data/types'

const captions = ['Exterior', 'Interior', 'Wheels', 'Detail']

function GalleryTile({ vehicle, index }: { vehicle: Vehicle; index: number }) {
  const [imageFailed, setImageFailed] = useState(false)
  const useRealImage = index === 0 && !imageFailed

  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-surface-2">
      <div className="aspect-[4/3]">
        {useRealImage ? (
          <img
            src={`/images/vehicles/${vehicle.id}.jpg`}
            alt={`${vehicle.name} exterior`}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <CarSilhouette type={vehicle.type} accent={vehicle.heroAccent} className="h-full w-full" />
        )}
      </div>
      <figcaption className="border-t border-line px-3 py-2 text-[11px] uppercase tracking-wider text-warm-dim">
        {captions[index] ?? 'Detail'}
      </figcaption>
    </figure>
  )
}

export function Gallery() {
  usePageTitle('Gallery')
  return (
    <div className="pt-24 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Gallery" title="The AUTOX range, in detail." />
        <div className="mt-12 space-y-14">
          {vehicles.map((v) => (
            <div key={v.id}>
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-xl text-warm">{v.name}</h2>
                <p className="text-xs uppercase tracking-wider text-warm-dim">{v.tagline}</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {v.gallery.map((g, i) => (
                  <GalleryTile key={g} vehicle={v} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
