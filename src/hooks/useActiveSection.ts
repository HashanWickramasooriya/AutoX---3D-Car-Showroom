import { useEffect, useState, type RefObject } from 'react'

export function useActiveSection(refs: RefObject<HTMLElement | null>[], rootMargin = '-45% 0px -45% 0px') {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = refs.findIndex((r) => r.current === entry.target)
            if (idx !== -1) setActiveIndex(idx)
          }
        })
      },
      { rootMargin, threshold: 0 },
    )

    refs.forEach((r) => {
      if (r.current) observer.observe(r.current)
    })

    return () => observer.disconnect()
  }, [refs, rootMargin])

  return activeIndex
}
