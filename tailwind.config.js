const { config } = require('@charcoal-ui/tailwind-config')
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [config],
}