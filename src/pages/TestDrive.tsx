import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { vehicles } from '../data/vehicles'
import { usePageTitle } from '../hooks/usePageTitle'
import { SectionHeading } from '../components/ui/SectionHeading'
import { useTestDriveRequests } from '../hooks/useAppState'
import { Button } from '../components/ui/Button'

const locations = ['Colombo', 'Kandy', 'Galle']

export function TestDrive() {
  usePageTitle('Book a Test Drive')
  const location = useLocation() as { state?: { vehicleId?: string } }
  const { submitRequest } = useTestDriveRequests()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleId: location.state?.vehicleId ?? vehicles[0].id,
    date: '',
    time: '',
    location: locations[0],
  })
  const [submitted, setSubmitted] = useState(false)

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitRequest(form)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent text-accent">
          ✓
        </div>
        <h1 className="mt-6 font-display text-2xl text-warm sm:text-3xl">Test drive request submitted.</h1>
        <p className="mt-3 max-w-md text-warm-dim">
          A member of the AUTOX team will contact you to confirm your appointment. This is demo functionality, no
          request has been sent to a real dealership.
        </p>
        <Button to="/" className="mt-8">
          Back to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="pt-24 sm:pt-28">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Ownership"
          title="Book a test drive."
          description="Tell us where and when. This is a demo booking flow and doesn't contact a real dealership."
        />

        <form onSubmit={handleSubmit} className="mt-10 space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-warm-dim">Full name</span>
              <input
                required
                value={form.name}
                onChange={update('name')}
                className="mt-2 w-full rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-warm focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-warm-dim">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={update('email')}
                className="mt-2 w-full rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-warm focus:outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-wider text-warm-dim">Phone</span>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={update('phone')}
              className="mt-2 w-full rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-warm focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-wider text-warm-dim">Preferred vehicle</span>
            <select
              value={form.vehicleId}
              onChange={update('vehicleId')}
              className="mt-2 w-full rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-warm focus:outline-none"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-warm-dim">Preferred date</span>
              <input
                required
                type="date"
                value={form.date}
                onChange={update('date')}
                className="mt-2 w-full rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-warm focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-warm-dim">Preferred time</span>
              <input
                required
                type="time"
                value={form.time}
                onChange={update('time')}
                className="mt-2 w-full rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-warm focus:outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-wider text-warm-dim">Location</span>
            <select
              value={form.location}
              onChange={update('location')}
              className="mt-2 w-full rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-warm focus:outline-none"
            >
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>

          <Button type="submit" className="w-full">
            Submit Request
          </Button>
        </form>
      </div>
    </div>
  )
}
