import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        reader: {
          light: "#faf8f5",
          dark: "#1a1a1a",
          sepia: "#f4ecd8",
        },
      },
    },
  },
  plugins: [typography],
};
