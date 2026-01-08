/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Otomatik import yerine direkt adresi gösteriyoruz:
    "node_modules/flowbite-react/dist/esm/**/*.mjs"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // Standart plugin
    require('flowbite/plugin')
  ],
}