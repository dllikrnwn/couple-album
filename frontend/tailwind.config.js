/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAFAF9',
        rose: {
          DEFAULT: '#D4A5A5',
          light: '#E8D4D4',
          dark: '#B88B8B',
        },
        charcoal: '#1F1F1F',
        border: '#E5E5E5',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
