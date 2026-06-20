/* Swifto redesign — app shell, router + Tweaks (window.App) */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "blue",
  "font": "bricolage",
  "radius": "soft",
  "imagery": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState('home');
  const [authed, setAuthed] = React.useState(false);
  const [role, setRole] = React.useState('student');

  // apply tweaks to <html>
  React.useEffect(() => {
    const r = document.documentElement;
    r.dataset.theme = t.theme;
    r.dataset.font = t.font;
    r.dataset.radius = t.radius;
    r.dataset.imagery = t.imagery ? 'on' : 'off';
  }, [t.theme, t.font, t.radius, t.imagery]);

  React.useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' }); }, [route]);

  const go = (key) => {
    if ((key === 'dashboard') && !authed) { setRoute('login'); return; }
    setRoute(key);
  };
  const login = (r) => { setRole(r); setAuthed(true); setRoute('dashboard'); };
  const logout = () => { setAuthed(false); setRoute('home'); };

  let screen;
  if (route === 'browse') screen = <window.Browse go={go} />;
  else if (route === 'login') screen = <window.Login onLogin={login} />;
  else if (route === 'dashboard') screen = <window.Dashboard go={go} />;
  else if (route === 'mission') screen = <window.Mission go={go} />;
  else screen = <window.Landing go={go} />;

  const { TweaksPanel, TweakSection, TweakRadio, TweakToggle } = window;

  return (
    <div style={{ minHeight: '100vh' }}>
      <window.Nav route={route} go={go} authed={authed} role={role} logout={logout} />
      {screen}
      <TweaksPanel>
        <TweakSection label="Direction" />
        <TweakRadio label="Palette" value={t.theme}
          options={[{ value: 'coral', label: 'Coral' }, { value: 'blue', label: 'Blue' }, { value: 'green', label: 'Green' }]}
          onChange={(v) => setTweak('theme', v)} />
        <TweakRadio label="Headline font" value={t.font}
          options={[{ value: 'bricolage', label: 'Bricolage' }, { value: 'inter', label: 'Inter' }, { value: 'space', label: 'Space' }]}
          onChange={(v) => setTweak('font', v)} />
        <TweakSection label="Shape & imagery" />
        <TweakRadio label="Corners" value={t.radius}
          options={[{ value: 'soft', label: 'Soft' }, { value: 'pill', label: 'Pill' }, { value: 'sharp', label: 'Sharp' }]}
          onChange={(v) => setTweak('radius', v)} />
        <TweakToggle label="Photography" value={t.imagery} onChange={(v) => setTweak('imagery', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
