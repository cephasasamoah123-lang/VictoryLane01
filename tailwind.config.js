/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep bottle-green — the brand color
        primary: {
          50: '#eef4f1',
          100: '#d6e6de',
          200: '#adccbe',
          300: '#7fb09c',
          400: '#4e8d77',
          500: '#33705c',
          600: '#255547',
          700: '#1f3d33',
          800: '#193029',
          900: '#12211d',
        },
        // Antique brass gold — the accent, used for CTAs and highlights
        accent: {
          50: '#faf5ea',
          100: '#f2e5c7',
          200: '#e6cd97',
          300: '#d8b364',
          400: '#c99c40',
          500: '#b8863b',
          600: '#976a2e',
          700: '#785327',
          800: '#5c3f21',
          900: '#402c18',
        },
        // Deep berry — warm alternative to red, for sale/danger states
        berry: {
          50: '#faf0ee',
          100: '#f1d4cf',
          200: '#e0aaa1',
          300: '#c97c6d',
          400: '#a85142',
          500: '#8a3a2c',
          600: '#712f24',
          700: '#5a251c',
          800: '#421b15',
          900: '#2c120e',
        },
        // Warm stone gray, replaces default cool gray across the whole app
        gray: {
          50: '#f9f7f3',
          100: '#f1ede4',
          200: '#e3dcce',
          300: '#cabfa9',
          400: '#a99c85',
          500: '#8a7d68',
          600: '#6e6252',
          700: '#564c40',
          800: '#3a332a',
          900: '#26211b',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Poppins"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      screens: {
        'xs': '475px',
        // Default breakpoints are: sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [],
}
