import React from 'react';

/**
 * Swifto select. A native <select> styled to match Input, with a brand
 * chevron. Options are passed as { value, label } objects or children.
 */
export function Select({ label, helper, options, id, value, onChange, placeholder, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const fieldId = id || (label ? `sel-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  const field = {
    width: '100%',
    height: 'var(--control-h)',
    padding: '0 2.75rem 0 1rem',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--border-input)',
    background: 'var(--surface-card)',
    color: 'var(--text-strong)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-base)',
    appearance: 'none',
    WebkitAppearance: 'none',
    outline: 'none',
    cursor: 'pointer',
    boxShadow: focus ? `0 0 0 var(--ring-width) var(--focus-ring)` : 'none',
    borderColor: focus ? 'transparent' : 'var(--border-input)',
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
        <select id={fieldId} value={value} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={field} {...rest}>
          {placeholder && <option value="">{placeholder}</option>}
          {(options || []).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {helper && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>{helper}</p>}
    </div>
  );
}
