/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      colors: {
        void:     '#0f0f1a',
        darkbg:   '#13132b',
        darkcard: '#1e1b4b',
        primary:  '#7c3aed',
        accent:   '#06b6d4',
      },
      fontFamily: {
        sans: ['Inter', 'Eudoxus Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
