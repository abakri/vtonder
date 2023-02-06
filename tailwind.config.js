module.exports = ({
  content: ["./src/**/*.tsx", "./src/**/*.ts"],
  theme: {
    fontFamily: {
      fredoka: ["Fredoka", "sans-serif"],
    },
    extend: {},
  },
  variants: { // all the following default to ['responsive']
    imageRendering: ['responsive'],
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ]
});
