import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { MobileMenu } from './MobileMenu'
import { SearchOverlay } from './SearchOverlay'
import { useFavorites } from '../../hooks/useAppState'

const links = [
  { to: '/vehicles', label: 'Models' },
  { to: '/configurator/gr-supra', label: 'Configurator' },
  { to: '/compare', label: 'Compare' },
  { to: '/finance', label: 'Finance' },
  { to: '/technology', label: 'Technology' },
  { to: '/showrooms', label: 'Showrooms' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { favorites } = useFavorites()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-colors duration-300 ${
          scrolled ? 'border-b border-line bg-ink/85 backdrop-blur-md' : 'bg-gradient-to-b from-ink/70 to-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">
          <Link to="/" className="font-display text-xl tracking-tight text-warm sm:text-2xl">
            AUTOX
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wide transition-colors ${
                    isActive ? 'text-warm' : 'text-warm-dim hover:text-warm'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search vehicles"
              className="rounded-full p-2 text-warm-dim transition-colors hover:text-warm"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 16L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <Link
              to="/saved"
              aria-label="Saved configurations"
              className="relative hidden rounded-full p-2 text-warm-dim transition-colors hover:text-warm sm:inline-flex"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 15.5s-6.5-3.9-6.5-8.4A3.6 3.6 0 0 1 9 4.9a3.6 3.6 0 0 1 6.5 2.2c0 4.5-6.5 8.4-6.5 8.4Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill={favorites.length ? 'currentColor' : 'none'}
                />
              </svg>
            </Link>

            <Link
              to="/configurator/gr-supra"
              className="hidden rounded-full bg-accent px-5 py-2.5 text-xs font-medium tracking-wide text-ink transition-colors hover:bg-accent-dim sm:inline-flex"
            >
              Configure Your Car
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="rounded-full p-2 text-warm-dim transition-colors hover:text-warm lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  )
}
