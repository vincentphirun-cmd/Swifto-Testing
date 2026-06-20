/* Swifto redesign — UI primitives (window.UI). Styled via redesign/styles.css vars. */
(function () {
  const { Icon } = window.SW;

  function Button({ children, variant = 'accent', size = 'md', full, onClick, type = 'button', icon, iconRight, style, ...rest }) {
    const [h, setH] = React.useState(false);
    const [d, setD] = React.useState(false);
    const sizes = {
      sm: { height: 40, padding: '0 16px', fontSize: 14 },
      md: { height: 50, padding: '0 22px', fontSize: 15.5 },
      lg: { height: 58, padding: '0 30px', fontSize: 17 },
    };
    const v = {
      accent: { background: h ? 'var(--accent-deep)' : 'var(--accent)', color: '#fff', border: '1px solid transparent', shadow: '0 8px 20px -8px var(--accent)' },
      brand: { background: h ? 'var(--brand-deep)' : 'var(--brand)', color: '#fff', border: '1px solid transparent', shadow: '0 8px 20px -10px var(--brand)' },
      white: { background: h ? '#fff' : 'rgba(255,255,255,0.95)', color: 'var(--brand-deep)', border: '1px solid transparent', shadow: '0 8px 22px -10px rgba(0,0,0,0.4)' },
      outline: { background: h ? 'var(--brand-soft)' : 'transparent', color: 'var(--brand)', border: '1.5px solid color-mix(in srgb, var(--brand) 35%, transparent)', shadow: 'none' },
      outlineWhite: { background: h ? 'rgba(255,255,255,0.14)' : 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.6)', shadow: 'none' },
      ghost: { background: h ? 'var(--brand-soft)' : 'transparent', color: 'var(--brand)', border: '1px solid transparent', shadow: 'none' },
    }[variant];
    return (
      <button type={type} onClick={onClick}
        onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setD(false); }}
        onMouseDown={() => setD(true)} onMouseUp={() => setD(false)}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: full ? '100%' : 'auto', borderRadius: 'var(--r-btn)', fontFamily: 'var(--font-body)',
          fontWeight: 600, lineHeight: 1, cursor: 'pointer', whiteSpace: 'nowrap',
          background: v.background, color: v.color, border: v.border, boxShadow: h ? v.shadow : 'none',
          transform: d ? 'scale(0.97)' : (h ? 'translateY(-1px)' : 'none'),
          transition: 'all 0.18s var(--ease)', ...sizes[size], ...style,
        }} {...rest}>
        {icon && <Icon name={icon} size={size === 'lg' ? 20 : 18} />}
        {children}
        {iconRight && <Icon name={iconRight} size={size === 'lg' ? 20 : 18} />}
      </button>
    );
  }

  function Card({ children, hover, pad = 24, style, onClick, ...rest }) {
    const [h, setH] = React.useState(false);
    return (
      <div onClick={onClick}
        onMouseEnter={hover ? () => setH(true) : undefined}
        onMouseLeave={hover ? () => setH(false) : undefined}
        style={{
          background: 'var(--card)', border: '1px solid var(--line-card)', borderRadius: 'var(--r-lg)',
          boxShadow: h ? 'var(--shadow-lift)' : 'var(--shadow-card)', padding: pad,
          transform: h ? 'translateY(-4px)' : 'none', transition: 'all 0.3s var(--ease)',
          cursor: onClick ? 'pointer' : 'default', ...style,
        }} {...rest}>
        {children}
      </div>
    );
  }

  function Badge({ children, tone = 'brand', style }) {
    const t = {
      brand: { bg: 'var(--brand-soft)', fg: 'var(--brand-deep)' },
      accent: { bg: 'var(--accent-soft)', fg: 'var(--accent-deep)' },
      success: { bg: 'var(--success-soft)', fg: 'var(--success)' },
      warning: { bg: 'var(--warning-soft)', fg: 'var(--warning)' },
      neutral: { bg: 'color-mix(in srgb, var(--ink) 7%, transparent)', fg: 'var(--ink-2)' },
    }[tone];
    return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 'var(--r-pill)', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', background: t.bg, color: t.fg, ...style }}>{children}</span>;
  }

  function IconDisc({ name, size = 52, tone = 'brand', iconSize, style }) {
    const t = {
      brand: { bg: 'var(--brand-soft)', fg: 'var(--brand)' },
      accent: { bg: 'var(--accent-soft)', fg: 'var(--accent-deep)' },
      success: { bg: 'var(--success-soft)', fg: 'var(--success)' },
    }[tone];
    return <span style={{ width: size, height: size, flexShrink: 0, borderRadius: 'var(--r-md)', background: t.bg, color: t.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}><Icon name={name} size={iconSize || Math.round(size * 0.46)} /></span>;
  }

  function Field({ label, prefix, hint, style, inputStyle, ...rest }) {
    const [f, setF] = React.useState(false);
    return (
      <label style={{ display: 'flex', flexDirection: 'column', gap: 7, ...style }}>
        {label && <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)' }}>{label}</span>}
        <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {prefix && <span style={{ position: 'absolute', left: 16, color: 'var(--ink-3)', fontWeight: 600, pointerEvents: 'none' }}>{prefix}</span>}
          <input onFocus={() => setF(true)} onBlur={() => setF(false)}
            style={{ width: '100%', height: 50, padding: prefix ? '0 16px 0 28px' : '0 16px', borderRadius: 'var(--r-btn)',
              border: `1.5px solid ${f ? 'var(--brand)' : 'var(--line)'}`, background: 'var(--card)', color: 'var(--ink)',
              fontFamily: 'var(--font-body)', fontSize: 15.5, outline: 'none',
              boxShadow: f ? '0 0 0 4px color-mix(in srgb, var(--brand) 14%, transparent)' : 'none',
              transition: 'all 0.18s var(--ease)', ...inputStyle }} {...rest} />
        </span>
        {hint && <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{hint}</span>}
      </label>
    );
  }

  function Area({ label, rows = 3, style, ...rest }) {
    const [f, setF] = React.useState(false);
    return (
      <label style={{ display: 'flex', flexDirection: 'column', gap: 7, ...style }}>
        {label && <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)' }}>{label}</span>}
        <textarea rows={rows} onFocus={() => setF(true)} onBlur={() => setF(false)}
          style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--r-btn)', resize: 'none',
            border: `1.5px solid ${f ? 'var(--brand)' : 'var(--line)'}`, background: 'var(--card)', color: 'var(--ink)',
            fontFamily: 'var(--font-body)', fontSize: 15.5, lineHeight: 1.5, outline: 'none',
            boxShadow: f ? '0 0 0 4px color-mix(in srgb, var(--brand) 14%, transparent)' : 'none',
            transition: 'all 0.18s var(--ease)' }} {...rest} />
      </label>
    );
  }

  /* Photo: real image with a branded gradient fallback (and imagery-off support) */
  function Photo({ src, alt = '', radius = 'var(--r-lg)', height, tint = true, style, className = '' }) {
    return (
      <div style={{ position: 'relative', borderRadius: radius, overflow: 'hidden', height, width: '100%', background: 'var(--hero-band)', ...style }}>
        <div className="photo-fallback" style={{ position: 'absolute', inset: 0, background: 'var(--hero-band)' }} />
        <img className={`photo ${className}`} src={src} alt={alt} loading="lazy"
          onError={(e) => { e.target.style.display = 'none'; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        {tint && <div style={{ position: 'absolute', inset: 0, background: 'var(--photo-tint)', mixBlendMode: 'multiply' }} />}
      </div>
    );
  }

  window.UI = { Button, Card, Badge, IconDisc, Field, Area, Photo };
})();
