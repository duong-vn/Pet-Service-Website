// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        
       // Light mode
       'primary-light': '#D6A99D',
       'secondary-light': '#FBF3D5',
       'accent-light': '#D6DAC8',
       'neutral-light': '#9CAFAA',
       'background-light':'#F4F1ED',

       // Dark mode
       'primary-dark': '#262b37',
       'secondary-dark': '#2C2C2C',
       'accent-dark': '#3E4A42',
       'neutral-dark': '#B3BFB9',
       'background-dark':'#1E1E1E',
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
