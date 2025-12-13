/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F9F9F7',
          50: '#FFFFFF',
          100: '#FCFCFA',
          200: '#F9F9F7',
          300: '#F0F0EB',
        },
        beige: {
          DEFAULT: '#E6E2DD',
          100: '#F2F0ED',
          200: '#E6E2DD',
          300: '#D9D5CF',
        },
        olive: {
          DEFAULT: '#3A4D39',
          light: '#4F6F4E',
          dark: '#2A3829',
        },
        terracotta: {
          DEFAULT: '#9C5C45',
          light: '#B57B66',
          dark: '#7A4634',
        },
        slate: {
          DEFAULT: '#2F3E46',
          light: '#4A5D66',
          dark: '#1D262B',
        },
        charcoal: {
          DEFAULT: '#1A1A1A',
          500: '#2D2D2D',
          900: '#1A1A1A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
