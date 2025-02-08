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
        colorFirst : '#FFFFFF',
        colorSecond : '#FBFBFB', 
        colorThird : '#F9F9F9',
        
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


