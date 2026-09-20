/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sunflower: {
          50: '#fffef0',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        cream: {
          50: '#ffffff',
          100: '#fdfbf7',
          200: '#faf6ee',
          300: '#f5eee1',
          400: '#ebdcc8',
        },
        petal: {
          pink: '#fce7f3',
          rose: '#fbcfe8',
          sage: '#dcfce7',
          olive: '#6b7280',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        handwriting: ['"Caveat"', '"Dancing Script"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', '"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'polaroid': '0 4px 15px -1px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.05)',
        'polaroid-hover': '0 20px 25px -5px rgba(234, 179, 8, 0.15), 0 8px 10px -6px rgba(234, 179, 8, 0.1)',
        'wax-seal': '0 4px 10px rgba(161, 98, 7, 0.35)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'sway': 'sway 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.4))' },
          '50%': { filter: 'drop-shadow(0 0 25px rgba(250, 204, 21, 0.75))' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        }
      }
    },
  },
  plugins: [],
}
