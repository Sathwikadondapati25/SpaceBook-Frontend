interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'small' | 'medium' | 'large'
}

export default function Card({ children, className = '', padding = 'medium' }: CardProps) {
  const paddings = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  }
  
  return (
    <div className={`bg-surface rounded-2xl border border-border shadow-subtle ${paddings[padding]} ${className}`}>
      {children}
    </div>
  )
}
