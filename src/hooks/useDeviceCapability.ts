import { useEffect, useState } from 'react'

function isSoftwareRenderer() {
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null
    if (!gl) return false
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
    return /swiftshader|llvmpipe|software/i.test(renderer)
  } catch {
    return false
  }
}

export function useDeviceCapability() {
  const [lowPower, setLowPower] = useState(false)

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 8
    const narrow = window.innerWidth < 768
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Falling back to a software GL rasterizer (headless environments, blocklisted/old
    // GPU drivers) can't sustain shadows/high DPR - treat it the same as low-power hardware.
    setLowPower(cores <= 4 || (narrow && cores <= 6) || reducedMotion || isSoftwareRenderer())
  }, [])

  return { lowPower }
}
