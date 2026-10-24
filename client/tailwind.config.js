/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: {
          DEFAULT: '#141414',
          subtle: '#181818',
          card: '#1a1a1a',
          hover: '#222222',
        },
        border: {
          DEFAULT: '#262626',
          subtle: '#1f1f1f',
          gold: 'rgba(212, 175, 55, 0.3)',
        },
        gold: {
          light: '#f7df87',
          hover: '#f0c75e',
          DEFAULT: '#d4af37',
          dark: '#aa8822',
          muted: 'rgba(212, 175, 55, 0.15)',
        },
        muted: {
          DEFAULT: '#a3a3a3',
          dark: '#737373',
          light: '#d4d4d4'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 40px -5px rgba(212, 175, 55, 0.35)',
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f0c75e 0%, #d4af37 50%, #b8860b 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.15), transparent)',
        'dark-gradient': 'linear-gradient(180deg, rgba(20, 20, 20, 0.8) 0%, rgba(10, 10, 10, 0.95) 100%)',
      }
    },
  },
  plugins: [],
}
