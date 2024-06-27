/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#000000',
        'dark-text': '#FFFFFF',
        'dark-nav': '#1F2937',
      },
    },
  },
  plugins: [],
});
