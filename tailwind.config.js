/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dream: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6ff',
          300: '#a3b9ff',
          400: '#7b8eff',
          500: '#5b6bff',
          600: '#4c50f7',
          700: '#3f3ee3',
          800: '#3233b8',
          900: '#2e3092',
        }
      },
      fontFamily: {
        'dream': ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}