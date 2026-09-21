import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        oswald: ['var(--font-oswald)'],
      },
      colors: {
        // Paleta tomada del logo oficial
        salvia: {
          50: '#f4f6f1',
          100: '#e4eadd',
          200: '#c9d5bd',
          400: '#8fa677',
          500: '#6f8a56',
          600: '#5b7346',  // verde del logo
          700: '#4a5e39',
          800: '#3a4a2d',
          900: '#2b3722',
        },
        durazno: {
          50: '#fdf8f4',
          100: '#f9ece1',
          200: '#f2dcc9',
          300: '#eecfb4',  // durazno del logo
          400: '#e0b795',
          600: '#c2916a',
        },
        cafe: {
          50: '#faf7f3',
          100: '#efe7dd',
          400: '#a89078',
          600: '#6f5a45',
          800: '#43362a',
          900: '#2a2119',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
