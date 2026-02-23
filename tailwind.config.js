/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          light: {
            bg: '#f2f2f7',
            card: '#ffffff',
            secondary: '#f9f9f9',
            border: '#d1d1d6',
            text: '#000000',
            textSecondary: '#3c3c43',
          },
          dark: {
            bg: '#000000',
            card: '#1c1c1e',
            secondary: '#2c2c2e',
            border: '#38383a',
            text: '#ffffff',
            textSecondary: '#ebebf5',
          }
        }
      },
      backdropSaturate: {
        180: '1.8',
      },
    },
  },
  plugins: [],
}
