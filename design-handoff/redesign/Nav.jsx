/* Swifto redesign — top navigation (window.Nav) */
function Nav({ route, go, authed, role, logout }) {
  const { Button } = window.UI;
  const link = (key, label) => (
    <button onClick={() => go(key)} style={{
      background: 'none', border: 'none', cursor: 'pointer', padding: '6px 2px',
      fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: route === key ? 700 : 500,
      color: route === key ? 'var(--ink)' : 'var(--ink-2)', position: 'relative', whiteSpace: 'nowrap',
    }}>
      {label}
      {route === key && <span style={{ position: 'absolute', left: 2, right: 2, bottom: -2, height: 2.5, borderRadius: 2, background: 'var(--accent)' }} />}
    </button>
  );
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'color-mix(in srgb, var(--paper) 82%, transparent)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line)' }}>
      <nav style={{ maxWidth: 1160, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <button onClick={() => go('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 27, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--ink)' }}>Swifto</span>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--accent)', marginLeft: 3, display: 'inline-block' }} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            {link('home', 'Home')}
            {link('browse', 'Find work')}
            {link('mission', 'Our mission')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {authed ? (
              <>
                {link('dashboard', 'Dashboard')}
                <Button size="sm" variant="ghost" onClick={logout}>Log out</Button>
                <Button size="sm" onClick={() => go(role === 'lister' ? 'browse' : 'browse')}>{role === 'lister' ? 'Post a job' : 'Find work'}</Button>
              </>
            ) : (
              <>
                {link('login', 'Log in')}
                <Button size="sm" onClick={() => go('login')}>Get started</Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
window.Nav = Nav;
