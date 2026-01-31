'use client'

type Props = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'light'
}

const sizeClasses = {
  sm: 'w-6 h-6 border-2',
  md: 'w-10 h-10 border-2',
  lg: 'w-14 h-14 border-[3px]',
}

const variantClasses = {
  default: 'border-primary border-t-transparent',
  light: 'border-white/80 border-t-transparent',
}

export function LoadingSpinner({ className = '', size = 'md', variant = 'default' }: Props) {
  return (
    <div
      className={`animate-spin rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}
