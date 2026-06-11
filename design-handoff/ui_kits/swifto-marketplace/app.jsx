/* Swifto marketplace — interactive shell tying the screens together. */
function App() {
  const [route, setRoute] = React.useState('home');
  const [authed, setAuthed] = React.useState(false);
  const [role, setRole] = React.useState('student');

  React.useEffect(() => { window.scrollTo(0, 0); }, [route]);

  const navigate = (key) => {
    if ((key === 'dashboard' || key === 'post') && !authed) { setRoute('login'); return; }
    setRoute(key);
  };
  const login = (r) => { setRole(r); setAuthed(true); setRoute('dashboard'); };
  const logout = () => { setAuthed(false); setRoute('home'); };

  let screen;
  if (route === 'browse') screen = <BrowseScreen onNavigate={navigate} />;
  else if (route === 'login') screen = <LoginScreen onLogin={login} />;
  else if (route === 'dashboard') screen = <DashboardScreen onNavigate={navigate} onLogout={logout} />;
  else if (route === 'mission') screen = <MissionScreen onNavigate={navigate} />;
  else screen = <LandingScreen onNavigate={navigate} />;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-page)' }}>
      <SiteNav route={route} onNavigate={navigate} authed={authed} role={role} onLogout={logout} />
      {screen}
    </div>
  );
}

/* Minimal Mission screen — mission-driven prose, reused from product copy. */
function MissionScreen() {
  const wrap = { maxWidth: 'var(--container-prose)', margin: '0 auto', padding: '0 2rem' };
  const { Card } = window.SwiftoDesignSystem_8a726e;
  return (
    <div>
      <section style={{ background: 'var(--surface-brand)', padding: '5rem 0' }}>
        <div style={wrap}><h1 style={{ fontSize: 'var(--text-6xl)', fontWeight: 'var(--weight-bold)', letterSpacing: 'var(--tracking-tight)', color: 'var(--on-primary)' }}>Our Mission</h1></div>
      </section>
      <section style={{ background: 'var(--surface-card)', padding: '4rem 0' }}>
        <div style={wrap}>
          <p style={{ fontSize: 'var(--text-2xl)', lineHeight: 'var(--leading-snug)', color: 'var(--text-body)', marginBottom: '3rem' }}>
            Swifto is built for real life, when money feels tight, time feels short, and asking for help can feel harder than it should.
          </p>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', marginBottom: '1rem' }}>Mission</h2>
          <p style={{ fontSize: 'var(--text-lg)', lineHeight: 'var(--leading-relaxed)', color: 'var(--text-body)', marginBottom: '3rem' }}>
            To reduce financial stress for students by making it simple and safe to earn through flexible local jobs, while giving everyday people a trusted way to get support when they need it.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <Card padding="xl" style={{ background: 'var(--surface-soft)' }}>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', marginBottom: '0.75rem' }}>Students</h3>
              <p style={{ lineHeight: 'var(--leading-relaxed)', color: 'var(--text-body)' }}>A way to earn quickly, flexibly, and safely — so you can focus on your future with a bit more breathing room.</p>
            </Card>
            <Card padding="xl" style={{ background: 'var(--surface-soft)' }}>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)', marginBottom: '0.75rem' }}>Job posters</h3>
              <p style={{ lineHeight: 'var(--leading-relaxed)', color: 'var(--text-body)' }}>Find trusted help for everyday tasks, while knowing you're also supporting students in your local community.</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
window.MissionScreen = MissionScreen;

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
