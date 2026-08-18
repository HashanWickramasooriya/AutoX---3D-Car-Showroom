/**
 * Per-vehicle 3D asset configuration. Each AUTOX vehicle now maps to a real,
 * separately-sourced GLB (see README's "3D Assets" section for source/
 * license/attribution per file). Because each file comes from a different
 * artist/pipeline, they name nodes and materials differently - this config
 * tells CarModel.tsx how to find the parts it needs to drive (front/rear
 * orientation, body paint, interior trim, wheel finish, headlights) for each
 * specific asset, instead of assuming one naming convention works for all.
 */

export type OrientationStrategy =
  /** Locate the four wheel-assembly nodes by name and derive heading from their positions. Most robust - prefer this when the asset has usable node names. */
  | { mode: 'wheels'; aliases: Record<'frontL' | 'frontR' | 'rearL' | 'rearR', string[]> }
  /** Locate a single front-reference and single rear-reference node (e.g. bumper pivots) and derive heading from those two points. */
  | { mode: 'frontRearPoints'; front: string[]; rear: string[] }
  /** No usable named reference nodes in the asset - heading was determined once by visual inspection and hardcoded. */
  | { mode: 'manual'; headingDeg: number }

export interface MaterialMatcherOverrides {
  bodyPaint?: string[]
  interiorAccent?: string[]
  wheelRim?: string[]
  headlight?: string[]
}

/**
 * A handful of scalar knobs applied to CarViewer's shared camera presets, so
 * different body styles get a distinct-feeling default presentation instead
 * of one generic framing forced onto every vehicle. All vehicles are already
 * normalized to the same overall length (see CarModel.tsx), so these are
 * deliberately small, relative adjustments, not per-vehicle camera rigs.
 */
export interface CameraProfile {
  /** Multiplies camera distance from its look-at target - >1 pulls back for a more spacious frame, <1 tightens the crop. */
  distanceScale?: number
  /** Added to the camera's height only (not the look-at target) - negative lowers the eye line for a more ground-hugging, dynamic angle; positive raises it for a more commanding, elevated view. */
  cameraHeightBias?: number
}

export interface Vehicle3DConfig {
  modelUrl: string
  orientation: OrientationStrategy
  materialMatchers?: MaterialMatcherOverrides
  cameraProfile?: CameraProfile
}

const grSupraConfig: Vehicle3DConfig = {
  modelUrl: '/models/toyota_gr_supra.glb',
  orientation: {
    mode: 'wheels',
    // Authored as `Wheel.Ft.L` etc; three.js's GLTFLoader strips dots from
    // node names at parse time, so it actually loads as `WheelFtL`.
    aliases: {
      frontL: ['WheelFrontL', 'WheelFtL'],
      frontR: ['WheelFrontR', 'WheelFtR'],
      rearL: ['WheelRearL', 'WheelBkL'],
      rearR: ['WheelRearR', 'WheelBkR'],
    },
  },
  // Sports coupe: a slightly lower, tighter angle reads as more dynamic.
  cameraProfile: { distanceScale: 0.96, cameraHeightBias: -0.1 },
}

const landCruiserConfig: Vehicle3DConfig = {
  modelUrl: '/models/2025_toyota_land_cruiser_250.glb',
  // This export has no semantic node names at all (UUID-based mesh names),
  // so front/rear can't be auto-detected - heading fixed once by inspection.
  orientation: { mode: 'manual', headingDeg: 90 },
  materialMatchers: {
    interiorAccent: ['cuero'], // Spanish for "leather" - this asset's seat material naming
    headlight: ['light_emiss'],
  },
  // SUV: a taller, more commanding stance - camera sits a touch lower relative
  // to the vehicle's height so the Land Cruiser reads as looking down on you.
  cameraProfile: { distanceScale: 1.05, cameraHeightBias: -0.2 },
}

const teslaModel3Config: Vehicle3DConfig = {
  modelUrl: '/models/tesla_2018_model_3.glb',
  orientation: {
    mode: 'frontRearPoints',
    front: ['bump_front_dummy'],
    rear: ['bump_rear_dummy'],
  },
  materialMatchers: {
    bodyPaint: ['primary'],
    wheelRim: ['wheels'],
    headlight: ['front_light'],
  },
  // Modern and minimal: a tighter, level, confident crop.
  cameraProfile: { distanceScale: 0.9, cameraHeightBias: 0 },
}

const maybachConfig: Vehicle3DConfig = {
  modelUrl: '/models/mercedes-benz_maybach_2022.glb',
  // No semantic node names in this export either - heading fixed once by inspection.
  orientation: { mode: 'manual', headingDeg: 180 },
  // Luxury sedan: more breathing room and a slightly elevated, composed angle.
  cameraProfile: { distanceScale: 1.18, cameraHeightBias: 0.15 },
}

const bmwM4Config: Vehicle3DConfig = {
  modelUrl: '/models/bmw_m4_f82.glb',
  // No paired front/rear wheel or bumper reference nodes in this export - heading fixed once by inspection.
  orientation: { mode: 'manual', headingDeg: 0 },
  materialMatchers: {
    // This asset's paintable body material is literally called "rgb" (an artist convention for "recolor this").
    bodyPaint: ['arm4_rgb'],
    headlight: ['lowbeam', 'highbeam'],
  },
  cameraProfile: { distanceScale: 0.94, cameraHeightBias: -0.22 },
}

const porsche911Config: Vehicle3DConfig = {
  modelUrl: '/models/free_porsche_911_carrera_4s.glb',
  // Default Blender node names (Plane/Cube/Cylinder) - no usable reference nodes, heading fixed once by inspection.
  orientation: { mode: 'manual', headingDeg: 0 },
  materialMatchers: {
    headlight: ['lights'],
  },
  cameraProfile: { distanceScale: 0.92, cameraHeightBias: -0.25 },
}

const aventadorConfig: Vehicle3DConfig = {
  modelUrl: '/models/lamborghini_aventador_with_interior.glb',
  // No paired front/rear reference nodes - heading fixed once by inspection.
  orientation: { mode: 'manual', headingDeg: 0 },
  materialMatchers: {
    bodyPaint: ['body'],
    headlight: ['front_light'],
  },
  // The flagship supercar: the lowest, widest, most dramatic angle in the fleet.
  cameraProfile: { distanceScale: 0.98, cameraHeightBias: -0.35 },
}

export const VEHICLE_3D: Record<string, Vehicle3DConfig> = {
  'gr-supra': grSupraConfig,
  terrano: landCruiserConfig,
  nova: teslaModel3Config,
  auron: maybachConfig,
  'bmw-m4': bmwM4Config,
  '911-carrera-4s': porsche911Config,
  aventador: aventadorConfig,
}

export function getVehicle3DConfig(vehicleId: string): Vehicle3DConfig {
  return VEHICLE_3D[vehicleId] ?? grSupraConfig
}
