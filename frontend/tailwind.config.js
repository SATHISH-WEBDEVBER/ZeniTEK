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
      // Type scale (1rem = 16px). Small UI steps grow gently; headings step by ~1.2-1.25.
      // Floor is 12px for legibility; body copy is 16px with ~1.6 line height.
      fontSize: {
        '2xs': ['0.75rem', { lineHeight: '1rem' }],       // 12px  captions, badges (minimum)
        'xs': ['0.8125rem', { lineHeight: '1.25rem' }],   // 13px  labels, meta text
        'sm': ['0.9375rem', { lineHeight: '1.5rem' }],    // 15px  secondary text, buttons
        'base': ['1rem', { lineHeight: '1.625rem' }],     // 16px  body copy
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],    // 18px  lead paragraphs
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],     // 20px  card titles
        '2xl': ['1.5rem', { lineHeight: '2rem' }],        // 24px  h3
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],   // 30px  h2 (mobile)
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],     // 36px  h2
        '5xl': ['3rem', { lineHeight: '1.1' }],           // 48px  h1
        '6xl': ['3.75rem', { lineHeight: '1.05' }],       // 60px  hero h1
        '7xl': ['4.5rem', { lineHeight: '1' }],           // 72px  display
      }
    },
  },
  plugins: [],
}
