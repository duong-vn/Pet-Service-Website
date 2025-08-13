// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Light mode
        "primary-light": "#DBA39A",
        "secondary-light": "#FFB4A2",
        "accent-light": "#FFB4A2",
        "neutral-light": "#DEF5E5",
        "background-light": "#F9F9F9",

        // Dark mode
        "primary-dark": "#183D3D",
        "secondary-dark": "#5C8374",
        "accent-dark": "#5C8374",
        "neutral-dark": "#93B1A6",
        "background-dark": "#040D12",
      },
      fontFamily: {
        normal: ["Quicksand-Bold", "Kalam-Bold", "system-ui", "sans-serif"],
        display: ["Kalam-Bold", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        "inset-lg": "inset 0 4px 10px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
