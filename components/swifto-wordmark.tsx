import Link from 'next/link'

type Props = {
  className?: string
  asLink?: boolean
  light?: boolean
}

export function SwiftoWordmark({ className = '', asLink = true, light = false }: Props) {
  const inner = (
    <span className={`inline-flex items-baseline gap-0.5 ${className}`}>
      <span className={`font-display text-[1.65rem] md:text-[1.7rem] font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
        Swifto
      </span>
      <span className="inline-block w-2 h-2 rounded-full bg-primary mb-1" aria-hidden />
    </span>
  )

  if (asLink) {
    return (
      <Link href="/" className="shrink-0">
        {inner}
      </Link>
    )
  }

  return inner
}
