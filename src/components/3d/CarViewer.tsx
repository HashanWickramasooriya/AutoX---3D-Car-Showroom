import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Loader } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { BodyType, ExteriorColor } from '../../data/types'
import { CarModel, type CarCapabilities } from './CarModel'
import { getVehicle3DConfig } from '../../data/vehicle3d'
import { CameraRig } from './CameraRig'
import { Studio } from './Studio'
import { Hotspot, type HotspotData } from './Hotspot'
import { CanvasErrorBoundary } from './CanvasErrorBoundary'
import { useDeviceCapability } from '../../hooks/useDeviceCapability'
import type { WheelStyle } from './Wheel'

export type CameraPreset = 'exterior' | 'front' | 'side' | 'rear' | 'interior'

const PRESETS: Record<CameraPreset, { position: [number, number, number]; target: [number, number, number] }> = {
  // Car length runs along X (front = +X), width along Z. Presets below are
  // positioned relative to those axes so "front"/"rear" frame the nose/tail
  // and "side" frames the full-length flank (needs more distance than width alone).
  // Distances are generous enough to fit the tallest vehicle in the fleet
  // (the Land Cruiser SUV) without cropping, since all vehicles share these
  // presets after being length-normalized to the same target size.
  exterior: { position: [7.2, 2.0, 8.6], target: [-0.5, 0.7, 0] },
  front: { position: [7.2, 1.7, 0.2], target: [0, 0.75, 0] },
  side: { position: [0.1, 1.6, 9.8], target: [0, 0.75, 0] },
  rear: { position: [-7.2, 1.7, 0.2], target: [0, 0.75, 0] },
  interior: { position: [-0.75, 1.05, 0.35], target: [0.55, 0.8, 0.1] },
}

/**
 * Applies a vehicle's cameraProfile (see data/vehicle3d.ts) to a shared
 * preset: distanceScale zooms in/out around the look-at target, and
 * cameraHeightBias shifts the eye line up or down without moving the
 * target, so different body styles get a distinct default vantage instead
 * of one generic framing. Left untouched for the interior preset, which is
 * hand-tuned to sit inside the cabin.
 */
function applyCameraProfile(
  preset: { position: [number, number, number]; target: [number, number, number] },
  profile: { distanceScale?: number; cameraHeightBias?: number } | undefined,
): { position: [number, number, number]; target: [number, number, number] } {
  if (!profile) return preset
  const { distanceScale = 1, cameraHeightBias = 0 } = profile
  const [px, py, pz] = preset.position
  const [tx, ty, tz] = preset.target
  return {
    position: [tx + (px - tx) * distanceScale, ty + (py - ty) * distanceScale + cameraHeightBias, tz + (pz - tz) * distanceScale],
    target: preset.target,
  }
}

/** Combines a vehicle's own cameraProfile with an optional per-usage override - used to frame the same vehicle tighter in a hero than on its detail page, without touching the shared per-vehicle defaults. */
function composeCameraProfiles(
  base: { distanceScale?: number; cameraHeightBias?: number } | undefined,
  override: { distanceScale?: number; cameraHeightBias?: number } | undefined,
): { distanceScale?: number; cameraHeightBias?: number } | undefined {
  if (!base && !override) return undefined
  return {
    distanceScale: (base?.distanceScale ?? 1) * (override?.distanceScale ?? 1),
    cameraHeightBias: (base?.cameraHeightBias ?? 0) + (override?.cameraHeightBias ?? 0),
  }
}

interface CarViewerProps {
  vehicleId: string
  type: BodyType
  color: ExteriorColor
  wheelStyle: WheelStyle
  interiorHex: string
  hotspots?: HotspotData[]
  className?: string
  showControls?: boolean
  externalPreset?: CameraPreset
  autoRotateDefault?: boolean
  /** Push the preset pill down to clear a fixed navbar when the viewer bleeds under it (e.g. full-height hero). */
  underFixedNavbar?: boolean
  /** Per-usage adjustment layered on top of the vehicle's own cameraProfile - e.g. a tighter, closer frame for a hero placement than the vehicle's detail-page default. */
  cameraOverride?: { distanceScale?: number; cameraHeightBias?: number }
}

function Fallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-surface p-6 text-center text-warm-dim">
      <p className="font-display text-lg text-warm">3D model unavailable</p>
      <p className="max-w-xs text-sm">
        Your browser or device couldn't render the interactive viewer. The rest of the site still works.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className="rounded-full border border-line px-4 py-2 text-xs font-medium text-warm transition-colors hover:border-metal-dim"
        >
          Try again
        </button>
        <Link
          to="/gallery"
          className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-ink transition-opacity hover:opacity-90"
        >
          View vehicle gallery
        </Link>
      </div>
    </div>
  )
}

export function CarViewer({
  vehicleId,
  type,
  color,
  wheelStyle,
  interiorHex,
  hotspots = [],
  className = '',
  showControls = true,
  externalPreset,
  autoRotateDefault = true,
  underFixedNavbar = false,
  cameraOverride,
}: CarViewerProps) {
  const { lowPower } = useDeviceCapability()
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const [preset, setPreset] = useState<CameraPreset>(externalPreset ?? 'exterior')
  const [autoRotate, setAutoRotate] = useState(autoRotateDefault)
  const [headlightsOn, setHeadlightsOn] = useState(false)
  const [hoodOpen, setHoodOpen] = useState(false)
  const [doorsOpen, setDoorsOpen] = useState(false)
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  // Starts with nothing shown - CarModel reports what the loaded asset
  // actually supports once it's parsed, so a control never appears and then
  // turns out to do nothing.
  const [capabilities, setCapabilities] = useState<CarCapabilities>({ hood: false, doors: false, headlights: false })

  useEffect(() => {
    if (externalPreset) {
      setPreset(externalPreset)
      setAutoRotate(false)
    }
  }, [externalPreset])

  // Switching vehicles (e.g. the Configurator's model tabs) reuses this same
  // CarViewer instance - clear any state that only makes sense for the
  // previous car's asset (hood/doors open, reported capabilities).
  useEffect(() => {
    setHoodOpen(false)
    setDoorsOpen(false)
    setHeadlightsOn(false)
    setCapabilities({ hood: false, doors: false, headlights: false })
  }, [vehicleId])

  const material = useMemo(
    () => ({ color: color.hex, metalness: color.metalness, roughness: color.roughness }),
    [color],
  )

  const cameraProfile = useMemo(
    () => composeCameraProfiles(getVehicle3DConfig(vehicleId).cameraProfile, cameraOverride),
    [vehicleId, cameraOverride],
  )
  const effectivePresets = useMemo(
    () => ({
      exterior: applyCameraProfile(PRESETS.exterior, cameraProfile),
      front: applyCameraProfile(PRESETS.front, cameraProfile),
      side: applyCameraProfile(PRESETS.side, cameraProfile),
      rear: applyCameraProfile(PRESETS.rear, cameraProfile),
      interior: PRESETS.interior,
    }),
    [cameraProfile],
  )
  const currentPreset = effectivePresets[preset]

  const handlePreset = (p: CameraPreset) => {
    setPreset(p)
    setAutoRotate(false)
    setActiveHotspot(null)
  }

  const resetView = () => {
    setPreset('exterior')
    setAutoRotate(true)
    setActiveHotspot(null)
    setHoodOpen(false)
    setDoorsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <CanvasErrorBoundary fallback={<Fallback />}>
        <Canvas
          shadows={!lowPower}
          dpr={lowPower ? [1, 1.25] : [1, 2]}
          camera={{ position: PRESETS.exterior.position, fov: 38 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#0a0a0b']} />
          <fog attach="fog" args={['#0a0a0b', 10, 22]} />
          <Suspense fallback={null}>
            <Studio lowPower={lowPower} />
            <CarModel
              vehicleId={vehicleId}
              type={type}
              material={material}
              wheelStyle={wheelStyle}
              headlightsOn={headlightsOn}
              hoodOpen={hoodOpen}
              doorsOpen={doorsOpen}
              interiorHex={interiorHex}
              onCapabilities={setCapabilities}
            />
            {preset !== 'interior' &&
              hotspots.map((h) => (
                <Hotspot key={h.id} data={h} active={activeHotspot === h.id} onToggle={setActiveHotspot} />
              ))}
          </Suspense>
          <OrbitControls
            ref={controlsRef}
            makeDefault
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={0.8}
            minDistance={preset === 'interior' ? 0.4 : 3.2}
            maxDistance={preset === 'interior' ? 1.4 : 15}
            minPolarAngle={0.35}
            maxPolarAngle={Math.PI / 2.05}
            onStart={() => setAutoRotate(false)}
          />
          <CameraRig
            position={currentPreset.position}
            target={currentPreset.target}
            controlsRef={controlsRef}
            active
          />
        </Canvas>
      </CanvasErrorBoundary>

      {showControls && (
        <>
          <div
            className={`pointer-events-none absolute inset-x-0 flex justify-center gap-1.5 px-3 ${
              underFixedNavbar ? 'top-20 sm:top-24' : 'top-3 sm:top-4'
            }`}
          >
            <div className="pointer-events-auto flex flex-wrap justify-center gap-1.5 rounded-full border border-line/70 bg-ink/60 p-1.5 backdrop-blur-md">
              {(['exterior', 'front', 'side', 'rear', 'interior'] as CameraPreset[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePreset(p)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize tracking-wide transition-colors ${
                    preset === p ? 'bg-accent text-ink' : 'text-warm-dim hover:text-warm'
                  }`}
                >
                  {p === 'exterior' ? 'Overview' : p}
                </button>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex flex-wrap items-center justify-center gap-2 px-3 sm:bottom-4">
            <div className="pointer-events-auto flex flex-wrap justify-center gap-2">
              {capabilities.headlights && (
                <button
                  onClick={() => setHeadlightsOn((v) => !v)}
                  className={`rounded-full border border-line/70 px-3 py-1.5 text-xs font-medium backdrop-blur-md transition-colors ${
                    headlightsOn ? 'bg-accent text-ink' : 'bg-ink/60 text-warm-dim hover:text-warm'
                  }`}
                >
                  Lights
                </button>
              )}
              {capabilities.hood && (
                <button
                  onClick={() => setHoodOpen((v) => !v)}
                  className={`rounded-full border border-line/70 px-3 py-1.5 text-xs font-medium backdrop-blur-md transition-colors ${
                    hoodOpen ? 'bg-accent text-ink' : 'bg-ink/60 text-warm-dim hover:text-warm'
                  }`}
                >
                  {hoodOpen ? 'Close Hood' : 'Open Hood'}
                </button>
              )}
              {capabilities.doors && (
                <button
                  onClick={() => setDoorsOpen((v) => !v)}
                  className={`rounded-full border border-line/70 px-3 py-1.5 text-xs font-medium backdrop-blur-md transition-colors ${
                    doorsOpen ? 'bg-accent text-ink' : 'bg-ink/60 text-warm-dim hover:text-warm'
                  }`}
                >
                  {doorsOpen ? 'Close Doors' : 'Open Doors'}
                </button>
              )}
              <button
                onClick={resetView}
                className="rounded-full border border-line/70 bg-ink/60 px-3 py-1.5 text-xs font-medium text-warm-dim backdrop-blur-md transition-colors hover:text-warm"
              >
                Reset View
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function CarViewerLoader() {
  return (
    <Loader
      containerStyles={{ background: '#0a0a0b' }}
      innerStyles={{ width: '220px' }}
      barStyles={{ background: '#e8492f' }}
      dataStyles={{ color: '#b8b5ad', fontSize: '12px', letterSpacing: '0.08em', marginTop: '10px' }}
      dataInterpolation={(p) => `Loading experience... ${Math.round(p)}%`}
    />
  )
}
