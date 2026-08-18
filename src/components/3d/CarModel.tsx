import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { BodyType } from '../../data/types'
import { getVehicle3DConfig, type Vehicle3DConfig } from '../../data/vehicle3d'
import type { WheelStyle } from './Wheel'

export interface CarMaterialProps {
  color: string
  metalness: number
  roughness: number
}

export interface CarCapabilities {
  hood: boolean
  doors: boolean
  headlights: boolean
}

interface CarModelProps {
  vehicleId: string
  type: BodyType
  material: CarMaterialProps
  wheelStyle: WheelStyle
  headlightsOn: boolean
  hoodOpen: boolean
  doorsOpen?: boolean
  interiorHex: string
  onCapabilities?: (caps: CarCapabilities) => void
}

/** Target overall vehicle length (metres) once normalized - keeps camera presets tuned once, valid for any source asset. */
const TARGET_LENGTH = 4.6

/** Alternate node-name spellings for a hinged hood/door group, if the asset has one. */
const HOOD_NODE_ALIASES = ['BodyHood', 'Hood', 'bonnet_dummy']
const DOOR_L_NODE_ALIASES = ['BodyDoorLColor1', 'Door.L', 'DoorL', 'door_lf_dummy']
const DOOR_R_NODE_ALIASES = ['BodyDoorRColor1', 'Door.R', 'DoorR', 'door_rf_dummy']

/**
 * Default material name fragments used to auto-detect each functional group
 * inside an imported GLB. Different assets name their materials differently,
 * so `Vehicle3DConfig.materialMatchers` (see data/vehicle3d.ts) can override
 * any of these per vehicle.
 */
const DEFAULT_MATERIAL_MATCHERS = {
  bodyPaint: ['paint'],
  interiorAccent: ['leather'],
  wheelRim: ['rim'],
  headlight: ['headlight', 'reflectled'],
}

const WHEEL_FINISH: Record<WheelStyle, { color: string; metalness: number; roughness: number }> = {
  'sport-19': { color: '#c7c9cc', metalness: 0.75, roughness: 0.45 },
  'performance-20': { color: '#e9eaed', metalness: 0.9, roughness: 0.22 },
  'carbon-21': { color: '#1c1c1f', metalness: 0.4, roughness: 0.55 },
}

function nameMatches(name: string, fragments: readonly string[]) {
  const lower = name.toLowerCase()
  return fragments.some((f) => lower.includes(f))
}

function findByAliases(root: THREE.Object3D, aliases: string[]): THREE.Object3D | null {
  for (const name of aliases) {
    const found = root.getObjectByName(name)
    if (found) return found
  }
  return null
}

function useHingeLerp(target: number, speed = 4) {
  const ref = useRef(0)
  useFrame((_, delta) => {
    ref.current = THREE.MathUtils.damp(ref.current, target, speed, delta)
  })
  return ref
}

/** Resolves the heading (radians, three.js RotationY convention) that rotates the model so its front points +X, using whichever strategy the vehicle's config specifies. */
function resolveHeading(model: THREE.Object3D, orientation: Vehicle3DConfig['orientation']): number {
  if (orientation.mode === 'manual') {
    return THREE.MathUtils.degToRad(orientation.headingDeg)
  }

  let frontPoint: THREE.Vector3 | null = null
  let rearPoint: THREE.Vector3 | null = null

  if (orientation.mode === 'wheels') {
    const frontL = findByAliases(model, orientation.aliases.frontL)
    const frontR = findByAliases(model, orientation.aliases.frontR)
    const rearL = findByAliases(model, orientation.aliases.rearL)
    const rearR = findByAliases(model, orientation.aliases.rearR)
    if (frontL && frontR && rearL && rearR) {
      frontPoint = frontL.getWorldPosition(new THREE.Vector3()).add(frontR.getWorldPosition(new THREE.Vector3())).multiplyScalar(0.5)
      rearPoint = rearL.getWorldPosition(new THREE.Vector3()).add(rearR.getWorldPosition(new THREE.Vector3())).multiplyScalar(0.5)
    }
  } else if (orientation.mode === 'frontRearPoints') {
    const front = findByAliases(model, orientation.front)
    const rear = findByAliases(model, orientation.rear)
    if (front && rear) {
      frontPoint = front.getWorldPosition(new THREE.Vector3())
      rearPoint = rear.getWorldPosition(new THREE.Vector3())
    }
  }

  if (!frontPoint || !rearPoint) return 0

  // three.js RotationY maps (x,z) -> (x cosθ + z sinθ, -x sinθ + z cosθ), so
  // θ = atan2(dz, dx) is exactly the angle that rotates the rear→front
  // vector (dx, dz) onto (+X, 0). (Verified numerically - do not "fix" this
  // sign again without re-deriving.)
  return Math.atan2(frontPoint.z - rearPoint.z, frontPoint.x - rearPoint.x)
}

