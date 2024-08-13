/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "regal-pink": "#D40C73",
        "regal-blue": "#1423A4",
      },
    },
  },
  plugins: [],
};
