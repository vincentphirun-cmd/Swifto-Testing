import React from 'react';

/**
 * Swifto Avatar — circular user mark. Shows an image when `src` is given,
 * otherwise the person's initials on a primary/10 disc.
 */
export function Avatar({ name = '', src, size = 'md', style, ...rest }) {
  const sizes = { xs: '1.75rem', sm: '2.25rem', md: '3rem', lg: '4rem' };
  const fontSizes = { xs: '0.7rem', sm: '0.8rem', md: '1rem', lg: '1.25rem' };
  const dim = sizes[size] ?? sizes.md;

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

  const base = {
    width: dim,
    height: dim,
    flexShrink: 0,
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--primary-10)',
    color: 'var(--swifto-primary)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 'var(--weight-semibold)',
    fontSize: fontSizes[size] ?? fontSizes.md,
    ...style,
  };

  return (
    <div style={base} {...rest}>
      {src ? (
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        initials || (
          <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      )}
    </div>
  );
}
