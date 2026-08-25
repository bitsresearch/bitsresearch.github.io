/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './App.tsx',
    './index.tsx',
    './blogPosts.ts',
    './types.ts',
    './components/**/*.{ts,tsx}',
    './blog/**/*.html',
    './public/**/*.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        earth: { 50: '#F5F2ED', 100: '#EBE8E1', 200: '#DAD5CB', 300: '#D1C7BE', 400: '#B8AEA4', 500: '#948D81', 600: '#7A7267', 700: '#5C5148', 800: '#3E3630', 900: '#1A1614' },
        sage: { 50: '#F2F5F3', 100: '#E6EBE7', 200: '#CDD8CF', 300: '#B4C4B7', 400: '#9BB1A0', 500: '#8F9F8C', 600: '#728070', 700: '#566054', 800: '#3A4038', 900: '#1D201C' },
      },
      fontFamily: {
        sans: ['Verdana', 'Geneva', 'Tahoma', 'sans-serif'],
        serif: ['Chewy', 'cursive'],
        hyperlegible: ['Atkinson Hyperlegible', 'Verdana', 'sans-serif'],
      },
      borderRadius: { '3xl': '1.5rem', '4xl': '2rem' },
    },
  },
  plugins: [],
};
