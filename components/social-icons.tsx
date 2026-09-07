const iconClass = 'w-5 h-5'

export function FacebookIcon() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
      />
    </svg>
  )
}

export function InstagramIcon() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth={1.75} />
      <circle cx="12" cy="12" r="4" strokeWidth={1.75} />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function XIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.792 10.248 20.64 2h-1.623l-5.945 7.16L8.32 2H2.5l7.18 10.86L2.5 22h1.623l6.278-7.56L15.68 22H21.5l-7.708-11.752Zm-2.222 2.676-.727-1.08-5.79-8.6h2.492l4.673 6.94.727 1.08 6.07 9.014h-2.492l-4.953-7.354Z" />
    </svg>
  )
}

export function LinkedInIcon() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.75} />
      <path strokeLinecap="round" strokeWidth={1.75} d="M8 10v7M8 7.5v.01M12 17v-4.5a2.5 2.5 0 015 0V17" />
    </svg>
  )
}
