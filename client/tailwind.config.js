/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cream': '#FFFBF2',
      },
      fontFamily: {
        'sixtyfour': ['Sixtyfour', 'monospace'],
        'funnel': ['Funnel Display', 'sans-serif'],
      }
    },
  },
  plugins: [],
}