// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Light mode
        "primary-light": "#E3FDFD",
        "secondary-light": "#CBF1F5",
        "accent-light": "#A6E3E9",
        "neutral-light": "#9CAFAA",
        "background-light": "#E3FDFD",

        // Dark mode
        "primary-dark": "#040D12",
        "secondary-dark": "#183D3D",
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
        "inset-lg": "inset 0 0px 10px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
