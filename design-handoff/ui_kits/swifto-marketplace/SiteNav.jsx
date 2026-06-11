/* Swifto SiteNav — sticky top bar with wordmark, links, and auth actions. */
function SiteNav({ route, onNavigate, authed, role, onLogout }) {
  const { Button } = window.SwiftoDesignSystem_8a726e;
  const [menuOpen, setMenuOpen] = React.useState(false);

  const link = (key, label) => (
    <button
      onClick={() => { onNavigate(key); setMenuOpen(false); }}
      style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
        color: route === key ? 'var(--swifto-primary)' : 'var(--text-strong)',
        fontWeight: route === key ? 'var(--weight-semibold)' : 'var(--weight-regular)',
      }}
    >
      {label}
    </button>
  );

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'var(--surface-card)', borderBottom: '1px solid var(--border-divider)' }}>
      <nav style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <button onClick={() => onNavigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--swifto-ink)', letterSpacing: '-0.02em', padding: 0 }}>
          Swifto
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {link('home', 'Home')}
          {link('mission', 'Our Mission')}
          {link('browse', 'Browse')}
          {authed ? (
            <>
              {link('dashboard', 'Dashboard')}
              {role === 'lister'
                ? <Button size="sm" onClick={() => onNavigate('post')}>Post a Job</Button>
                : <Button size="sm" onClick={() => onNavigate('browse')}>Find a Job</Button>}
              <Button size="sm" variant="outline" onClick={onLogout}>Log out</Button>
            </>
          ) : (
            <>
              {link('login', 'Log in')}
              <Button size="sm" onClick={() => onNavigate('login')}>Sign up</Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
window.SiteNav = SiteNav;
