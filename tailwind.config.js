/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{html,js}',
    './containers/**/*.{html,js}',
    './pages/**/*.{html,js}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A'
        }
      }
    },
    container: {
      center: true,
      screens: {
        '2xl': '1400px',
        xl: '1280px',
        lg: '1024px',
        md: '100vw',
        sm: '100%',
      },
    },
  },
  plugins: [],
}

