const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans", "Noto Sans KR", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
