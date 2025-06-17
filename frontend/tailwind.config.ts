/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFCE00", // Main yellow color
        black: "#000000",  // Black for buttons
        white: "#FFFFFF",  // White for background
      },
    },
  },
  plugins: [],
};