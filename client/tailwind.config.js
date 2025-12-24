/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff1f0',   // Lightest red
          100: '#ffe1de',  // Very light red
          200: '#ffc8c1',  // Light red
          300: '#ffa59a',  // Medium light red
          400: '#ff7363',  // Medium red
          500: '#f84d3c',  // Core red
          600: '#e13a27',  // PGC Red (Target)
          700: '#c02e1f',  // Deep red
          800: '#a0271b',  // Forest red
          900: '#842318',  // Darkest red
        },
        secondary: {
          50: '#efefff',   // Lightest blue
          100: '#e1e0ff',  // Very light blue
          200: '#c7c6ff',  // Light blue
          300: '#a3a0fb',  // Medium light blue
          400: '#7a76f8',  // Medium blue
          500: '#534bf4',  // Core blue
          600: '#3c32e6',  // Strong blue
          700: '#2C2B6F',  // PGC Blue (Target)
          800: '#24235c',  // Deep blue
          900: '#1d1c4a',  // Darkest blue
        },
      },
      fontFamily: {
        sans: ['Roboto', '"Open Sans"', 'sans-serif'],
        serif: ['"Merriweather"', '"Playfair Display"', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
