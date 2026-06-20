/* Swifto redesign — Browse + Apply modal (window.Browse) */
function Browse({ go }) {
  const { Button, Card, Badge, IconDisc, Field, Area, Photo } = window.UI;
  const { Icon, Stars } = window.SW;
  const D = window.DATA;
  const wrap = { maxWidth: 1160, margin: '0 auto', padding: '0 24px' };

  const [cat, setCat] = React.useState('All');
  const [q, setQ] = React.useState('');
  const [applied, setApplied] = React.useState(new Set());
  const [modal, setModal] = React.useState(null);
  const [form, setForm] = React.useState({ name: '', exp: '', avail: '' });

  const list = D.jobs.filter((j) =>
    (cat === 'All' || j.cat === cat) &&
    (!q || (j.name + j.area + j.cat).toLowerCase().includes(q.toLowerCase())));

  const earn = (p) => (p * 0.95).toFixed(2);
  const valid = form.name.trim() && form.exp.trim() && form.avail.trim();
  const submit = () => { setApplied((s) => new Set(s).add(modal.id)); setModal(null); setForm({ name: '', exp: '', avail: '' }); };

  return (
    <div>
      {/* header */}
      <section style={{ ...wrap, paddingTop: 48, paddingBottom: 8 }}>
        <Badge tone="accent" style={{ marginBottom: 12 }}>{D.jobs.length} open jobs in Auckland</Badge>
        <h1 style={{ fontSize: 'clamp(32px, 4.4vw, 50px)' }}>Find work that fits<br />around your week.</h1>
        {/* search + chips */}
        <div style={{ marginTop: 26, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }}><Icon name="search" size={19} /></span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs, suburbs, categories…"
              style={{ width: '100%', height: 52, padding: '0 16px 0 46px', borderRadius: 'var(--r-btn)', border: '1.5px solid var(--line)', background: 'var(--card)', fontFamily: 'var(--font-body)', fontSize: 15.5, color: 'var(--ink)', outline: 'none' }} />
          </div>
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 9, flexWrap: 'wrap' }}>
          {D.cats.map((c) => {
            const on = cat === c;
            return (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: '8px 16px', borderRadius: 'var(--r-pill)', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                fontFamily: 'var(--font-body)', border: `1.5px solid ${on ? 'transparent' : 'var(--line)'}`,
                background: on ? 'var(--ink)' : 'var(--card)', color: on ? '#fff' : 'var(--ink-2)', transition: 'all 0.18s var(--ease)',
              }}>{c}</button>
            );
          })}
        </div>
      </section>

      {/* grid */}
      <section style={{ ...wrap, padding: '24px 24px 84px' }}>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 16 }}>{list.length} job{list.length !== 1 ? 's' : ''}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {list.map((j) => {
            const isApplied = applied.has(j.id);
            return (
              <Card key={j.id} pad={0} hover style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative' }}>
                  <Photo src={j.photo} height={142} radius="0" alt={j.name} tint={false} />
                  <span style={{ position: 'absolute', top: 12, left: 12 }}><Badge tone="neutral" style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--ink)', backdropFilter: 'blur(4px)' }}>{j.cat}</Badge></span>
                  {j.urgent && <span style={{ position: 'absolute', top: 12, right: 12 }}><Badge tone="warning" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)' }}><Icon name="bolt" size={12} /> Urgent</Badge></span>}
                </div>
                <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <h3 style={{ fontSize: 17.5, fontWeight: 700 }}>{j.name}</h3>
                      <p style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 3 }}>{j.detail}</p>
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent)', fontSize: 22 }}>${j.pay}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 13, color: 'var(--ink-2)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}><Icon name="map-pin" size={14} /> {j.area}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}><Icon name="clock" size={14} /> {j.dur}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--ink-2)', background: 'var(--success-soft)', color: 'var(--success)', padding: '7px 10px', borderRadius: 'var(--r-sm)', fontWeight: 600 }}>You'll earn ${earn(j.pay)} after fees</p>
                  <div style={{ marginTop: 'auto', paddingTop: 4 }}>
                    {isApplied ? (
                      <Button full variant="outline" disabled style={{ color: 'var(--success)', borderColor: 'color-mix(in srgb, var(--success) 40%, transparent)' }} icon="check">Applied</Button>
                    ) : (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button full size="sm" onClick={() => setApplied((s) => new Set(s).add(j.id))}>Quick apply</Button>
                        <Button size="sm" variant="outline" onClick={() => setModal(j)}>Details</Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* apply modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={() => setModal(null)} style={{ position: 'absolute', inset: 0, background: 'color-mix(in srgb, var(--ink) 55%, transparent)', backdropFilter: 'blur(6px)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 540, maxHeight: '92vh', overflowY: 'auto', background: 'var(--card)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-pop)' }}>
            <div style={{ position: 'relative' }}>
              <Photo src={modal.photo} height={150} radius="0" alt={modal.name} />
              <button onClick={() => setModal(null)} aria-label="Close" style={{ position: 'absolute', top: 14, right: 14, width: 38, height: 38, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.95)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)' }}><Icon name="close" size={20} /></button>
              <div style={{ position: 'absolute', bottom: 14, left: 18, color: '#fff' }}>
                <Badge tone="neutral" style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--ink)' }}>{modal.cat}</Badge>
                <h2 style={{ color: '#fff', fontSize: 26, marginTop: 8 }}>{modal.name}</h2>
              </div>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[['Location', modal.area, 'map-pin'], ['Duration', modal.dur, 'clock'], ['When', modal.when.split(' · ')[0], 'calendar']].map(([l, v, ic]) => (
                  <div key={l} style={{ background: 'var(--paper)', borderRadius: 'var(--r-md)', padding: '12px 14px' }}>
                    <span style={{ color: 'var(--brand)' }}><Icon name={ic} size={17} /></span>
                    <p style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 6 }}>{l}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, marginTop: 1 }}>{v}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--accent-soft)', borderRadius: 'var(--r-md)', padding: '14px 18px' }}>
                <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>You'll earn after fees</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'var(--accent-deep)' }}>${earn(modal.pay)}</span>
              </div>
              <Field label="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jordan Williams" />
              <Area label="Relevant experience" rows={3} value={form.exp} onChange={(e) => setForm({ ...form, exp: e.target.value })} placeholder="Tell them why you're a good fit…" />
              <Area label="Your availability" rows={2} value={form.avail} onChange={(e) => setForm({ ...form, avail: e.target.value })} placeholder={`Confirm you're free ${modal.when}`} />
              <Button full size="lg" disabled={!valid} onClick={submit} style={!valid ? { opacity: 0.5, cursor: 'not-allowed' } : null}>{valid ? 'Send application' : 'Fill in all fields'}</Button>
              <p style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center' }}>Payment is held safely and released only when the job is confirmed complete.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
window.Browse = Browse;
