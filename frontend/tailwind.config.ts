/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        earthy: {
          light: '#F9F8F3', 
          dark: '#0A2F1D',  
          accent: '#D4AF37', 
        }
      }
    },
  },
  plugins: [],
}