import React from 'react';

/**
 * Swifto Modal — centered dialog over a blurred dark scrim. On small screens
 * it becomes a bottom sheet (rounded top corners). Matches the apply/withdraw
 * modals.
 */
export function Modal({ open = true, onClose, title, subtitle, children, footer, width = 'md' }) {
  React.useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && onClose) onClose(); }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: '28rem', md: '36rem', lg: '42rem' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: widths[width] ?? widths.md,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-2xl)',
          padding: '1.75rem',
        }}
      >
        {(title || onClose) && (
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: subtitle ? '1.25rem' : '1rem' }}>
            <div>
              {title && <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>{title}</h2>}
              {subtitle && <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{subtitle}</p>}
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                style={{ width: '2.5rem', height: '2.5rem', flexShrink: 0, borderRadius: 'var(--radius-full)', border: 'none', background: 'var(--ink-5)', color: 'var(--text-strong)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        )}
        <div>{children}</div>
        {footer && <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-divider)', display: 'flex', gap: '0.75rem' }}>{footer}</div>}
      </div>
    </div>
  );
}
