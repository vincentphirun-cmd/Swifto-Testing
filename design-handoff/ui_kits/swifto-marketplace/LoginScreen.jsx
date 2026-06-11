/* Swifto Login — centered card on a brand band; logs the user in (fake). */
function LoginScreen({ onLogin }) {
  const { Button, Input } = window.SwiftoDesignSystem_8a726e;
  const [email, setEmail] = React.useState('maia@student.ac.nz');
  const [password, setPassword] = React.useState('••••••••');

  return (
    <div style={{ background: 'var(--surface-brand)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
      <div style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)', padding: '2.5rem', width: '100%', maxWidth: '24rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-tight)', color: 'var(--text-strong)' }}>Welcome back</h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-body)', marginTop: '0.5rem' }}>Log in to your Swifto account</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onLogin('student'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" fullWidth onClick={() => onLogin('student')}>Log in</Button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          Don't have an account? <span style={{ color: 'var(--swifto-primary)', fontWeight: 'var(--weight-medium)', cursor: 'pointer' }} onClick={() => onLogin('lister')}>Sign up</span>
        </p>
      </div>
    </div>
  );
}
window.LoginScreen = LoginScreen;
