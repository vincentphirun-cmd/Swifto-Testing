import React from 'react';

/**
 * Swifto Button — the primary call to action across the product.
 * Solid brand-blue by default; darkens to `secondary` on hover.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const sizes = {
    sm: { height: 'var(--control-h-sm)', padding: '0 1.25rem', fontSize: 'var(--text-sm)' },
    md: { height: 'var(--control-h)', padding: '0 2rem', fontSize: 'var(--text-base)' },
    lg: { height: '3.5rem', padding: '0 2.25rem', fontSize: 'var(--text-lg)' },
  };

  const palettes = {
    primary: {
      base: { background: 'var(--btn-primary-bg)', color: 'var(--on-primary)', border: '1px solid transparent' },
      hover: { background: 'var(--btn-primary-bg-hover)' },
    },
    white: {
      base: { background: 'var(--swifto-white)', color: 'var(--swifto-primary)', border: '1px solid transparent' },
      hover: { background: 'var(--swifto-canvas)' },
    },
    outlineWhite: {
      base: { background: 'transparent', color: 'var(--on-primary)', border: '2px solid var(--on-primary)' },
      hover: { background: 'var(--swifto-white)', color: 'var(--swifto-primary)' },
    },
    outline: {
      base: { background: 'transparent', color: 'var(--text-strong)', border: '1px solid var(--border-input)' },
      hover: { background: 'var(--ink-5)', borderColor: 'var(--swifto-primary)', color: 'var(--swifto-primary)' },
    },
    ghost: {
      base: { background: 'transparent', color: 'var(--swifto-primary)', border: '1px solid transparent' },
      hover: { background: 'var(--primary-10)' },
    },
  };

  const p = palettes[variant] || palettes.primary;

  const composed = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: fullWidth ? '100%' : 'auto',
    borderRadius: 'var(--radius-xl)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 'var(--weight-medium)',
    lineHeight: 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)',
    transform: active && !disabled ? 'scale(0.98)' : 'none',
    ...sizes[size],
    ...p.base,
    ...(hover && !disabled ? p.hover : null),
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={composed}
      {...rest}
    >
      {children}
    </button>
  );
}
