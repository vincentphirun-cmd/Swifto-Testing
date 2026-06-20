/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Blue theme — design-handoff/redesign/styles.css [data-theme="blue"]
        ink: '#13293D',
        'ink-muted': '#3C5163',
        'ink-2': '#3C5163',
        'ink-3': '#6A7C8C',
        canvas: '#F1F6F8',
        paper: '#F1F6F8',
        line: '#DFE9ED',
        'line-card': '#E8EFF2',
        primary: '#1B98E0', // accent — CTAs
        secondary: '#137CBD', // accent-deep — hover / pressed
        'primary-soft': '#E1F1FB', // accent-soft
        accent: '#1B98E0',
        'accent-deep': '#137CBD',
        brand: '#006494',
        'brand-deep': '#0A2E4D',
        'brand-soft': '#E2EFF5',
        success: '#1F8A5B',
        'success-soft': '#E2F2EA',
        warning: '#C77800',
        'warning-soft': '#FBEFD6',
      },
      backgroundImage: {
        'hero-band': 'linear-gradient(160deg, #0A2E4D 0%, #006494 100%)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(19, 41, 61, 0.05), 0 10px 28px -12px rgba(19, 41, 61, 0.16)',
        lift: '0 18px 44px -16px rgba(19, 41, 61, 0.28)',
        pop: '0 24px 60px -18px rgba(19, 41, 61, 0.34)',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '3xl': '1.875rem',
        btn: '14px',
      },
      maxWidth: {
        content: '1160px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        swifto: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
