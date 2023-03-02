/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "325px",
      },
      colors: {
        reddit: "#1A1A1B",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
