/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            DEFAULT: '#1e40af', // Ocean Blue
            light: '#3b82f6',
            dark: '#1e3a8a',
            bright: '#2563eb'
          },
          green: {
            DEFAULT: '#15803d', // Agri Green
            light: '#22c55e',
            dark: '#166534',
            deep: '#14532d'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
