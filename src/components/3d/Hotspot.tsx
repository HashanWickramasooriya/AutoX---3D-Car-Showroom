import { useState } from 'react'
import { Html } from '@react-three/drei'

export interface HotspotData {
  id: string
  position: [number, number, number]
  title: string
  description: string
}

interface HotspotProps {
  data: HotspotData
  active: boolean
  onToggle: (id: string | null) => void
}

export function Hotspot({ data, active, onToggle }: HotspotProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <Html position={data.position} center distanceFactor={7} zIndexRange={[10, 0]} occlude={false}>
      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggle(active ? null : data.id)
          }}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          aria-label={`${data.title} hotspot`}
          className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-200 ${
            active || hovered
              ? 'scale-110 border-accent bg-accent text-ink'
              : 'border-warm/60 bg-ink/70 text-warm backdrop-blur'
          }`}
        >
          <span className="text-[11px] font-semibold">+</span>
        </button>
        {active && (
          <div className="absolute left-1/2 top-8 w-48 -translate-x-1/2 animate-fade-in rounded-lg border border-line bg-surface-2/95 p-3 text-left shadow-2xl backdrop-blur sm:w-56">
            <p className="font-display text-sm text-warm">{data.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-warm-dim">{data.description}</p>
          </div>
        )}
      </div>
    </Html>
  )
}
