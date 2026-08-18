import { useEffect, useRef, useState } from 'react'

/**
 * Tracks whether an element is near the viewport. Used to keep at most one
 * heavy 3D canvas mounted at a time on pages that place multiple <CarViewer>
 * instances on the same scroll (e.g. the Home hero + scroll story) - GPU/VRAM
 * cost roughly doubles per concurrent canvas, which matters most on mobile.
 */
export function useInView<T extends HTMLElement>(rootMargin = '600px 0px') {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return { ref, inView }
}
