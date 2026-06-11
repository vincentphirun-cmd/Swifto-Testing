import React from 'react';
import { Card } from '../core/Card.jsx';
import { Badge } from '../core/Badge.jsx';

/**
 * Swifto JobCard — the emblematic job listing tile. Title + detail, pay in
 * brand-blue, and a map-pin location row. Lifts on hover like every Card.
 */
export function JobCard({ title, detail, pay, location, urgent = false, applied = false, onClick, actions, style }) {
  return (
    <Card interactive={!!onClick} onClick={onClick} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '7.5rem', ...style }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{title}</h3>
            {urgent && <Badge tone="warning">Urgent rebook</Badge>}
            {applied && <Badge tone="success">Applied</Badge>}
          </div>
          {detail && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{detail}</p>}
        </div>
        <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--swifto-primary)', whiteSpace: 'nowrap' }}>{pay}</span>
      </div>
      {location && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{location}</span>
        </div>
      )}
      {actions && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid var(--border-divider)' }}>
          {actions}
        </div>
      )}
    </Card>
  );
}
