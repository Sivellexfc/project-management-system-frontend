/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    fontFamily: {
      primary: "Inter",
      logo: "'Poppins', sans-serif",
    },
    extend: {
      components: {
        okButton:
          "px-4 py-2 shadow-sm text-primary text-opacity-75 bg-colorFirst border border-borderColor rounded-md",
        cancelButton:
          "px-4 py-2 bg-colorSecond text-primary text-opacity-75 border-borderColor rounded-md mr-2",
      },
      colors: {
        borderColor: "#EEEEEE",
        optionHoverColor: "#F4F4F4",

        colorFirst: "#FFFFFF",
        colorSecond: "#FBFBFB",
        colorThird: "#F9F9F9",

        colorFourth: "#465F7D",
        colorFifth: "#ADBACA",

        primary: "#212121", // Özel renk
        secondary: "#D9F2F7",
        blue: "#DEF0F8",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1440px",
      },
    },
  },
  plugins: [],
};
