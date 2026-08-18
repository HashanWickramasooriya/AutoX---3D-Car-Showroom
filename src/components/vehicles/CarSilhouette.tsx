import type { BodyType } from '../../data/types'

interface CarSilhouetteProps {
  type: BodyType
  accent: string
  className?: string
}

const PATHS: Record<BodyType, string> = {
  coupe:
    'M18 128 C18 118 30 112 46 110 L70 108 C86 84 112 66 148 62 L212 58 C244 58 268 70 286 92 L318 96 C334 98 344 108 344 120 C344 130 336 138 322 139 L306 139 C304 122 290 110 274 110 C258 110 244 122 242 139 L128 139 C126 122 112 110 96 110 C80 110 66 122 64 139 L34 139 C24 138 18 134 18 128 Z',
  sedan:
    'M14 130 C14 120 26 114 42 113 L62 112 C78 88 106 68 142 66 L206 64 C238 65 262 78 276 98 L322 100 C338 102 348 110 348 122 C348 132 340 140 326 141 L308 141 C306 124 292 112 276 112 C260 112 246 124 244 141 L122 141 C120 124 106 112 90 112 C74 112 60 124 58 141 L30 141 C20 140 14 136 14 130 Z',
  suv:
    'M16 132 C16 118 30 108 50 106 L66 104 C82 76 112 54 152 52 L216 50 C246 51 268 66 280 90 L320 94 C338 96 350 106 350 122 C350 134 340 143 324 144 L306 144 C304 126 290 113 274 113 C258 113 244 126 242 144 L124 144 C122 126 108 113 92 113 C76 113 62 126 60 144 L32 144 C20 143 16 138 16 132 Z',
  gt:
    'M12 128 C12 118 24 112 40 111 L64 109 C82 82 112 62 150 58 L214 55 C248 56 274 70 292 94 L324 98 C340 100 350 108 350 120 C350 130 342 138 328 139 L310 139 C308 122 294 110 278 110 C262 110 248 122 246 139 L118 139 C116 122 102 110 86 110 C70 110 56 122 54 139 L28 139 C18 138 12 134 12 128 Z',
}

export function CarSilhouette({ type, accent, className = '' }: CarSilhouetteProps) {
  return (
    <svg viewBox="0 0 360 160" className={className} role="presentation" aria-hidden="true">
      <defs>
        <radialGradient id={`glow-${type}`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`body-${type}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#232327" />
          <stop offset="100%" stopColor="#0e0e10" />
        </linearGradient>
      </defs>
      <ellipse cx="180" cy="150" rx="170" ry="10" fill={`url(#glow-${type})`} />
      <path d={PATHS[type]} fill={`url(#body-${type})`} stroke={accent} strokeOpacity="0.5" strokeWidth="1" />
      <circle cx="96" cy="139" r="16" fill="#08080a" stroke="#3a3a3e" strokeWidth="2" />
      <circle cx="274" cy="139" r="16" fill="#08080a" stroke="#3a3a3e" strokeWidth="2" />
      <rect x="150" y="66" width="90" height="30" rx="8" fill="#0a1014" opacity="0.7" />
    </svg>
  )
}
