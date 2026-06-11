import React from 'react';

/**
 * Swifto Card — white surface, hairline ink border, soft shadow, rounded-2xl.
 * Set `interactive` for the signature hover lift (scale + raise + blue border).
 */
export function Card({ children, interactive = false, padding = 'lg', as = 'div', style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const El = as;

  const pads = { none: '0', sm: '1rem', md: '1.25rem', lg: '1.5rem', xl: '2rem' };

  const base = {
    background: 'var(--surface-card)',
    border: '1px solid var(--border-card)',
    borderRadius: 'var(--radius-2xl)',
    boxShadow: 'var(--shadow-sm)',
    padding: pads[padding] ?? pads.lg,
    transition: 'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard)',
    ...(interactive && hover
      ? {
          transform: 'translateY(var(--hover-lift)) scale(var(--hover-scale))',
          boxShadow: 'var(--shadow-xl)',
          borderColor: 'var(--primary-50)',
          cursor: 'pointer',
        }
      : null),
    ...style,
  };

  return (
    <El
      style={base}
      onMouseEnter={interactive ? () => setHover(true) : undefined}
      onMouseLeave={interactive ? () => setHover(false) : undefined}
      {...rest}
    >
      {children}
    </El>
  );
}
