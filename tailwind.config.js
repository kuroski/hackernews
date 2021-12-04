module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "isaac-900": "#443838",
        "isaac-800": "#746f6c",
        "isaac-700": "#ada4a7",
        "isaac-600": "#C7BCBA",
        "isaac-500": "#EDE1E5",
      },
      fontFamily: {
        bit: ["'Upheaval TT (BRK)'", "cursive"],
      },
      borderRadius: {
        paper:
          "15.9375rem 0.9375rem 14.0625rem 0.9375rem/0.9375rem 14.0625rem 0.9375rem 15.9375rem",
      },
      scale: {
        20: "0.20",
        30: "0.30",
      },
      rotate: {
        160: "160deg",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
