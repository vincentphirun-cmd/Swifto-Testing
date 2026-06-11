/* Swifto Student Dashboard — balance, welcome, and tile grid. */
function DashboardScreen({ onNavigate, onLogout }) {
  const { Button, DashboardTile } = window.SwiftoDesignSystem_8a726e;
  const { Icon } = window.SwiftoIcons;
  const wrap = { maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 2rem' };

  const tiles = [
    { icon: 'user', title: 'Profile', caption: 'View and edit your profile', go: 'dashboard' },
    { icon: 'dollar', title: 'Withdraw', caption: 'Withdraw your earnings', go: 'dashboard' },
    { icon: 'search', title: 'Browse Jobs', caption: 'Search and find available jobs', go: 'browse' },
    { icon: 'briefcase', title: 'Active Jobs', highlight: '3 active', caption: '2 pending', go: 'dashboard' },
    { icon: 'check-circle', title: 'Jobs Completed', caption: 'View your completed jobs', go: 'dashboard' },
    { icon: 'sparkles', title: 'Achievements', caption: 'View your milestones', go: 'dashboard' },
  ];

  return (
    <div style={{ background: 'var(--surface-brand)', minHeight: '80vh', padding: '4rem 0' }}>
      <div style={wrap}>
        {/* Balance + withdraw */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-full)', background: 'var(--primary-10)', color: 'var(--swifto-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="dollar" size={26} /></span>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--text-muted)', fontWeight: 'var(--weight-medium)' }}>Available Balance</p>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)' }}>$184.50</h2>
            </div>
          </div>
          <Button variant="white" onClick={() => {}}>Withdraw Earnings</Button>
        </div>

        <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--on-primary)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-2xl)' }}>Welcome back, Maia!</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {tiles.map((t) => (
            <DashboardTile key={t.title} title={t.title} highlight={t.highlight} caption={t.caption}
              icon={<Icon name={t.icon} size={40} />} onClick={() => onNavigate(t.go)} />
          ))}
        </div>
      </div>
    </div>
  );
}
window.DashboardScreen = DashboardScreen;
