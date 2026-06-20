import React from 'react';

/**
 * Swifto multi-line text field. Same chrome as Input, taller and non-resizing
 * by default (matches the application-form textareas).
 */
export function Textarea({ label, helper, error, id, rows = 4, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const fieldId = id || (label ? `ta-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  const field = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-xl)',
    border: `1px solid ${error ? 'var(--danger-fg)' : 'var(--border-input)'}`,
    background: 'var(--surface-card)',
    color: 'var(--text-strong)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-base)',
    lineHeight: 'var(--leading-normal)',
    resize: 'none',
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
      <textarea id={fieldId} rows={rows} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={field} {...rest} />
      {(helper || error) && (
        <p style={{ fontSize: 'var(--text-xs)', color: error ? 'var(--danger-fg)' : 'var(--text-muted)', margin: 0 }}>
          {error || helper}
        </p>
      )}
    </div>
  );
}
