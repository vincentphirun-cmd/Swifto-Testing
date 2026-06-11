import React from 'react';

/**
 * Swifto Badge — a small rounded-full pill for statuses and tags.
 * Tones map to the product: success (Applied), warning (Urgent rebook),
 * neutral, brand, and danger.
 */
export function Badge({ children, tone = 'neutral', solid = false, style, ...rest }) {
  const tones = {
    neutral: { bg: 'var(--ink-5)', fg: 'var(--text-body)', border: 'transparent' },
    brand: { bg: 'var(--primary-10)', fg: 'var(--swifto-primary)', border: 'transparent' },
    success: { bg: 'var(--success-bg)', fg: 'var(--success-fg)', border: 'var(--success-border)' },
    warning: { bg: 'var(--warning-bg)', fg: 'var(--warning-fg)', border: 'transparent' },
    danger: { bg: 'var(--danger-bg)', fg: 'var(--danger-fg)', border: 'var(--danger-border)' },
  };
  const t = tones[tone] || tones.neutral;

  const composed = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.2rem 0.625rem',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-xs)',
    fontWeight: 'var(--weight-semibold)',
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
    background: solid ? t.fg : t.bg,
    color: solid ? '#fff' : t.fg,
    border: solid ? '1px solid transparent' : `1px solid ${t.border}`,
    ...style,
  };

  return <span style={composed} {...rest}>{children}</span>;
}
