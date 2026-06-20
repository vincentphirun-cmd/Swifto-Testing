import React from 'react';

/**
 * Swifto text field. Pairs an optional label + helper/error text with a
 * 48px rounded input that shows a 2px brand focus ring.
 */
export function Input({
  label,
  helper,
  error,
  id,
  type = 'text',
  prefix,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const fieldId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  const field = {
    width: '100%',
    height: 'var(--control-h)',
    padding: prefix ? '0 1rem 0 1.75rem' : '0 1rem',
    borderRadius: 'var(--radius-xl)',
    border: `1px solid ${error ? 'var(--danger-fg)' : 'var(--border-input)'}`,
    background: 'var(--surface-card)',
    color: 'var(--text-strong)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-base)',
    outline: 'none',
    boxShadow: focus ? `0 0 0 var(--ring-width) var(--focus-ring)` : 'none',
    borderColor: focus ? 'transparent' : (error ? 'var(--danger-fg)' : 'var(--border-input)'),
    transition: 'box-shadow var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)',
    ...style,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {label && (
        <label htmlFor={fieldId} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {prefix && (
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 'var(--weight-medium)', pointerEvents: 'none' }}>
            {prefix}
          </span>
        )}
        <input
          id={fieldId}
          type={type}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={field}
          {...rest}
        />
      </div>
      {(helper || error) && (
        <p style={{ fontSize: 'var(--text-xs)', color: error ? 'var(--danger-fg)' : 'var(--text-muted)', margin: 0 }}>
          {error || helper}
        </p>
      )}
    </div>
  );
}
