import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'orange' | 'blue'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none'
  
  const variants = {
    primary: 'bg-primary text-on-accent hover:bg-primary-strong hover:-translate-y-px active:translate-y-0 shadow-glow',
    secondary: 'bg-surface-2 text-text border border-border hover:border-border-strong hover:-translate-y-px active:translate-y-0',
    ghost: 'bg-transparent text-muted hover:text-text hover:bg-surface-2',
    danger: 'bg-red text-on-accent hover:bg-red-strong hover:-translate-y-px active:translate-y-0',
    orange: 'bg-orange text-on-accent hover:bg-orange-strong hover:-translate-y-px active:translate-y-0',
    blue: 'bg-blue text-on-accent hover:bg-blue-strong hover:-translate-y-px active:translate-y-0',
  }
  
  const sizes = {
    small: 'h-9 px-4 text-sm',
    medium: 'h-11 px-5 text-base',
    large: 'h-[52px] px-6 text-lg',
  }
  
  const focusRing = 'focus-visible:ring focus-visible:ring-primary-strong focus-visible:ring-opacity-30 focus-visible:ring-offset-2'
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${focusRing} rounded-3xl flex items-center justify-center gap-2 ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}
