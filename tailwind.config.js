/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Baku MVP Colors (Ukiyo-e inspired)
        paper: '#FDFCF0',
        ink: '#2D2D2D',
        sky: '#8AB0AB',
        sunset: '#E6A57E',
        baku: '#5E548E'
      }
    },
  },
  plugins: [],
}
