module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
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
        180: "1.80",
        260: "2.60",
      },
      rotate: {
        160: "160deg",
      },
      animation: {
        "fade-up": "fadeUp 150ms ease-in-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": {
            opacity: 0,
            transform: "translateY(15%)",
            timing: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0%)",
            timing: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
