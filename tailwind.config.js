/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,jsx,ts,tsx}",
    "./formkit.config.ts",
    "./node_modules/vue-tailwind-datepicker/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "app-bg": "url('/public/wave.svg')",
      },
      backgroundSize: {
        btn: "200% auto",
      },
      backgroundPosition: {
        "btn-hover": "right center",
      },
      colors: {
        "border-gray": "#ffffff59",
        "vtd-primary": colors.pink,
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
