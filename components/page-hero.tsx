import Link from 'next/link'
import { HeroBand } from '@/components/hero-band'

type Props = {
  title: string
  subtitle?: string
  backHref?: string
  backLabel?: string
  centered?: boolean
}

export function PageHero({ title, subtitle, backHref, backLabel = 'Back', centered = false }: Props) {
  return (
    <HeroBand compact>
      <div className={`mx-auto w-full max-w-6xl px-4 md:px-8 ${centered ? 'text-center' : ''}`}>
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {backLabel}
          </Link>
        )}
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-white/85 mt-2 text-lg max-w-2xl">{subtitle}</p>}
      </div>
    </HeroBand>
  )
}
