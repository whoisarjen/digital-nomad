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
          50: '#EFFEFA',
          100: '#C7FBF0',
          200: '#90F7E1',
          300: '#51E8CE',
          400: '#22D0B7',
          500: '#2A9D8F',
          600: '#1E7D72',
          700: '#1A655C',
          800: '#194F4A',
          900: '#17423E',
          950: '#072724',
        },
        accent: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },
        navy: {
          600: '#1E3A5F',
          700: '#1A365D',
          800: '#153050',
          900: '#0F2440',
          950: '#0A1628',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
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

