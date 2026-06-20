import React from 'react';

/**
 * Swifto StarRating. Read-only display by default; pass `onChange` to make it
 * an interactive input. Stars fill brand-blue; empties are ink/20.
 */
export function StarRating({ value = 0, max = 5, onChange, size = 'md', showValue = false, reviewCount, style }) {
  const [hover, setHover] = React.useState(0);
  const interactive = typeof onChange === 'function';
  const px = { sm: 20, md: 32, lg: 40 }[size] ?? 32;
  const shown = interactive && hover ? hover : value;

  const Star = ({ filled }) => (
    <svg width={px} height={px} viewBox="0 0 24 24" fill={filled ? 'var(--swifto-primary)' : 'var(--ink-20)'} aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center', ...style }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: interactive ? '0.25rem' : '0.125rem' }} role={interactive ? 'group' : 'img'} aria-label={`${value} out of ${max}`}>
        {Array.from({ length: max }, (_, i) => i + 1).map((star) =>
          interactive ? (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{ padding: '0.25rem', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-lg)', lineHeight: 0 }}
              aria-label={`${star} star${star === 1 ? '' : 's'}`}
            >
              <Star filled={star <= shown} />
            </button>
          ) : (
            <Star key={star} filled={star <= Math.round(shown)} />
          )
        )}
      </div>
      {showValue && (
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          {reviewCount === 0 ? 'No reviews yet' : `${Number(value).toFixed(1)}${reviewCount != null ? ` · ${reviewCount} review${reviewCount === 1 ? '' : 's'}` : ''}`}
        </span>
      )}
    </div>
  );
}
