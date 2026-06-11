import React from 'react';

/**
 * Swifto checkbox. A custom-drawn box (brand-blue when checked) with an
 * adjacent label, matching the "Flexible (no specific deadline)" control.
 */
export function Checkbox({ label, checked = false, onChange, disabled = false, id, style }) {
  const fieldId = id || (label ? `cb-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  const box = {
    width: '1.25rem',
    height: '1.25rem',
    flexShrink: 0,
    borderRadius: '0.375rem',
    border: checked ? '1px solid var(--swifto-primary)' : '1px solid var(--border-input)',
    background: checked ? 'var(--swifto-primary)' : 'var(--surface-card)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)',
  };

  return (
    <label
      htmlFor={fieldId}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      <input
        id={fieldId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked, e)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <span style={box} aria-hidden="true">
        {checked && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--on-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </span>
      {label && <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-strong)' }}>{label}</span>}
    </label>
  );
}
