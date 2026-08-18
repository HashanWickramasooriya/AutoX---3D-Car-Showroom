import { useMemo, useState } from 'react'
import { vehicles } from '../data/vehicles'
import { formatLKR } from '../utils/format'
import { usePageTitle } from '../hooks/usePageTitle'
import { SectionHeading } from '../components/ui/SectionHeading'
import { DemoBadge } from '../components/ui/DemoBadge'

export function Finance() {
  usePageTitle('Finance Calculator')
  const [vehicleId, setVehicleId] = useState(vehicles[0].id)
  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? vehicles[0]

  const [downPayment, setDownPayment] = useState(4_000_000)
  const [period, setPeriod] = useState(5)
  const [rate, setRate] = useState(8.5)

  const loanAmount = Math.max(vehicle.basePrice - downPayment, 0)

  const monthlyPayment = useMemo(() => {
    const monthlyRate = rate / 100 / 12
    const months = period * 12
    if (monthlyRate === 0) return loanAmount / months
    return (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
  }, [loanAmount, rate, period])

  const totalPayable = monthlyPayment * period * 12
  const totalInterest = totalPayable - loanAmount

  return (
    <div className="pt-24 sm:pt-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Ownership"
          title="Estimate your monthly payment."
          description="Adjust the numbers to see how price, down payment, term and interest affect your estimated instalment."
        />

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6 rounded-2xl border border-line bg-surface p-5 sm:p-8">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-warm-dim">Vehicle</span>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="mt-2 w-full rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-warm focus:outline-none"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} - {formatLKR(v.basePrice)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="flex justify-between text-xs uppercase tracking-wider text-warm-dim">
                <span>Down payment</span>
                <span className="text-warm">{formatLKR(downPayment)}</span>
              </span>
              <input
                type="range"
                min={0}
                max={vehicle.basePrice * 0.8}
                step={100_000}
                value={Math.min(downPayment, vehicle.basePrice * 0.8)}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="mt-3 w-full accent-accent"
              />
            </label>

            <label className="block">
              <span className="flex justify-between text-xs uppercase tracking-wider text-warm-dim">
                <span>Loan period</span>
                <span className="text-warm">{period} years</span>
              </span>
              <input
                type="range"
                min={1}
                max={7}
                step={1}
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                className="mt-3 w-full accent-accent"
              />
            </label>

            <label className="block">
              <span className="flex justify-between text-xs uppercase tracking-wider text-warm-dim">
                <span>Interest rate</span>
                <span className="text-warm">{rate.toFixed(1)}%</span>
              </span>
              <input
                type="range"
                min={4}
                max={16}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="mt-3 w-full accent-accent"
              />
            </label>
          </div>

          <div className="h-fit rounded-2xl border border-line bg-surface-2 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-warm">Estimated payment</h2>
              <DemoBadge />
            </div>
            <p className="mt-4 font-display text-4xl text-warm">{formatLKR(Math.round(monthlyPayment))}</p>
            <p className="text-xs text-warm-dim">per month</p>

            <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-warm-dim">Vehicle price</dt>
                <dd className="text-warm">{formatLKR(vehicle.basePrice)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-warm-dim">Down payment</dt>
                <dd className="text-warm">{formatLKR(downPayment)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-warm-dim">Loan amount</dt>
                <dd className="text-warm">{formatLKR(loanAmount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-warm-dim">Total interest</dt>
                <dd className="text-warm">{formatLKR(Math.round(totalInterest))}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2.5">
                <dt className="font-medium text-warm">Total payable</dt>
                <dd className="font-medium text-warm">{formatLKR(Math.round(totalPayable))}</dd>
              </div>
            </dl>

            <p className="mt-6 text-[11px] leading-relaxed text-warm-dim">
              Demo calculation, not a financial offer. Actual financing terms depend on lender approval, credit
              profile and prevailing market rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
