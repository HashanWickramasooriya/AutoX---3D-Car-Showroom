import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

interface CameraRigProps {
  position: [number, number, number]
  target: [number, number, number]
  controlsRef: React.RefObject<OrbitControlsImpl | null>
  active: boolean
}

export function CameraRig({ position, target, controlsRef, active }: CameraRigProps) {
  const { camera } = useThree()
  const desiredPos = useRef(new THREE.Vector3(...position))
  const desiredTarget = useRef(new THREE.Vector3(...target))
  const transitioning = useRef(true)

  useEffect(() => {
    desiredPos.current.set(...position)
    desiredTarget.current.set(...target)
    transitioning.current = true
  }, [position, target])

  // Only drives the camera while a preset transition is in flight. Once the
  // camera reaches its destination it stops touching camera/controls state
  // entirely, so OrbitControls (autoRotate + user drag) can own it without
  // the two systems fighting over camera.position every frame.
  useFrame((_, delta) => {
    if (!active || !transitioning.current) return

    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredPos.current.x, 3.2, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredPos.current.y, 3.2, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredPos.current.z, 3.2, delta)

    const controls = controlsRef.current
    let targetDist = 0
    if (controls) {
      controls.target.x = THREE.MathUtils.damp(controls.target.x, desiredTarget.current.x, 3.2, delta)
      controls.target.y = THREE.MathUtils.damp(controls.target.y, desiredTarget.current.y, 3.2, delta)
      controls.target.z = THREE.MathUtils.damp(controls.target.z, desiredTarget.current.z, 3.2, delta)
      controls.update()
      targetDist = controls.target.distanceTo(desiredTarget.current)
    } else {
      camera.lookAt(desiredTarget.current)
    }

    const posDist = camera.position.distanceTo(desiredPos.current)
    if (posDist < 0.015 && targetDist < 0.015) {
      transitioning.current = false
    }
  })

  return null
}
