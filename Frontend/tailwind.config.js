/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '300': '30rem', // Add this line for custom height
      },
      colors: {
        customRed: '#f23f54',
      },
      
    },
  },
  plugins: [
    
  ],
}