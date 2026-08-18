import { ContactShadows, Environment, Lightformer } from '@react-three/drei'

interface StudioProps {
  lowPower?: boolean
}

/**
 * Four studio walls forming a shallow room around the car, positioned far
 * enough out (with fog fading their far edges) that they never intrude on
 * any camera preset's framing, but close enough to still be visible at the
 * edges of frame from every angle - front, rear, side and the 3/4 overview
 * all look across the car at a wall instead of an empty void, whichever way
 * the camera happens to be facing.
 */
const WALL_DISTANCE = 13
const WALLS: { position: [number, number, number]; rotationY: number }[] = [
  { position: [0, 4, -WALL_DISTANCE], rotationY: 0 },
  { position: [0, 4, WALL_DISTANCE], rotationY: Math.PI },
  { position: [-WALL_DISTANCE, 4, 0], rotationY: Math.PI / 2 },
  { position: [WALL_DISTANCE, 4, 0], rotationY: -Math.PI / 2 },
]

/**
 * The premium-showroom backdrop shared by every <CarViewer>: a four-wall
 * room with a glossy floor, so the vehicle reads as physically placed in a
 * showroom rather than floating in a void, from any camera angle.
 */
export function Studio({ lowPower }: StudioProps) {
  return (
    <>
      <ambientLight intensity={0.42} />
      <hemisphereLight args={['#3a4a55', '#0a0a0b', 0.5]} />

      {/* Key light */}
      <directionalLight
        position={[6, 8, 4]}
        intensity={2.2}
        color="#fff8ee"
        castShadow={!lowPower}
        shadow-mapSize={[lowPower ? 512 : 1536, lowPower ? 512 : 1536]}
        shadow-bias={-0.0004}
      >
        <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 0.5, 20]} />
      </directionalLight>

      {/* Fill light */}
      <directionalLight position={[-6, 3, -3]} intensity={0.5} color="#8fb3c9" />

      {/* Rim light */}
      <directionalLight position={[-2, 4, -8]} intensity={1.4} color="#ffb27a" />

      {/* Procedural studio environment - no external HDR fetch, works fully offline */}
      <Environment resolution={lowPower ? 64 : 256} frames={1} environmentIntensity={0.65}>
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 5, -6]} scale={[10, 5, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#dfe9ff" position={[-6, 3, 4]} rotation-y={Math.PI / 3} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#ffcf9e" position={[6, 2, -2]} rotation-y={-Math.PI / 3} scale={[6, 4, 1]} />
        <Lightformer form="ring" intensity={1} color="#8fa4b8" position={[0, 1, 8]} scale={4} />
      </Environment>

      <ContactShadows
        position={[0, 0.012, 0]}
        opacity={0.7}
        scale={16}
        blur={2.2}
        far={4}
        resolution={lowPower ? 256 : 1024}
        color="#000000"
      />

      {/* Studio walls on all four sides, well clear of the car and every
          camera preset, so the space around the vehicle reads as a room from
          any angle - front, rear, side and the 3/4 overview - rather than an
          infinite void behind the car in some views and open black in
          others. Not a curved Backdrop cove (that geometry crowded the
          camera and threw off how large the car read in frame). */}
      {WALLS.map((wall, i) => (
        <mesh key={i} position={wall.position} rotation={[0, wall.rotationY, 0]} receiveShadow>
          <planeGeometry args={[30, 14]} />
          <meshStandardMaterial color="#1a1c1f" roughness={0.9} metalness={0.05} />
        </mesh>
      ))}
      {/* Raking wall-wash lights: positioned between the car and a wall,
          aimed back at it at a grazing angle so that wall reads as a clearly
          lit surface (the technique real studio photographers use) for the
          most common viewing angles. The other two walls still receive
          baseline illumination from the key/fill/rim lights and ambient/
          hemisphere light above, just less dramatically. */}
      <spotLight position={[0, 6, -6]} target-position={[0, 2, -10]} angle={0.9} penumbra={1} intensity={6} color="#9fb6c9" distance={16} />
      <spotLight position={[0, 2, -6]} target-position={[0, 3, -10]} angle={0.8} penumbra={1} intensity={4} color="#ffcf9e" distance={14} />
      <spotLight position={[6, 5, 0]} target-position={[10, 2, 0]} angle={0.9} penumbra={1} intensity={4} color="#ffcf9e" distance={16} />
      <spotLight position={[-6, 5, 0]} target-position={[-10, 2, 0]} angle={0.9} penumbra={1} intensity={4} color="#9fb6c9" distance={16} />

      {/* Glossy floor. A true planar reflection (MeshReflectorMaterial) renders
          the whole scene a second time from a mirrored camera - measured to be
          too expensive once two viewers are ever on screen together (the Home
          hero + scroll story), so this uses the same environment map the car's
          paint already samples for a cheap, single-pass glossy response
          instead of a real-time mirror. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
        <circleGeometry args={[WALL_DISTANCE, lowPower ? 36 : 64]} />
        <meshStandardMaterial color="#0b0c0d" roughness={0.35} metalness={0.55} envMapIntensity={1.1} />
      </mesh>
    </>
  )
}
