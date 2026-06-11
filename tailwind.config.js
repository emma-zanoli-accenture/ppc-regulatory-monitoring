/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand spine (navy primary). Anchor brand.700 mirrors src/config/brand.ts.
        brand: {
          50: '#eef3f8',
          100: '#d5e2ee',
          200: '#aec6dd',
          300: '#7ea4c6',
          400: '#4d7fab',
          500: '#2c6093',
          600: '#1a5081',
          700: '#0f4c81', // BRAND.primaryColor
          800: '#0d3a61',
          900: '#0c2f4d',
          950: '#081d31',
        },
        // Teal accent — used sparingly (the signature rule, "agentic", active state).
        accent: {
          50: '#edf7f4',
          100: '#cfeae3',
          200: '#a3d6cb',
          300: '#6dbbac',
          400: '#3d9c8b',
          500: '#1f8576', // muted from BRAND.accentColor #15b79e
          600: '#15705f', // BRAND.accentColor anchor (deepened/muted)
          700: '#155b4f',
          800: '#144940',
          900: '#123c35',
          950: '#06231e',
        },
      },
      fontFamily: {
        sans: [
          '"IBM Plex Sans"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        mono: [
          '"IBM Plex Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      fontSize: {
        // Tighter, intentional line-heights for a dense UI.
        '2xs': ['0.6875rem', { lineHeight: '0.875rem', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        // Small, consistent radii — no pill-everything. Caps the larger steps so
        // legacy rounded-xl/2xl shrink to a crisp enterprise corner automatically.
        none: '0',
        sm: '3px',
        DEFAULT: '5px',
        md: '6px',
        lg: '7px',
        xl: '8px',
        '2xl': '10px',
        '3xl': '12px',
        full: '9999px',
      },
      boxShadow: {
        // Flat by default — surfaces are defined by hairline borders, not shadow.
        card: 'none',
        'card-hover': '0 1px 2px 0 rgb(13 38 61 / 0.06), 0 2px 4px -2px rgb(13 38 61 / 0.05)',
        // Real elevation only for things that float above the page.
        overlay: '0 16px 40px -16px rgb(8 29 49 / 0.35), 0 2px 8px -3px rgb(8 29 49 / 0.18)',
        focus: '0 0 0 3px rgb(15 76 129 / 0.18)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        // Engineered, understated "working" pulse (no bounce).
        'pulse-soft': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
        // Thin determinate-looking sweep for the AI indicator.
        sweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite',
        'fade-in': 'fade-in 0.2s ease-out',
        'pulse-soft': 'pulse-soft 1.2s ease-in-out infinite',
        sweep: 'sweep 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
};
