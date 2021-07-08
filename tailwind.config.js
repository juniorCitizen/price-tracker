module.exports = {
  purge: ['./src/client/index.html', './src/client/**/*.{vue,js,ts}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        custom: ['Open Sans'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
