/* Swifto redesign — Student dashboard (window.Dashboard) */
function Dashboard({ go }) {
  const { Button, Card, Badge, IconDisc, Photo } = window.UI;
  const { Icon, Stars } = window.SW;
  const D = window.DATA;
  const wrap = { maxWidth: 1160, margin: '0 auto', padding: '0 24px' };

  const stats = [
    { icon: 'briefcase', tone: 'brand', label: 'Active jobs', value: '3', sub: '2 awaiting confirmation' },
    { icon: 'check-circle', tone: 'success', label: 'Completed', value: '27', sub: 'all-time' },
    { icon: 'star', tone: 'accent', label: 'Rating', value: '4.9', sub: 'from 23 reviews' },
  ];
  const active = [
    { ...D.jobs[0], status: 'In progress', tone: 'brand' },
    { ...D.jobs[2], status: 'Awaiting confirm', tone: 'warning' },
    { ...D.jobs[4], status: 'Scheduled', tone: 'neutral' },
  ];

  return (
    <div style={{ ...wrap, padding: '40px 24px 84px' }}>
      {/* greeting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
        <span style={{ width: 54, height: 54, borderRadius: '50%', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}><Photo src={D.photos.avatar1} radius="50%" tint={false} style={{ height: '100%' }} /></span>
        <div>
          <p style={{ fontSize: 14, color: 'var(--ink-3)' }}>Welcome back,</p>
          <h1 style={{ fontSize: 28 }}>Mia Tipene</h1>
        </div>
      </div>

      {/* top: balance + stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 2fr', gap: 18, marginBottom: 18 }}>
        {/* balance card */}
        <Card pad={0} style={{ overflow: 'hidden', background: 'var(--hero-band)', position: 'relative' }}>
          <div style={{ padding: 26, color: '#fff', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <IconDisc name="wallet" size={40} style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }} />
              <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Available balance</span>
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 46, marginTop: 16, color: '#fff' }}>$184.50</p>
            <Button variant="white" full style={{ marginTop: 18 }} icon="arrow-up-right">Withdraw earnings</Button>
          </div>
          <span style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'color-mix(in srgb, var(--accent) 45%, transparent)', filter: 'blur(36px)', right: -60, bottom: -70 }} />
        </Card>
        {/* stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {stats.map((s) => (
            <Card key={s.label} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <IconDisc name={s.icon} tone={s.tone} />
              <div style={{ marginTop: 18 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 34 }}>{s.value}</p>
                <p style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{s.label}</p>
                <p style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>{s.sub}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* active jobs + side actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr', gap: 18 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20 }}>Active jobs</h2>
            <Button size="sm" variant="ghost" onClick={() => go('browse')} iconRight="arrow-right">Find more</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {active.map((j) => (
              <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 12, borderRadius: 'var(--r-md)', border: '1px solid var(--line-card)' }}>
                <span style={{ width: 52, height: 52, borderRadius: 'var(--r-sm)', overflow: 'hidden', flexShrink: 0 }}><Photo src={j.photo} radius="0" tint={false} style={{ height: '100%' }} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 15.5 }}>{j.name}</p>
                  <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 1 }}>{j.area} · {j.when.split(' · ')[0]}</p>
                </div>
                <Badge tone={j.tone}>{j.status}</Badge>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent)', fontSize: 18 }}>${j.pay}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* side: achievement + quick links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card style={{ background: 'var(--accent-soft)', border: '1px solid color-mix(in srgb, var(--accent) 22%, transparent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <IconDisc name="trophy" tone="accent" size={48} style={{ background: '#fff' }} />
              <div>
                <p style={{ fontWeight: 800, fontSize: 16, color: 'var(--accent-deep)' }}>Rising star</p>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 1 }}>3 more jobs to your next badge</p>
              </div>
            </div>
            <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.6)', marginTop: 16, overflow: 'hidden' }}>
              <div style={{ width: '72%', height: '100%', background: 'var(--accent)', borderRadius: 99 }} />
            </div>
          </Card>
          {[['user', 'Edit profile'], ['wallet', 'Payment & payouts'], ['check-circle', 'Completed jobs'], ['trophy', 'Achievements']].map(([ic, label]) => (
            <Card key={label} hover onClick={() => {}} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
              <IconDisc name={ic} tone="brand" size={42} />
              <span style={{ fontWeight: 600, fontSize: 15 }}>{label}</span>
              <span style={{ marginLeft: 'auto', color: 'var(--ink-3)' }}><Icon name="arrow-right" size={18} /></span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
window.Dashboard = Dashboard;
