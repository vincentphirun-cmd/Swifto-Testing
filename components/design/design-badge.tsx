import type { ReactNode } from 'react'

type Tone = 'brand' | 'accent' | 'success' | 'warning' | 'neutral' | 'white'

const tones: Record<Tone, string> = {
  brand: 'bg-brand-soft text-brand-deep',
  accent: 'bg-primary-soft text-accent-deep',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  neutral: 'bg-ink/[0.07] text-ink-2',
  white: 'bg-white/15 text-white',
}

type Props = {
  children: ReactNode
  tone?: Tone
  className?: string
}

export function DesignBadge({ children, tone = 'brand', className = '' }: Props) {
  return (
    <span className={`swifto-badge ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}
