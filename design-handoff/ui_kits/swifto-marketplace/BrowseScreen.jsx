/* Swifto Browse — search/filter bar + job rows with apply flow & modal. */
function BrowseScreen({ onNavigate }) {
  const { Button, Card, Badge, Input, Select, Textarea, Modal } = window.SwiftoDesignSystem_8a726e;
  const { Icon } = window.SwiftoIcons;

  const ALL = [
    { id: 1, name: 'Lawn mowing', area: 'Ponsonby, Auckland', date: 'Sat 14 Jun', time: 'Morning', duration: '2 hours', pay: 45, urgent: false },
    { id: 2, name: 'Moving boxes', area: 'Newmarket, Auckland', date: 'Sun 15 Jun', time: 'Afternoon', duration: '4 hours', pay: 120, urgent: true },
    { id: 3, name: 'Vacuuming', area: 'Grey Lynn, Auckland', date: 'Flexible', time: 'Any time', duration: '1 hour', pay: 30, urgent: false },
    { id: 4, name: 'Dog sitting', area: 'Parnell, Auckland', date: 'Sat–Sun', time: 'Weekend', duration: 'Weekend', pay: 80, urgent: false },
    { id: 5, name: 'Furniture assembly', area: 'Mt Eden, Auckland', date: 'Fri 13 Jun', time: 'Evening', duration: '3 hours', pay: 95, urgent: false },
  ];

  const [query, setQuery] = React.useState('');
  const [cat, setCat] = React.useState('');
  const [applied, setApplied] = React.useState(new Set());
  const [modalJob, setModalJob] = React.useState(null);
  const [form, setForm] = React.useState({ name: '', experience: '', availability: '' });

  const wrap = { maxWidth: 'var(--container-prose)', margin: '0 auto', padding: '0 2rem' };
  const list = ALL.filter((j) => !query || j.name.toLowerCase().includes(query.toLowerCase()) || j.area.toLowerCase().includes(query.toLowerCase()));

  const quickApply = (id) => setApplied((s) => new Set(s).add(id));
  const submit = () => { setApplied((s) => new Set(s).add(modalJob.id)); setModalJob(null); setForm({ name: '', experience: '', availability: '' }); };
  const earn = (pay) => (pay * 0.95).toFixed(2);
  const valid = form.name.trim() && form.experience.trim() && form.availability.trim();

  return (
    <div>
      <section style={{ background: 'var(--surface-brand)', padding: '3.5rem 0' }}>
        <div style={wrap}><h1 style={{ fontSize: 'var(--text-5xl)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-tight)', color: 'var(--on-primary)', textAlign: 'center' }}>Browse Jobs</h1></div>
      </section>

      <section style={{ background: 'var(--surface-page)', padding: '2.5rem 0 4rem' }}>
        <div style={wrap}>
          {/* Search + filters */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-placeholder)' }}><Icon name="search" size={20} /></span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search jobs by name, category, area…"
                style={{ width: '100%', height: 'var(--control-h)', padding: '0 1rem 0 2.75rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-input)', background: 'var(--surface-card)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-strong)', outline: 'none' }} />
            </div>
            <div style={{ width: 200 }}>
              <Select value={cat} onChange={(e) => setCat(e.target.value)} placeholder="All categories" options={[
                { value: 'moving', label: 'Moving' }, { value: 'cleaning', label: 'Cleaning' }, { value: 'yard-work', label: 'Yard Work' }, { value: 'pet-care', label: 'Pet Care' },
              ]} />
            </div>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Showing {list.length} of {ALL.length} jobs</p>

          {/* Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {list.map((j) => {
              const isApplied = applied.has(j.id);
              return (
                <Card key={j.id} padding="lg">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{j.name}</h3>
                          {j.urgent && <Badge tone="warning">Urgent rebook</Badge>}
                        </div>
                        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{j.area}</p>
                        <div style={{ display: 'flex', gap: '0.75rem', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          <span>{j.date}</span><span>·</span><span>{j.time}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Time: <b style={{ color: 'var(--text-strong)', fontWeight: 'var(--weight-medium)' }}>{j.duration}</b></span>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Pay: <b style={{ color: 'var(--swifto-primary)', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)' }}>${j.pay}</b></span>
                      </div>
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-body)' }}>You'll earn <b style={{ color: 'var(--swifto-primary)' }}>${earn(j.pay)}</b> after fees · released after both parties verify completion.</p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid var(--border-divider)' }}>
                      {isApplied ? (
                        <Badge tone="success" style={{ padding: '0.5rem 1.25rem', fontSize: 'var(--text-sm)', border: '2px solid var(--success-border)' }}>Applied</Badge>
                      ) : (
                        <>
                          <Button size="sm" onClick={() => quickApply(j.id)}>Quick Apply</Button>
                          <Button size="sm" variant="outline" onClick={() => setModalJob(j)}>Apply</Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Modal
        open={!!modalJob}
        onClose={() => setModalJob(null)}
        title="Apply for Job"
        subtitle={modalJob ? `${modalJob.name} · ${modalJob.area}` : ''}
        footer={<Button fullWidth disabled={!valid} onClick={submit}>{valid ? 'Submit Application' : 'Fill all fields to apply'}</Button>}
      >
        {modalJob && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'var(--surface-soft)', borderRadius: 'var(--radius-xl)', padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: 'var(--text-sm)' }}>
              <div><p style={{ color: 'var(--text-muted)' }}>Duration</p><p style={{ fontWeight: 'var(--weight-medium)', color: 'var(--text-strong)' }}>{modalJob.duration}</p></div>
              <div><p style={{ color: 'var(--text-muted)' }}>Pay</p><p style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--swifto-primary)' }}>${modalJob.pay}</p></div>
            </div>
            <Input label="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter your full name" />
            <Textarea label="Experience *" rows={3} value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="Tell us about your relevant experience…" />
            <Textarea label="Availability *" rows={2} value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} placeholder="Confirm your availability for this time slot…" />
          </div>
        )}
      </Modal>
    </div>
  );
}
window.BrowseScreen = BrowseScreen;
