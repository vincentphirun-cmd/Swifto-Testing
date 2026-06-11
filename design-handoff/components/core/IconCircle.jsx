import React from 'react';

/**
 * Swifto IconCircle — the recurring "trust" motif: a soft primary/10 disc
 * holding a brand-stroke icon. Pass an SVG/element as `children`.
 */
export function IconCircle({ children, size = 'md', tone = 'brand', style, ...rest }) {
  const sizes = { sm: '2.5rem', md: '3rem', lg: '5rem' };
  const tones = {
    brand: { bg: 'var(--primary-10)', fg: 'var(--swifto-primary)' },
    onBrand: { bg: 'var(--on-primary-20)', fg: 'var(--on-primary)' },
    ink: { bg: 'var(--ink-5)', fg: 'var(--swifto-ink)' },
  };
  const t = tones[tone] || tones.brand;

  return (
    <div
      style={{
        width: sizes[size] ?? sizes.md,
        height: sizes[size] ?? sizes.md,
        flexShrink: 0,
        borderRadius: 'var(--radius-full)',
        background: t.bg,
        color: t.fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
