// tailwind.config.js
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      display: ["Inter", "system-ui", "sans-serif"],
      body: ["Inter", "system-ui", "sans-serif"],
      mono: ["Azeret Mono", "Courier Prime", "ui-monospace"],
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.neutral,
      indigo: colors.indigo,
      red: colors.red,
      yellow: colors.yellow,
      blue: colors.blue,
      coolGray: colors.gray,
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
