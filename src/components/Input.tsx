import { useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helper?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
}

export default function Input({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  className = '',
  type = 'text',
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type
  
  const baseStyles = 'w-full h-12 px-4 rounded-xl border border-border-strong bg-surface text-text placeholder-muted transition-all duration-200'
  const focusStyles = 'focus:outline-none focus:ring-2 focus:ring-primary-strong focus:ring-opacity-30 focus:border-primary-strong'
  const errorStyles = error ? 'border-red-strong focus:ring-red-strong' : 'hover:border-border'
  const disabledStyles = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-text">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          type={inputType}
          className={`${baseStyles} ${focusStyles} ${errorStyles} ${disabledStyles} ${leftIcon ? 'pl-12' : ''} ${rightIcon || showPasswordToggle ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        {rightIcon && !showPasswordToggle && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1.5 text-sm text-red-strong">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {helper && !error && (
        <span className="text-sm text-muted">{helper}</span>
      )}
    </div>
  )
}
