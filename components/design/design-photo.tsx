type Props = {
  src: string
  alt?: string
  height?: number
  className?: string
  radius?: string
  tint?: boolean
  priority?: boolean
}

export function DesignPhoto({
  src,
  alt = '',
  height,
  className = '',
  radius = 'rounded-3xl',
  tint = true,
  priority,
}: Props) {
  return (
    <div
      className={`relative overflow-hidden bg-hero-band w-full ${radius} ${className}`}
      style={height ? { height } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        className="w-full h-full object-cover block"
        style={height ? { height: '100%' } : undefined}
      />
      {tint && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-multiply"
          style={{ background: 'var(--photo-tint)' }}
          aria-hidden
        />
      )}
    </div>
  )
}
