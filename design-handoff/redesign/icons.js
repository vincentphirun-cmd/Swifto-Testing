/* Swifto redesign — icon set (Heroicons outline, 2px). window.SW.Icon */
(function () {
  const P = {
    'map-pin': ['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', 'M15 11a3 3 0 11-6 0 3 3 0 016 0z'],
    'shield-check': ['M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'],
    'lock': ['M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'],
    'search': ['M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'],
    'user': ['M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'],
    'users': ['M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6-3a3 3 0 10-2.8-4', 'M9 11a3 3 0 100-6 3 3 0 000 6z'],
    'briefcase': ['M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'],
    'check-circle': ['M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'],
    'check': ['M5 13l4 4L19 7'],
    'wallet': ['M21 12V7H5a2 2 0 010-4h14v4', 'M3 5v14a2 2 0 002 2h16v-5', 'M18 12a2 2 0 000 4h4v-4h-4z'],
    'sparkles': ['M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'],
    'bolt': ['M13 10V3L4 14h7v7l9-11h-7z'],
    'heart': ['M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'],
    'star': ['M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'],
    'clock': ['M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'],
    'arrow-right': ['M13 7l5 5m0 0l-5 5m5-5H6'],
    'arrow-up-right': ['M7 17L17 7m0 0H8m9 0v9'],
    'chevron-down': ['M6 9l6 6 6-6'],
    'close': ['M6 18L18 6M6 6l12 12'],
    'menu': ['M4 6h16M4 12h16M4 18h16'],
    'plus': ['M12 5v14M5 12h14'],
    'calendar': ['M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'],
    'trophy': ['M8 21h8m-4-4v4m7-17H5v2a7 7 0 0014 0V4z', 'M5 4H3v3a3 3 0 003 3m13-6h2v3a3 3 0 01-3 3'],
  };
  function Icon({ name, size = 24, stroke = 'currentColor', strokeWidth = 1.9, fill = 'none', style, className }) {
    const d = P[name] || [];
    return React.createElement('svg', { width: size, height: size, viewBox: '0 0 24 24', fill, stroke, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', style, className, 'aria-hidden': true }, d.map((p, i) => React.createElement('path', { key: i, d: p })));
  }
  function Stars({ value = 5, size = 16 }) {
    return React.createElement('span', { style: { display: 'inline-flex', gap: 1, color: 'var(--accent)' } },
      [1,2,3,4,5].map((s) => React.createElement('svg', { key: s, width: size, height: size, viewBox: '0 0 24 24', fill: s <= Math.round(value) ? 'currentColor' : 'var(--line)', 'aria-hidden': true },
        React.createElement('path', { d: P['star'][0] }))));
  }
  window.SW = { Icon, Stars };
})();
