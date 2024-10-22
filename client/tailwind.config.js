/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montreal: ["Montreal", "sans-serif"]
      },
      fontWeight: {
        regular: 400,
        bold: 700
      }
    }
  },
  plugins: []
};
