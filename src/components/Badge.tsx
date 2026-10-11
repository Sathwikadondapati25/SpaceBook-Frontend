interface BadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'orange' | 'red' | 'blue' | 'gray' | 'primary' | 'accent'
  size?: 'small' | 'medium'
  outline?: boolean
  className?: string
}

export default function Badge({ children, variant = 'green', size = 'medium', outline = false, className = '' }: BadgeProps) {
  const variants = {
    green: outline
      ? 'border border-green-strong text-green-strong bg-transparent'
      : 'bg-green text-on-accent',
    orange: outline
      ? 'border border-orange-strong text-orange-strong bg-transparent'
      : 'bg-orange text-on-accent',
    blue: outline
      ? 'border border-blue-strong text-blue-strong bg-transparent'
      : 'bg-blue text-on-accent',
    red: outline
      ? 'border border-red-strong text-red-strong bg-transparent'
      : 'bg-red text-on-accent',
    primary: outline
      ? 'border border-primary-strong text-primary-strong bg-transparent'
      : 'bg-primary text-on-accent',
    accent: outline
      ? 'border border-accent-strong text-accent-strong bg-transparent'
      : 'bg-accent text-on-accent',
    gray: 'bg-surface-2 text-muted border border-border',
  }

  const sizes = {
    small: 'px-2.5 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}
