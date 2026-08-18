export function DemoBadge({ label = 'Demo data', className = '' }: { label?: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-warm-dim ${className}`}
    >
      <span className="h-1 w-1 rounded-full bg-metal" />
      {label}
    </span>
  )
}
