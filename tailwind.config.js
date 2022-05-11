const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    colors: {
      "loa-body": "#131419",
      "loa-panel": "#1c1c24",
      "loa-panel-border": "#262631",
      "loa-inactive": "#5f5f6e",
      "loa-button": "#2d2d3a",
      "loa-button-border": "#4447e2",
      "loa-white": "#ffffff",
      "loa-red": "#e24444",
    },
    extend: {
      fontFamily: {
        sans: ["Noto Sans", "Noto Sans KR", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
