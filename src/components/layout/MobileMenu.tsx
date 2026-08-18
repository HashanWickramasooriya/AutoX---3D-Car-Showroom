import { Link, NavLink } from 'react-router-dom'

interface MobileMenuProps {
  onClose: () => void
}

const links = [
  { to: '/vehicles', label: 'Models' },
  { to: '/configurator/gr-supra', label: 'Configurator' },
  { to: '/compare', label: 'Compare' },
  { to: '/finance', label: 'Finance' },
  { to: '/technology', label: 'Technology' },
  { to: '/showrooms', label: 'Showrooms' },
  { to: '/saved', label: 'Saved' },
  { to: '/test-drive', label: 'Test Drive' },
]

export function MobileMenu({ onClose }: MobileMenuProps) {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-ink" role="dialog" aria-modal="true">
      <div className="flex items-center justify-between px-5 py-5">
        <span className="font-display text-xl tracking-tight text-warm">AUTOX</span>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-full border border-line p-2 text-warm-dim hover:text-warm"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 pb-8 pt-4">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={onClose}
            className={({ isActive }) =>
              `border-b border-line/60 py-4 font-display text-2xl tracking-tight transition-colors ${
                isActive ? 'text-accent' : 'text-warm hover:text-accent'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 pb-8">
        <Link
          to="/configurator/gr-supra"
          onClick={onClose}
          className="block w-full rounded-full bg-accent px-6 py-4 text-center text-sm font-medium tracking-wide text-ink"
        >
          Configure Your Car
        </Link>
      </div>
    </div>
  )
}
