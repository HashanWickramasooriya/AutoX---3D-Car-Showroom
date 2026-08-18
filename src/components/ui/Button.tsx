import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg' | 'sm'

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-ink hover:bg-accent-dim',
  secondary: 'border border-line text-warm hover:border-metal hover:bg-surface-2',
  ghost: 'text-warm-dim hover:text-warm',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-3 text-sm',
  lg: 'px-7 py-3.5 text-sm',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none'

interface LinkButtonProps {
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
  to: string
}

interface NativeButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
  to?: undefined
}

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { variant = 'primary', size = 'md', className = '', children } = props
  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  if (props.to) {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    )
  }

  const { variant: _v, size: _s, className: _c, children: _ch, to: _to, ...buttonProps } = props
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
