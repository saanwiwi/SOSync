/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'earth-radar': '#020817', // Dark blue background as requested
        'sosync-blue': '#020817', // Deep midnight navy background
        'sosync-dark-green': '#022c22', // Dark green for panels and cards
        'sosync-emerald': '#064e3b',
      },
    },
  },
  plugins: [],
}