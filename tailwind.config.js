/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: '#19012A',
      secondary: '#4D3A64',
      terciary: '#E93A88',
      white: '#ffffff',
      gray: colors.gray,
      red: colors.red,
      transparent: 'transparent',
    },
  },
  plugins: [],
}
