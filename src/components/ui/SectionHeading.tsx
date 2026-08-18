interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({ eyebrow, title, description, align = 'left', className = '' }: SectionHeadingProps) {
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>}
      <h2 className="mt-3 text-balance font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight text-warm">
        {title}
      </h2>
      {description && <p className="mt-4 text-balance text-base leading-relaxed text-warm-dim">{description}</p>}
    </div>
  )
}
