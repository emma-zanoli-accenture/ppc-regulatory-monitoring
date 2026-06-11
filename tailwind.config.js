/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand spine. The anchor values (brand.700 / accent.500) mirror
        // src/config/brand.ts, which remains the single source of truth for
        // runtime usage. The surrounding shades are a derived tint/shade scale.
        brand: {
          50: '#eef5fb',
          100: '#d6e6f4',
          200: '#aecbe7',
          300: '#7aa9d4',
          400: '#4683bb',
          500: '#23649f',
          600: '#16538c',
          700: '#0f4c81', // BRAND.primaryColor
          800: '#0c3c66',
          900: '#0b3253',
          950: '#071f35',
        },
        accent: {
          50: '#ecfdf8',
          100: '#d0f8ed',
          200: '#a4efdc',
          300: '#6bdfc6',
          400: '#33c7ab',
          500: '#15b79e', // BRAND.accentColor
          600: '#0b9382',
          700: '#0c7569',
          800: '#0e5d55',
          900: '#0f4d47',
          950: '#022c2a',
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans Variable"',
          '"Plus Jakarta Sans"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)',
        'card-hover':
          '0 4px 12px -2px rgb(15 23 42 / 0.08), 0 2px 6px -2px rgb(15 23 42 / 0.06)',
        overlay: '0 20px 50px -12px rgb(15 23 42 / 0.35)',
        ring: '0 0 0 1px rgb(15 23 42 / 0.06)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'thinking-bounce': {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        'fade-in': 'fade-in 0.25s ease-out',
        'thinking-bounce': 'thinking-bounce 1.4s infinite ease-in-out both',
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
