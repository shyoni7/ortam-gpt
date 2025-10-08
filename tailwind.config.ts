import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E0F7FB",
          100: "#B3EBF5",
          200: "#80DEEF",
          300: "#4DD0E1",
          400: "#26C6DA",
          500: "#06B6D4",
          600: "#0396B7",
          700: "#027494",
          800: "#015471",
          900: "#013549"
        },
        accent: {
          50: "#FDF2F8",
          100: "#FCE7F3",
          200: "#FBCFE8",
          300: "#F9A8D4",
          400: "#F472B6",
          500: "#EC4899",
          600: "#DB2777",
          700: "#BE185D",
          800: "#9D174D",
          900: "#831843"
        },
        slate: {
          950: "#0B1220"
        }
      },
      borderRadius: {
        lg: "16px"
      }
    }
  },
  plugins: [],
};

export default config;
