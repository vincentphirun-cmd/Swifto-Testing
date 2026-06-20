/* Swifto redesign — Login / sign up (window.Login) + Mission (window.Mission) */
function Login({ onLogin }) {
  const { Button, Field, Photo, Badge } = window.UI;
  const { Icon, Stars } = window.SW;
  const D = window.DATA;
  const [mode, setMode] = React.useState('login');

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', padding: '40px 24px 72px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', minHeight: '74vh' }}>
      {/* form */}
      <div style={{ maxWidth: 400, width: '100%', justifySelf: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 28 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>Swifto</span>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--accent)', marginLeft: 3 }} />
        </div>
        <h1 style={{ fontSize: 34 }}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p style={{ fontSize: 16, color: 'var(--ink-2)', marginTop: 8 }}>{mode === 'login' ? 'Log in to pick up where you left off.' : 'Join Swifto in under a minute — it\u2019s free.'}</p>

        {/* role toggle for signup */}
        {mode === 'signup' && (
          <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
            {[['student', 'I want to earn'], ['lister', 'I need a hand']].map(([r, l], i) => (
              <button key={r} onClick={() => setMode('signup-' + r)} style={{ flex: 1, padding: '14px', borderRadius: 'var(--r-md)', cursor: 'pointer', border: '1.5px solid var(--line)', background: 'var(--card)', fontFamily: 'var(--font-body)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>{l}</button>
            ))}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); onLogin('student'); }} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
          {mode === 'signup' && <Field label="Full name" placeholder="Jordan Williams" defaultValue="" />}
          <Field label="Email address" type="email" defaultValue="mia@student.ac.nz" />
          <Field label="Password" type="password" defaultValue="password" />
          <Button full size="lg" type="submit">{mode === 'login' ? 'Log in' : 'Create account'}</Button>
        </form>
        <p style={{ fontSize: 14.5, color: 'var(--ink-2)', marginTop: 18, textAlign: 'center' }}>
          {mode === 'login' ? "New to Swifto? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-deep)', fontWeight: 700, fontFamily: 'var(--font-body)', fontSize: 14.5 }}>{mode === 'login' ? 'Create an account' : 'Log in'}</button>
        </p>
      </div>

      {/* visual side */}
      <div style={{ position: 'relative' }}>
        <Photo src={D.photos.heroSecond} height={480} radius="var(--r-xl)" alt="Students" style={{ boxShadow: 'var(--shadow-pop)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'var(--r-xl)', background: 'linear-gradient(180deg, transparent 40%, color-mix(in srgb, var(--ink) 72%, transparent))' }} />
        <div style={{ position: 'absolute', bottom: 28, left: 28, right: 28, color: '#fff' }}>
          <Stars value={5} size={18} />
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginTop: 10, lineHeight: 1.3 }}>"Swifto helped me cover rent without dropping a single class."</p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 8 }}>— Aroha, second-year student</p>
        </div>
      </div>
    </div>
  );
}
window.Login = Login;

function Mission({ go }) {
  const { Button, Card, Badge, IconDisc, Photo } = window.UI;
  const wrap = { maxWidth: 880, margin: '0 auto', padding: '0 24px' };
  const beliefs = [
    'People should be able to ask for help without feeling awkward or unsafe.',
    'Students deserve a way to earn that doesn\u2019t punish them for being busy.',
    'Small jobs can create real stability and breathing room.',
    'Trust and dignity matter for everyone involved.',
  ];
  return (
    <div>
      <section style={{ background: 'var(--hero-band)', color: '#fff' }}>
        <div style={{ ...wrap, padding: '72px 24px', textAlign: 'center' }}>
          <Badge tone="accent" style={{ background: 'rgba(255,255,255,0.16)', color: '#fff', marginBottom: 18 }}>Our mission</Badge>
          <h1 style={{ color: '#fff', fontSize: 'clamp(34px, 5vw, 56px)', lineHeight: 1.05 }}>Make the week feel<br />a little lighter.</h1>
          <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.88)', maxWidth: 560, margin: '20px auto 0', lineHeight: 1.6 }}>
            To reduce financial stress for students by making it simple and safe to earn through flexible local jobs — while giving everyday people a trusted way to get support when they need it.
          </p>
        </div>
      </section>

      <section style={{ ...wrap, padding: '64px 24px' }}>
        <h2 style={{ fontSize: 30, marginBottom: 10 }}>Why we exist</h2>
        <p style={{ fontSize: 17, color: 'var(--ink-2)', lineHeight: 1.7 }}>
          Being a student can feel like carrying two lives at once — study on one side, bills on the other. Swifto exists so students have a way to earn that fits around life, not the other way around. And for the people who need a hand, it makes asking for help feel safe, respectful, and simple.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 40 }}>
          <Card style={{ background: 'var(--brand-soft)' }}>
            <IconDisc name="users" tone="brand" />
            <h3 style={{ fontSize: 22, marginTop: 16 }}>For students</h3>
            <p style={{ fontSize: 15, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.6 }}>Earn quickly, flexibly and safely — so you can focus on your future with a bit more breathing room.</p>
          </Card>
          <Card style={{ background: 'var(--accent-soft)' }}>
            <IconDisc name="heart" tone="accent" />
            <h3 style={{ fontSize: 22, marginTop: 16 }}>For job posters</h3>
            <p style={{ fontSize: 15, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.6 }}>Find trusted help for everyday tasks, while knowing you\u2019re supporting students in your community.</p>
          </Card>
        </div>

        <h2 style={{ fontSize: 30, marginTop: 56, marginBottom: 18 }}>What we believe</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {beliefs.map((b) => (
            <div key={b} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, marginTop: 2, color: 'var(--success)' }}><window.SW.Icon name="check-circle" size={22} /></span>
              <p style={{ fontSize: 16.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>{b}</p>
            </div>
          ))}
        </div>

        <Card style={{ marginTop: 48, textAlign: 'center', background: 'var(--ink)', padding: 44 }}>
          <h2 style={{ color: '#fff', fontSize: 30 }}>Ready to lighten the load?</h2>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 22, flexWrap: 'wrap' }}>
            <Button size="lg" onClick={() => go('login')}>Join Swifto</Button>
            <Button size="lg" variant="outlineWhite" onClick={() => go('browse')}>Find work</Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
window.Mission = Mission;
