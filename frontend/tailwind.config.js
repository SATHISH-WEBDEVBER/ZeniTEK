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
      },
      fontSize: {
        '2xs': ['0.8125rem', { lineHeight: '1.25rem' }],
        'xs': ['0.9375rem', { lineHeight: '1.45rem' }],   // ~15px-16px (previously 12px)
        'sm': ['1.03125rem', { lineHeight: '1.55rem' }],  // ~16.5px-17.5px (previously 14px)
        'base': ['1.125rem', { lineHeight: '1.75rem' }],  // ~18px-19px (previously 16px)
        'lg': ['1.25rem', { lineHeight: '1.85rem' }],     // ~20px-21px
        'xl': ['1.4375rem', { lineHeight: '2rem' }],      // ~23px-24px
        '2xl': ['1.75rem', { lineHeight: '2.25rem' }],    // ~28px-30px
        '3xl': ['2.25rem', { lineHeight: '2.65rem' }],    // ~36px-38px
        '4xl': ['2.875rem', { lineHeight: '1.15' }],      // ~46px-48px
        '5xl': ['3.5rem', { lineHeight: '1.1' }],         // ~56px-60px
      }
    },
  },
  plugins: [],
}
