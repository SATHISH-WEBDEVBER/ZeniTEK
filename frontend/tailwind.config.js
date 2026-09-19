/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',      // Mobile M (375px)
      'mobile-l': '425px',// Mobile L (425px)
      'sm': '640px',      // Phablet
      'md': '768px',      // Tablet (768px)
      'lg': '1024px',     // Laptop (1024px)
      'xl': '1440px',     // Laptop L (1440px)
      '2xl': '1536px',    // Standard Desktop
      '3xl': '1920px',    // Full HD Desktop
      '4k': '2560px',     // 4K Ultra HD (2560px)
    },
    extend: {
      colors: {
        zenitek: {
          green: '#23AC39',
          blue: '#002DC2',
          navy: '#123B92',
          black: '#000000',
          white: '#FFFFFF',
        },
        brand: {
          blue: {
            DEFAULT: '#002DC2', // Vibrant Royal Blue
            light: '#002DC2',
            dark: '#123B92',   // Deep Navy Blue
            bright: '#002DC2'
          },
          green: {
            DEFAULT: '#23AC39', // Official Logo Green
            light: '#23AC39',
            dark: '#1a822b',
            deep: '#125c1e'
          },
          navy: '#123B92',
          black: '#000000',
          white: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.875rem' }], // 11px
        'xs': ['0.75rem', { lineHeight: '1.1rem' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],    // 14px
        'base': ['0.9375rem', { lineHeight: '1.45rem' }], // 15px (clean, compact readability)
        'lg': ['1.0625rem', { lineHeight: '1.6rem' }],    // 17px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],     // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],        // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],   // 30px
        '4xl': ['2.25rem', { lineHeight: '2.6rem' }],     // 36px
        '5xl': ['2.75rem', { lineHeight: '1.15' }],       // 44px
        '6xl': ['3.25rem', { lineHeight: '1.1' }],        // 52px
      }
    },
  },
  plugins: [],
}
