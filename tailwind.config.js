/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        customBlue: '#2c3e50',  // Custom color ka naam aur value
      },
      animation: {
        marquee: 'marquee 200s  linear infinite', // Smooth continuous animation
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },  // Start off-screen right
          '100%': { transform: 'translateX(-100%)' }, // End off-screen left
        },
      },
    },
  },
  plugins: [],
}

