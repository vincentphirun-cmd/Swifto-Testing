import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  compact?: boolean
}

/** Navy→blue gradient band (redesign hero-band). */
export function HeroBand({ children, className = '', compact = false }: Props) {
  return (
    <section
      className={`bg-hero-band text-white ${compact ? 'py-10 md:py-12' : 'py-14 md:py-20'} ${className}`}
    >
      {children}
    </section>
  )
}
