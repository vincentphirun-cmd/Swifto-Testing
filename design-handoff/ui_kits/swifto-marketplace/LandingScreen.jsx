/* Swifto Landing — hero, trust strip, how-it-works, why-Swifto. */
function LandingScreen({ onNavigate }) {
  const { Button, Card, IconCircle, JobCard } = window.SwiftoDesignSystem_8a726e;
  const { Icon } = window.SwiftoIcons;

  const wrap = { maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 2rem' };

  const previews = [
    { title: 'Lawn mowing', detail: 'Backyard, ~50 sq m', pay: '$45', location: 'Ponsonby, Auckland' },
    { title: 'Moving boxes', detail: '2-bedroom flat', pay: '$120', location: 'Newmarket, Auckland' },
    { title: 'Dog sitting', detail: 'Weekend, 2 dogs', pay: '$80', location: 'Grey Lynn, Auckland' },
  ];
  const trust = [
    { icon: 'shield-check', title: 'Verified users', sub: 'All students are verified' },
    { icon: 'lock', title: 'Secure payments', sub: 'Protected transactions' },
    { icon: 'star', title: 'Ratings & accountability', sub: 'Built-in reviews' },
  ];
  const steps = [
    { n: '1', title: 'Post a job', body: 'Describe your task, set a budget, and post it to the Swifto community.' },
    { n: '2', title: 'Choose a student', body: 'Review profiles and proposals from verified students in your area.' },
    { n: '3', title: 'Confirm — payment released', body: 'Once you confirm the work is done, payment is automatically released.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'var(--surface-brand)', padding: '5rem 0' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h1 style={{ fontSize: 'var(--text-6xl)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-tight)', lineHeight: 1.05, color: 'var(--on-primary)' }}>
              Get trusted help fast — from verified students.
            </h1>
            <p style={{ fontSize: 'var(--text-lg)', lineHeight: 'var(--leading-relaxed)', color: 'var(--on-primary-90)', maxWidth: '34ch' }}>
              Post a task in minutes. Pay securely. Confirm when it's done.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button variant="white" size="lg" onClick={() => onNavigate('login')}>Post a job</Button>
              <Button variant="outlineWhite" size="lg" onClick={() => onNavigate('browse')}>Find jobs</Button>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--on-primary-90)' }}>Verified users · Secure payments · Ratings</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {previews.map((p) => <JobCard key={p.title} {...p} onClick={() => onNavigate('browse')} />)}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section style={{ background: 'var(--surface-card)', padding: '3rem 0' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {trust.map((t) => (
            <div key={t.title} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <IconCircle><Icon name={t.icon} /></IconCircle>
              <div>
                <h3 style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{t.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '5rem 0' }}>
        <div style={wrap}>
          <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', textAlign: 'center', marginBottom: '3rem' }}>How it works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {steps.map((s) => (
              <Card key={s.n} padding="xl" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-xl)', background: 'var(--swifto-primary)', color: 'var(--on-primary)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.n}</div>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{s.title}</h3>
                <p style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)', color: 'var(--text-body)' }}>{s.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Swifto band */}
      <section style={{ background: 'var(--surface-brand)', padding: '4rem 0' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem', alignItems: 'center' }}>
          <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--weight-bold)', color: 'var(--on-primary)' }}>Why Swifto</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              ['Trust who you hire', 'Every profile is verified, so you can book with confidence.'],
              ['Get it sorted fast', 'Post once, pick the right student, and confirm without back and forth.'],
              ['Know the price upfront', 'Clear costs before you commit, with no surprises.'],
              ['Protected payments', 'Held securely and released only when the job is confirmed complete.'],
            ].map(([t, b]) => (
              <div key={t} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0, width: '1.5rem', height: '1.5rem', borderRadius: 'var(--radius-full)', background: 'var(--on-primary-20)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.25rem' }}>
                  <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: 'var(--radius-full)', background: 'var(--on-primary)' }} />
                </span>
                <div>
                  <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)', color: 'var(--on-primary)', marginBottom: '0.25rem' }}>{t}</h3>
                  <p style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)', color: 'var(--on-primary-90)' }}>{b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: 'var(--surface-ink)', padding: '5rem 0' }}>
        <div style={{ ...wrap, textAlign: 'center' }}>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-semibold)', color: 'var(--on-primary)', marginBottom: '2rem' }}>Ready to get something done today?</h2>
          <Button size="lg" onClick={() => onNavigate('login')}>Post a job</Button>
        </div>
      </section>

      <footer style={{ background: 'var(--surface-page)', padding: '2.5rem 0' }}>
        <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: 'var(--text-sm)' }}>
            <span style={{ color: 'var(--text-strong)' }}>Safety</span>
            <span style={{ color: 'var(--text-strong)' }}>Contact</span>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>© Swifto</p>
        </div>
      </footer>
    </div>
  );
}
window.LandingScreen = LandingScreen;
