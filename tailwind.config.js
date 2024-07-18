/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#508D4E",
        secondary: "#97BE5A",
        third: "#ffd105",
        fourth: "#1A5319",
        fifth: "#D4E7C5",
        success: "#149c0c",
        secondaryShade: "#aa8616",
        white: "#fff",
        textColor: "#000"
      },
      fontFamily: {
        ubuntu: ["Ubuntu", "Arial"]
      }
    },
  },
  plugins: [],
}

