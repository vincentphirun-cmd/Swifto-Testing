/* Swifto redesign — Landing (window.Landing) */
function Landing({ go }) {
  const { Button, Card, Badge, IconDisc, Photo } = window.UI;
  const { Icon, Stars } = window.SW;
  const D = window.DATA;
  const wrap = { maxWidth: 1160, margin: '0 auto', padding: '0 24px' };

  const trust = [
    { icon: 'shield-check', title: 'Verified students', body: 'Every student is ID-checked before they can apply.' },
    { icon: 'lock', title: 'Money held safely', body: 'We hold payment and release it only when you confirm.' },
    { icon: 'heart', title: 'Real accountability', body: 'Honest ratings and reviews on both sides, every time.' },
  ];
  const steps = [
    { n: '01', icon: 'plus', title: 'Post your task', body: 'Tell us what you need and what it pays. Takes about a minute.' },
    { n: '02', icon: 'users', title: 'Pick a student', body: 'Browse verified students nearby and choose who feels right.' },
    { n: '03', icon: 'check-circle', title: 'Confirm & pay', body: 'Approve the finished work and payment releases automatically.' },
  ];

  return (
    <div>
      {/* ===== HERO ===== */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center', padding: '72px 24px 84px' }}>
          {/* Left */}
          <div>
            <Badge tone="accent" style={{ marginBottom: 22 }}><Icon name="map-pin" size={14} /> Made for students in Aotearoa</Badge>
            <h1 style={{ fontSize: 'clamp(40px, 5.4vw, 66px)', lineHeight: 1.02 }}>
              A little help today,<br />a lot less stress<br />
              <span style={{ color: 'var(--accent)' }}>this week.</span>
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.6, color: 'var(--ink-2)', maxWidth: 460, marginTop: 22 }}>
              Swifto connects everyday tasks with verified local students. Post a job in minutes, pay securely, and confirm when it's done.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap' }}>
              <Button size="lg" onClick={() => go('login')} iconRight="arrow-right">Post a job</Button>
              <Button size="lg" variant="outline" onClick={() => go('browse')}>Find work</Button>
            </div>
            {/* social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 34 }}>
              <div style={{ display: 'flex' }}>
                {[D.photos.avatar1, D.photos.avatar2, D.photos.avatar3, D.photos.avatar4].map((a, i) => (
                  <span key={i} style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '2.5px solid var(--paper)', marginLeft: i ? -12 : 0, background: 'var(--brand-soft)' }}>
                    <Photo src={a} radius="50%" tint={false} style={{ height: '100%' }} />
                  </span>
                ))}
              </div>
              <div>
                <Stars value={5} size={15} />
                <p style={{ fontSize: 13.5, color: 'var(--ink-2)', marginTop: 2 }}><b style={{ color: 'var(--ink)' }}>2,400+ jobs</b> done across Auckland</p>
              </div>
            </div>
          </div>

          {/* Right — photo with floating cards */}
          <div style={{ position: 'relative' }}>
            <Photo src={D.photos.hero} height={460} radius="var(--r-xl)" alt="Students helping out" style={{ boxShadow: 'var(--shadow-pop)' }} />
            {/* floating job card */}
            <Card pad={16} style={{ position: 'absolute', left: -26, bottom: 40, width: 246, boxShadow: 'var(--shadow-pop)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15 }}>Lawn mowing</p>
                  <p style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>Ponsonby · 2 hrs</p>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent)', fontSize: 20 }}>$45</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line-card)' }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', overflow: 'hidden' }}><Photo src={D.photos.avatar2} radius="50%" tint={false} style={{ height: '100%' }} /></span>
                <span style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>Mia applied · <b style={{ color: 'var(--success)' }}>verified</b></span>
              </div>
            </Card>
            {/* floating earnings chip */}
            <Card pad={14} style={{ position: 'absolute', right: -18, top: 30, display: 'flex', alignItems: 'center', gap: 11, boxShadow: 'var(--shadow-pop)' }}>
              <IconDisc name="wallet" tone="success" size={40} />
              <div>
                <p style={{ fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 600 }}>Paid out this week</p>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}>$184.50</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section style={{ ...wrap, paddingBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {trust.map((t) => (
            <Card key={t.title} hover style={{ display: 'flex', gap: 15, alignItems: 'flex-start' }}>
              <IconDisc name={t.icon} tone="brand" />
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>{t.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 5, lineHeight: 1.5 }}>{t.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{ ...wrap, padding: '72px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <Badge tone="brand" style={{ marginBottom: 14 }}>How it works</Badge>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 44px)' }}>Sorted in three simple steps</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {steps.map((s, i) => (
            <Card key={s.n} pad={28} style={{ position: 'relative', overflow: 'hidden' }}>
              <span style={{ position: 'absolute', top: 16, right: 20, fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 800, color: 'color-mix(in srgb, var(--brand) 9%, transparent)', lineHeight: 1 }}>{s.n}</span>
              <IconDisc name={s.icon} tone={i === 2 ? 'success' : 'accent'} size={56} />
              <h3 style={{ fontSize: 21, fontWeight: 700, marginTop: 18 }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.6 }}>{s.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== LIVED EXPERIENCE BAND ===== */}
      <section style={{ background: 'var(--hero-band)', color: 'var(--on-band)' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 56, alignItems: 'center', padding: '72px 24px' }}>
          <Photo src={D.photos.community} height={380} radius="var(--r-xl)" alt="Local community" style={{ boxShadow: 'var(--shadow-pop)' }} />
          <div>
            <Badge tone="accent" style={{ marginBottom: 18, background: 'rgba(255,255,255,0.16)', color: '#fff' }}>Why we built Swifto</Badge>
            <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 3.6vw, 40px)', lineHeight: 1.1 }}>We know what carrying money stress feels like.</h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.88)', marginTop: 18, maxWidth: 520 }}>
              Swifto was built from lived experience — so students can earn in a way that fits around study, and people who need a hand can find trusted, friendly help nearby. A way to make the week feel a little lighter.
            </p>
            <Button variant="white" size="lg" style={{ marginTop: 26 }} onClick={() => go('mission')} iconRight="arrow-right">Read our mission</Button>
          </div>
        </div>
      </section>

      {/* ===== FEATURED JOBS ===== */}
      <section style={{ ...wrap, padding: '72px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Badge tone="accent" style={{ marginBottom: 12 }}>Open now</Badge>
            <h2 style={{ fontSize: 'clamp(28px, 3.6vw, 40px)' }}>Jobs near you today</h2>
          </div>
          <Button variant="ghost" onClick={() => go('browse')} iconRight="arrow-right">See all jobs</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {D.jobs.slice(0, 3).map((j) => (
            <Card key={j.id} hover pad={0} onClick={() => go('browse')} style={{ overflow: 'hidden' }}>
              <Photo src={j.photo} height={150} radius="0" alt={j.name} tint={false} />
              <div style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700 }}>{j.name}</h3>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent)', fontSize: 19 }}>${j.pay}</span>
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="map-pin" size={14} /> {j.area} · {j.dur}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ ...wrap, paddingBottom: 84 }}>
        <Card pad={0} style={{ background: 'var(--ink)', overflow: 'hidden', position: 'relative' }}>
          <div style={{ padding: '56px 48px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 3.6vw, 42px)' }}>Get something off your plate today.</h2>
            <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 17, marginTop: 14, maxWidth: 480, margin: '14px auto 0' }}>Join thousands of locals and students already helping each other out.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 30, flexWrap: 'wrap' }}>
              <Button size="lg" onClick={() => go('login')}>Post a job</Button>
              <Button size="lg" variant="outlineWhite" onClick={() => go('browse')}>Find work</Button>
            </div>
          </div>
          <span style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'color-mix(in srgb, var(--accent) 40%, transparent)', filter: 'blur(40px)', right: -80, top: -120 }} />
          <span style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: 'color-mix(in srgb, var(--brand) 55%, transparent)', filter: 'blur(50px)', left: -90, bottom: -130 }} />
        </Card>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: '1px solid var(--line)' }}>
        <div style={{ ...wrap, padding: '36px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>Swifto</span>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', marginLeft: 2 }} />
          </div>
          <div style={{ display: 'flex', gap: 22, fontSize: 14, color: 'var(--ink-2)' }}>
            <span>Safety</span><span>Mission</span><span>Contact</span><span>Terms</span>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-3)' }}>© Swifto · Auckland, NZ</p>
        </div>
      </footer>
    </div>
  );
}
window.Landing = Landing;
