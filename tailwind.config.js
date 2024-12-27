/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      primary: 'Poppins',
    },
    extend: {
      colors: {

        colorFirst : '#6B737D',
        colorSecond : '#8CC0FF',
        colorThird : '#D9E9FD',
        colorFourth : '#465F7D',
        colorFifth : '#ADBACA',

        primary: '#212121', // Özel renk
        secondary: '#D9F2F7',
        blue: '#DEF0F8',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1440px',
      },
    },
  },
  plugins: [],
}


