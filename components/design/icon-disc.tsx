import type { ReactNode } from 'react'

type Tone = 'brand' | 'accent' | 'success'

const tones: Record<Tone, string> = {
  brand: 'bg-brand-soft text-brand',
  accent: 'bg-primary-soft text-accent-deep',
  success: 'bg-success-soft text-success',
}

type Props = {
  children: ReactNode
  tone?: Tone
  size?: number
  className?: string
}

export function IconDisc({ children, tone = 'brand', size = 52, className = '' }: Props) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl ${tones[tone]} ${className}`}
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  )
}
