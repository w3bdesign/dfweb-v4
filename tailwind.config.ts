import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#2563eb" /* Primary button color */,
        secondary: "#3b82f6" /* Secondary button and link color */,
        accent: "#93c5fd" /* Focus and accent color */,
        footer: "#1f2937" /* Footer color */,
        background: "#e5e7eb" /* Main background color */,
        text: "#1f2937" /* Text color */,
        hover: "#60a5fa" /* Hover background color */,
      },
    },
  },
  plugins: [],
};
export default config;
