module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "black-coffee": "#443838",
        "sonic-silver": "#746f6c",
        "silver-metallic": "#ada4a7",
        "pale-silver": "#C7BCBA",
        "lavender-blush": "#EDE1E5",
      },
      fontFamily: {
        bit: ["'Upheaval TT (BRK)'", "cursive"],
      },
      borderRadius: {
        paper:
          "15.9375rem 0.9375rem 14.0625rem 0.9375rem/0.9375rem 14.0625rem 0.9375rem 15.9375rem",
      },
      scale: {
        30: "0.30",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