export function CarModel({
  vehicleId,
  material,
  wheelStyle,
  headlightsOn,
  hoodOpen,
  doorsOpen = false,
  interiorHex,
  onCapabilities,
}: CarModelProps) {
  const config = useMemo(() => getVehicle3DConfig(vehicleId), [vehicleId])
  const matchers = { ...DEFAULT_MATERIAL_MATCHERS, ...config.materialMatchers }
  const { scene } = useGLTF(config.modelUrl)

  const orientRef = useRef<THREE.Group>(null)
  const modelRef = useRef<THREE.Group>(null)
  const hoodRef = useRef<THREE.Object3D | null>(null)
  const doorLRef = useRef<THREE.Object3D | null>(null)
  const doorRRef = useRef<THREE.Object3D | null>(null)
  const [headlightAnchor, setHeadlightAnchor] = useState<{ x: number; y: number; zL: number; zR: number } | null>(
    null,
  )

  // Deep-clone the shared GLTF scene graph per <CarModel> instance so multiple
  // viewers on screen at once (hero + scroll story) never fight over the same
  // materials/nodes. Each unique material is cloned once and reused across the
  // meshes that shared it, mirroring the source asset's material grouping.
  const clone = useMemo(() => {
    const root = scene.clone(true)
    const materialCache = new Map<THREE.Material, THREE.Material>()
    const bodyPaintMats: THREE.MeshStandardMaterial[] = []
    const interiorMats: THREE.MeshStandardMaterial[] = []
    const wheelMats: THREE.MeshStandardMaterial[] = []
    const headlightMats: THREE.MeshStandardMaterial[] = []

    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = true
      mesh.receiveShadow = true

      const assign = (mat: THREE.Material): THREE.Material => {
        let cloned = materialCache.get(mat)
        if (!cloned) {
          cloned = mat.clone()
          materialCache.set(mat, cloned)
          const name = cloned.name || ''
          const std = cloned as THREE.MeshStandardMaterial
          if (nameMatches(name, matchers.bodyPaint)) bodyPaintMats.push(std)
          else if (nameMatches(name, matchers.interiorAccent)) interiorMats.push(std)
          else if (nameMatches(name, matchers.wheelRim)) wheelMats.push(std)
          else if (nameMatches(name, matchers.headlight)) headlightMats.push(std)
        }
        return cloned
      }

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map(assign)
      } else {
        mesh.material = assign(mesh.material)
      }
    })

    const hood = findByAliases(root, HOOD_NODE_ALIASES)
    const doorL = findByAliases(root, DOOR_L_NODE_ALIASES)
    const doorR = findByAliases(root, DOOR_R_NODE_ALIASES)

    return { root, bodyPaintMats, interiorMats, wheelMats, headlightMats, hood, doorL, doorR }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene])

  hoodRef.current = clone.hood
  doorLRef.current = clone.doorL
  doorRRef.current = clone.doorR

  // Report which interactions this asset actually supports, so CarViewer can
  // hide controls that would otherwise do nothing (no fake buttons).
  useLayoutEffect(() => {
    onCapabilities?.({
      hood: !!clone.hood,
      doors: !!(clone.doorL || clone.doorR),
      headlights: clone.headlightMats.length > 0,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clone])

  // Auto-orient + normalize: resolve which way the car actually faces (see
  // resolveHeading - strategy varies per asset, configured in data/vehicle3d.ts),
  // then center/ground/scale it to a known size so the camera presets tuned
  // in CarViewer stay valid regardless of the raw model's authored units.
  useLayoutEffect(() => {
    const orient = orientRef.current
    const model = modelRef.current
    if (!orient || !model) return

    orient.rotation.set(0, 0, 0)
    orient.position.set(0, 0, 0)
    orient.scale.setScalar(1)
    model.updateMatrixWorld(true)

    const heading = resolveHeading(model, config.orientation)
    orient.rotation.y = heading
    orient.updateMatrixWorld(true)

    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const length = Math.max(size.x, 0.001)
    const scale = TARGET_LENGTH / length

    orient.scale.setScalar(scale)
    orient.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale)

    // Headlight glow anchors to the front-most point of the normalized
    // bounding box, offset up from the floor - a reasonable bumper-height
    // estimate for any car regardless of asset-specific node names.
    setHeadlightAnchor({
      x: box.max.x - size.x * 0.02,
      y: box.min.y + size.y * 0.16,
      zL: size.z * 0.28,
      zR: -size.z * 0.28,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clone])

  // Live-apply the selected exterior color / interior trim / wheel finish to
  // the already-cloned materials whenever the configurator selection changes.
  useMemo(() => {
    clone.bodyPaintMats.forEach((mat) => {
      mat.color.set(material.color)
      mat.metalness = material.metalness
      mat.roughness = material.roughness
    })
    clone.interiorMats.forEach((mat) => {
      mat.color.set(interiorHex)
    })
    const finish = WHEEL_FINISH[wheelStyle]
    clone.wheelMats.forEach((mat) => {
      mat.color.set(finish.color)
      mat.metalness = finish.metalness
      mat.roughness = finish.roughness
    })
  }, [clone, material, interiorHex, wheelStyle])

  useMemo(() => {
    clone.headlightMats.forEach((mat) => {
      mat.emissive = new THREE.Color(headlightsOn ? '#fff2c9' : '#000000')
      mat.emissiveIntensity = headlightsOn ? 3 : 0
    })
  }, [clone, headlightsOn])

  const hoodAngle = useHingeLerp(hoodOpen ? -0.62 : 0)
  const doorLAngle = useHingeLerp(doorsOpen ? 0.7 : 0)
  const doorRAngle = useHingeLerp(doorsOpen ? -0.7 : 0)

  useFrame(() => {
    if (hoodRef.current) hoodRef.current.rotation.x = hoodAngle.current
    if (doorLRef.current) doorLRef.current.rotation.y = doorLAngle.current
    if (doorRRef.current) doorRRef.current.rotation.y = doorRAngle.current
  })

  const headlightGlow =
    headlightsOn && headlightAnchor ? (
      <>
        <spotLight
          position={[headlightAnchor.x, headlightAnchor.y, headlightAnchor.zL]}
          target-position={[headlightAnchor.x + 6, 0, headlightAnchor.zL]}
          angle={0.35}
          penumbra={0.6}
          intensity={8}
          distance={9}
          color="#fff2c9"
        />
        <spotLight
          position={[headlightAnchor.x, headlightAnchor.y, headlightAnchor.zR]}
          target-position={[headlightAnchor.x + 6, 0, headlightAnchor.zR]}
          angle={0.35}
          penumbra={0.6}
          intensity={8}
          distance={9}
          color="#fff2c9"
        />
      </>
    ) : null

  return (
    <group ref={orientRef}>
      <group ref={modelRef}>
        <primitive object={clone.root} />
      </group>
      {headlightGlow}
    </group>
  )
}

useGLTF.preload(getVehicle3DConfig('gr-supra').modelUrl)
