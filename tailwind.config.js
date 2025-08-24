/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF1493', // Hot Pink
          50: '#FFF0F8',
          100: '#FFE1F1',
          200: '#FFC2E4',
          500: '#FF1493',
          600: '#E6127E',
          700: '#CC1069',
          800: '#B30E54',
          900: '#990C3F'
        },
        secondary: {
          DEFAULT: '#000000',
          50: '#F7F7F7',
          100: '#E3E3E3',
          200: '#C8C8C8',
          500: '#6B7280',
          800: '#1F2937',
          900: '#111827'
        },
        punk: {
          pink: '#FF1493',
          black: '#000000',
          white: '#FFFFFF',
          gray: '#9CA3AF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-in': 'bounceIn 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' }
        }
      }
    },
  },
  plugins: [],
}