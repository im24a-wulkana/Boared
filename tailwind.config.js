/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        veryDarkWood: '#2c1a0e',
        darkMahogany: '#3d2512',
        mediumDarkWood: '#5c3520',
        goldenTan: '#d4a96a',
        ivory: '#f5e6c8',
        nearBlack: '#1a0a02',
        warmAmber: '#c8873a',
        woodText: '#f0e0c0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
