import { Link } from 'react-router-dom'
import { vehicles } from '../../data/vehicles'

const columns: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: 'Models',
    links: vehicles.map((v) => ({ to: `/vehicles/${v.id}`, label: v.model })),
  },
  {
    title: 'Explore',
    links: [
      { to: '/configurator/gr-supra', label: 'Configurator' },
      { to: '/compare', label: 'Compare' },
      { to: '/finance', label: 'Finance' },
      { to: '/technology', label: 'Technology' },
    ],
  },
  {
    title: 'Ownership',
    links: [
      { to: '/showrooms', label: 'Showrooms' },
      { to: '/test-drive', label: 'Test Drive' },
      { to: '/saved', label: 'Saved Configurations' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/safety', label: 'Safety' },
      { to: '/electric', label: 'Electric' },
      { to: '/gallery', label: 'Gallery' },
    ],
  },
  {
    title: 'Support',
    links: [
      { to: '/showrooms', label: 'Contact a Showroom' },
      { to: '/test-drive', label: 'Book a Test Drive' },
      { to: '/finance', label: 'Financing Help' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <span className="font-display text-2xl tracking-tight text-warm">AUTOX</span>
            <p className="mt-3 max-w-xs text-sm text-warm-dim">Drive what defines you.</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-metal">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-warm-dim transition-colors hover:text-warm">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-xs text-warm-dim sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AUTOX. All rights reserved.</p>
          <p>Created by Hashan Janith Wickramasooriya</p>
        </div>
      </div>
    </footer>
  )
}
