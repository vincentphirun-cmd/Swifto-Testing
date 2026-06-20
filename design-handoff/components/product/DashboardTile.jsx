import React from 'react';
import { Card } from '../core/Card.jsx';
import { IconCircle } from '../core/IconCircle.jsx';

/**
 * Swifto DashboardTile — the square, centered navigation tile used on the
 * student/lister dashboards. Large icon disc over a title + caption.
 */
export function DashboardTile({ icon, title, caption, highlight, onClick, square = true, style, ...rest }) {
  return (
    <Card
      interactive={!!onClick}
      onClick={onClick}
      style={{
        aspectRatio: square ? '1 / 1' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        textAlign: 'center',
        ...style,
      }}
      {...rest}
    >
      <IconCircle size="lg">{icon}</IconCircle>
      <div>
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{title}</h3>
        {highlight && <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--swifto-primary)', marginTop: '0.25rem' }}>{highlight}</p>}
        {caption && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{caption}</p>}
      </div>
    </Card>
  );
}
