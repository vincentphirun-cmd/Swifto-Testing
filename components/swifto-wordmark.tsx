import Link from 'next/link'

type Props = {
  className?: string
  asLink?: boolean
  light?: boolean
}

export function SwiftoWordmark({ className = '', asLink = true }: Props) {
  const inner = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/swifto-logo.png"
      alt="Swifto"
      className={`h-8 md:h-10 w-auto max-w-[min(100%,220px)] object-contain object-left ${className}`}
    />
  )

  if (asLink) {
    return (
      <Link href="/" className="shrink-0 inline-flex items-center" aria-label="Swifto home">
        {inner}
      </Link>
    )
  }

  return <span className="inline-flex items-center shrink-0">{inner}</span>
}
